import { take, call, fork, put, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { loadIoTFlows } from '@iotflows/iotflows-js';
import Constant from 'constants/index';
import { processLogSprActions } from 'services/process-log-spr/process-log-spr-reducer';
import { OperationItem } from 'models';
import { getNumber } from 'utils';
import moment from 'moment';

var visitedIoTFlows = false;

const classifyAnomaly = (data) => {
    const anomalies = ['None', 'F1', 'F2'];
    const value = Math.random();
    let anomaly = '';
    if (value < 0.8) {
        anomaly = anomalies[0];
    } else if (value < 0.9) {
        anomaly = anomalies[1];
    } else {
        anomaly = anomalies[2];
    }
    const confidence = Math.min(60 + (Math.ceil(Math.random() * 100) % 60), 98);
    return { anomaly, confidence };
};

const stationFromDevice = (deviceName) => {
    return deviceName.split('_', 2).join('_');
};

function createUploader() {
    let emit;

    const chan = eventChannel((emitter) => {
        emit = emitter;
        return () => {}; // it's necessarily. event channel should
        // return unsubscribe function. In our case
        // it's empty function
    });

    const callback = (topic, payload) => {
        let data;
        try {
            data = JSON.parse(payload);
        } catch (err) {
            console.log(err);
        }
        // sanity check

        if (
            data !== undefined &&
            data['Rivet Curve data'] !== undefined &&
            data['Reference curve data'] !== undefined
        ) {
            const graphicData = [
                {
                    key: 'RIVET',
                    data: data['Rivet Curve data'].split(', '),
                    sampletime: data['Rivet Sample value'],
                    yscale: data['Rivet Y Scale'],
                    xscale: data['Rivet Sample value'],
                    xmin: data['Rivet length'] - data['RRC offset actual'] / 100,
                },
                {
                    key: 'REFERENCE',
                    data: data['Reference curve data'].split(', '),
                    sampletime: data['Reference sample value'],
                    yscale: data['Reference Y Scale'],
                    xscale: data['Reference sample value'],
                    xmin: data['Rivet length'] - data['RRC offset reference'] / 100,
                },
            ];
            data['GraphicalData'] = graphicData;
        } else {
            console.log('unknown structure');
            return;
        }

        // dictionary of MeasurementParameter key values
        // let dicMeasurementParameter = data
        // get date time
        // let dateTimeMillis = Date.parse(dicMeasurementParameter['Date/Time'])
        // helper function to parse Graphical Data
        function convertGraphicalDataToTimerSeries(parameter) {
            let timeseriesData: any = [];
            data.GraphicalData.forEach((item) => {
                if (item.key === parameter) {
                    const xscale = +item?.xscale;
                    const yscale = +item?.yscale;
                    const xmin = +item?.xmin;
                    item.data.forEach((datapoint, index) =>
                        timeseriesData.push({ x: index / xscale + xmin, y: getNumber((+datapoint / yscale) * 100) }),
                    );
                }
            });
            return timeseriesData;
        }

        const { anomaly, confidence } = classifyAnomaly({});

        const { Devicetype = 'SPR' } = data;
        const attachmentCnt = 2;

        const deviceName = data?.Devicename;
        const stationName = stationFromDevice(deviceName);

        //     // const measurementItem = dicMeasurementParameter;
        const operationItem: OperationItem = {
            id: `event-${Math.random()}`,
            systemType: 'SPR',
            deviceName,
            stationName,
            device: {
                name: deviceName,
                station: stationName,
                type: Devicetype,
                studId: data?.Program,
                studType: data?.WeldToolType || '',
            },
            time: moment(data['Date/Time']).toISOString().replace(/[ZT]/g, ' '),
            attachments: new Array(attachmentCnt).fill(0).map((i) => `img-${Math.ceil(Math.random() * 10) % 6}`),
            anomaly, // TODO: remove... randomly select an anomaly for now
            confidence,
            feedback: undefined,
            data: {
                rivetData: convertGraphicalDataToTimerSeries('RIVET'),
                referenceData: convertGraphicalDataToTimerSeries('REFERENCE'),
            },
            otherData: data,
        };

        emit({ operationItem });
    };

    const promises = [...Constant.IoTFlows.spr_data_streams_uuid].map(async (theTopic: string) => {
        const iotflows = await loadIoTFlows(Constant.IoTFlows.username, Constant.IoTFlows.password);
        visitedIoTFlows = true;
        return await iotflows.subscribe({
            data_stream_uuid: Constant.IoTFlows.spr_data_stream_uuid,
            subtopic_subscription: true,
            callback,
        });
    });

    return [Promise.all(promises), chan];
}

const unsubscribe = () => {
    if (!visitedIoTFlows) return;
    [...Constant.IoTFlows.spr_data_streams_uuid].map(async (theTopic: string) => {
        const iotflows = await loadIoTFlows(Constant.IoTFlows.username, Constant.IoTFlows.password);

        visitedIoTFlows = true;
        await iotflows.unsubscribe({
            data_stream_uuid: theTopic,
            subtopic_subscription: true,
        });
        console.log('unsubscribed', theTopic);
    });
};
export function* getAllProcessLogSprs(filters) {
    const { activityState } = filters.payload;
    console.log('live-filters', activityState, visitedIoTFlows);
    if (activityState !== 'active') {
        unsubscribe();
    } else {
        const [execPromise, chan] = createUploader();
        yield fork(watchOnProgress, chan);
        yield call(() => execPromise);
        yield put(processLogSprActions.loading(false));
    }
}

function* watchOnProgress(chan) {
    while (true) {
        const { operationItem = undefined } = yield take(chan);
        if (operationItem) {
            yield put(processLogSprActions.addOperationItem(operationItem));
        }
    }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllProcessLogSprsSaga() {
    // Watches for getProcessLogSprs actions and calls getProcessLogSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(processLogSprActions.getAllProcessLogSprs.type, getAllProcessLogSprs);
}

export default getAllProcessLogSprsSaga;

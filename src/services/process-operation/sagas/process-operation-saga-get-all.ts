import { take, call, fork, put, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { loadIoTFlows } from '@iotflows/iotflows-js';
import Constant from 'constants/index';
import { processOperationActions } from 'services/process-operation/process-operation-reducer';
import { OperationItem } from 'models';
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
    if (!deviceName) return;
    return deviceName.split('_', 2).join('_');
};

function createUploader() {
    let emit;

    const chan = eventChannel((emitter) => {
        emit = emitter;
        return unsubscribe;
    });

    const callback = (topic, payload) => {
        let jsonData;
        try {
            jsonData = JSON.parse(payload);
        } catch (err) {
            console.log(err);
        }
        // sanity check
        if (jsonData?.MeasurementData) {
            // dictionary of MeasurementParameter key values
            const dicMeasurementParameter = Object.assign(
                {},
                ...jsonData.MeasurementData?.MeasurementParameter?.map((x) => ({ [x.key]: x.value })),
            );

            // get date time
            const dateTime: number = moment(dicMeasurementParameter.DateTime).unix() * 1000;

            // helper function to parse Graphical Data
            const convertGraphicalDataToTimerSeries = (parameter) => {
                const timeSeriesData: any = [];
                jsonData.MeasurementData.GraphicalData?.forEach((item) => {
                    if (item.key === parameter) {
                        const scaleInfo = +item?.scaleInfo;
                        const scaleInfoReference = +item?.scaleInfoReference;
                        const sampleTime = +item?.sampletime;
                        const referenceIndex = +item?.referenceIndex;

                        item.data.forEach((datapoint, index) => {
                            // y axis scaling.
                            // y_real = scaleInfo/scaleInfoRef*y (Refer OPTIMA-1832)
                            const yDataPoint = (scaleInfo / scaleInfoReference) * +datapoint;

                            // x axis scaling.(starting at start time of weld, i is index of data point)
                            // x_real = start + (i-referenceIndex)*sampleTime*10^-3 (Refer OPTIMA-1832)
                            const xDataPoint = dateTime + (index - referenceIndex) * sampleTime * 0.001;
                            timeSeriesData.push([xDataPoint, yDataPoint]);
                        });
                    }
                });
                return timeSeriesData;
            };

            const { anomaly, confidence } = classifyAnomaly({});

            const { Devicetype = '' } = dicMeasurementParameter;
            const attachmentCnt = 2;

            const deviceName = dicMeasurementParameter.DeviceName;
            const stationName = stationFromDevice(deviceName);

            // const measurementItem = dicMeasurementParameter;
            const operationItem: OperationItem = {
                id: `event-${Math.random()}`,
                systemType: 'SWS',
                deviceName,
                stationName,
                device: {
                    name: deviceName,
                    station: stationName,
                    type: Devicetype,
                    studId: dicMeasurementParameter.StudID,
                    studType: dicMeasurementParameter.WeldToolType,
                },
                time: moment(dicMeasurementParameter.DateTime).toISOString().replace(/[ZT]/g, ' '),
                attachments: new Array(attachmentCnt).fill(0).map((i) => `img-${Math.ceil(Math.random() * 10) % 6}`),
                anomaly, // TODO: remove... randomly select an anomaly for now
                confidence,
                feedback: undefined,
                data: {
                    voltageData: convertGraphicalDataToTimerSeries('VOLTAGE'),
                    liftPositionData: convertGraphicalDataToTimerSeries('LIFT_POSITION'),
                    currentData: convertGraphicalDataToTimerSeries('CURRENT'),
                },
                otherData: dicMeasurementParameter,
            };

            emit({ operationItem });
        }
    };

    const promises = [...Constant.IoTFlows.data_streams_uuid].map(async (theTopic: string) => {
        const iotflows = await loadIoTFlows(Constant.IoTFlows.username, Constant.IoTFlows.password);

        visitedIoTFlows = true;
        return await iotflows.subscribe({
            data_stream_uuid: theTopic,
            callback,
        });
    });

    return [Promise.all(promises), chan];
}

/**
 *  repos request/response handler
 */
const unsubscribe = (actvity) => {
    if (!visitedIoTFlows) return;
    [...Constant.IoTFlows.data_streams_uuid].map(async (theTopic: string) => {
        const iotflows = await loadIoTFlows(Constant.IoTFlows.username, Constant.IoTFlows.password);

        visitedIoTFlows = true;
        await iotflows.unsubscribe({
            data_stream_uuid: theTopic,
            subtopic_subscription: true,
        });
    });
    if (!actvity) visitedIoTFlows = false;
};
export function* getAllOperationItems(filters) {
    const { activityState } = filters.payload;
    if (activityState !== 'active') {
        unsubscribe(activityState);
    } else {
        const [execPromise, chan] = createUploader();
        yield fork(watchOnProgress, chan);
        yield call(() => execPromise);
        yield put(processOperationActions.loading(false));
    }
}

function* watchOnProgress(chan) {
    while (true) {
        const { operationItem = undefined } = yield take(chan);
        if (operationItem) {
            yield put(processOperationActions.addOperationItem(operationItem));
        }
    }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllOperationItemsSaga() {
    // Watches for getOperationItems actions and calls getOperationItems when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    if (!visitedIoTFlows) {
        yield takeLatest(processOperationActions.getAllOperationItems.type, getAllOperationItems);
    }
}

export default getAllOperationItemsSaga;

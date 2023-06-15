import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { historicalDiagnosticActions } from 'services/historical-diagnostic/historical-diagnostic-reducer';
import { selectHistoricalDiagnosticFilters } from 'services/historical-diagnostic/historical-diagnostic-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, HistoricalDiagnostics } from 'models';
import { getLineFromCarclass } from 'utils';

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

export function* getAllHistoricalDiagnostics() {
    try {
        yield put(historicalDiagnosticActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectHistoricalDiagnosticFilters);
        let url = Constant.historicalDiagnostics;
        if (params.systemType === 'SPR') {
            url = Constant.historicalSPR;
        }
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                historicalDiagnosticActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }
        const options: any = {
            url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };
        const historicalDiagnosticsData: HistoricalDiagnostics = yield call(request, options);
        if (params.systemType === 'SWS') {
            const attachmentCnt = 2;
            console.log(historicalDiagnosticsData, 'historicalDiagnostics');
            const historicals = historicalDiagnosticsData.map((item: any) => {
                const data = item.values.map((val: any) => {
                    const { anomaly, confidence } = classifyAnomaly({});
                    const type = item.tags?.studId ? 'SWS' : 'SPR';
                    return {
                        id: `event-${Math.random()}`,
                        systemType: type,
                        deviceName: item.tags.deviceName,
                        stationName: item.tags.station,
                        studId: item.tags.studId || item.tags.program,
                        device: {
                            name: item.tags.deviceName,
                            station: item.tags.station,
                            type: item.tags.feederNo,
                            studId: item.tags.studId || item.tags.program,
                            studType: '',
                        },
                        attachments: new Array(attachmentCnt)
                            .fill(0)
                            .map((i) => `img-${Math.ceil(Math.random() * 10) % 6}`),
                        anomaly,
                        confidence,
                        feedback: undefined,
                        data: {},
                        otherData: item,
                        name: item.name,
                        time: val[0],
                        weldPoint: val[1],
                    };
                });
                return data;
            });
            yield put(historicalDiagnosticActions.setAllHistoricalDiagnostics(historicals));
        } else {
            console.log(historicalDiagnosticsData, 'historicalDiagnosticsData');
            const attachmentCnt = 2;
            const historicals = historicalDiagnosticsData.map((item: any) => {
                const data = item.values.map((val: any) => {
                    const { anomaly, confidence } = classifyAnomaly({});
                    const type = item.tags?.studId ? 'SWS' : 'SPR';
                    return {
                        id: `event-${Math.random()}`,
                        systemType: type,
                        deviceName: item.tags.deviceName,
                        stationName: item.tags.station,
                        studId: item.tags.studId || item.tags.program,
                        device: {
                            name: item.tags.deviceName,
                            station: item.tags.station,
                            type: item.tags.feederNo,
                            studId: item.tags.studId || item.tags.program,
                            studType: '',
                        },
                        attachments: new Array(attachmentCnt)
                            .fill(0)
                            .map((i) => `img-${Math.ceil(Math.random() * 10) % 6}`),
                        anomaly,
                        confidence,
                        feedback: undefined,
                        data: {},
                        otherData: item,
                        name: item.name,
                        time: val[0],
                        weldPoint: val[1],
                    };
                });
                return data;
            });
            yield put(historicalDiagnosticActions.setAllHistoricalSpr(historicals));
        }
    } catch (err: any) {
        console.warn('getAllHistoricalDiagnostics.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                historicalDiagnosticActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                historicalDiagnosticActions.error({
                    name: 'error',
                    message: 'Getting historicalDiagnostics failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(historicalDiagnosticActions.loading(false));
}

export function* getAllHistoricalDiagnosticsSaga() {
    yield takeLatest(historicalDiagnosticActions.getAllHistoricalDiagnostics.type, getAllHistoricalDiagnostics);
}

export default getAllHistoricalDiagnosticsSaga;

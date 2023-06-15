import { DateRange } from './../../components/OperationsForm/OperationsForm';
/*
 * Msg Slice
 *
 * Here we define:
 * - The shape of our auth container's slice of Redux store,
 * - All the actions which can be triggered for this slice, including their effects on the store.
 *
 * Note that, while we are using dot notation in our reducer, we are not actually mutating the state
 * manually. Under the hood, we use immer to apply these updates to a new copy of the state.
 * Please see https://immerjs.github.io/immer/docs/introduction for more information.
 *
 */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { Filters, DReportWidget, DReportWidgets } from 'models';
import { DReportWidgetsState } from '.';
import data from './sagas/data';
import { groupBy, transform, filter } from 'lodash';
import forEach from 'lodash/forEach';
import omit from 'lodash/omit';
import has from 'lodash/has';
import findIndex from 'lodash/findIndex';
import orderBy from 'lodash/orderBy';
import moment from 'moment';

// The initial state of the DReportWidget page
export const initialState: DReportWidgetsState = {
    dReportWidgets: [],
    dReportWidget: undefined,
    dReportWidgetsFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const dReportWidgetsSlice = createSlice({
    name: 'dReportWidgets',
    initialState,
    reducers: {
        getAllDReportWidgets(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllDReportWidgets(state, action: PayloadAction<any>) {
            let { payload } = action;
            let finalResult = {};
            forEach(payload, function (value) {
                forEach(value, function (item, key) {
                    if (key && key !== 'null') {
                        let viewType = item[0].view;
                        let grpData = groupBy(item, 'faultCode');
                        let convertedData: any = [];
                        let cycleData: any = [];
                        let targetData: any = [];
                        forEach(grpData, function (val, faultCodeKey) {
                            let eventRateData: any = [];
                            if (faultCodeKey && faultCodeKey !== 'null') {
                                val.forEach((element) => {
                                    const { eventCount, weldCount, view, week, year, month, faultCode, date } = element;
                                    const eventRate = !eventCount
                                        ? 0
                                        : +((+eventCount / (+eventCount + +weldCount)) * 100).toFixed(2);
                                    if (view === 'monthly') {
                                        cycleData.push({
                                            name: `${moment(month, 'M').format('MMM')} ${moment(year, 'YYYY').format(
                                                'YY',
                                            )}`,
                                            y: +weldCount,
                                        });
                                        eventRateData.push({
                                            name: `${moment(month, 'M').format('MMM')} ${moment(year, 'YYYY').format(
                                                'YY',
                                            )}`,
                                            y: eventRate,
                                            eventCount,
                                            weldCount,
                                            eventCode: faultCode,
                                        });
                                        targetData.push({
                                            name: `${moment(month, 'M').format('MMM')} ${moment(year, 'YYYY').format(
                                                'YY',
                                            )}`,
                                            y: 0.05,
                                        });
                                    }
                                    if (view === 'weekly') {
                                        cycleData.push({
                                            name: `${moment(year, 'YYYY').format(
                                                'YYYY',
                                            )}W${week}`,
                                            y: +weldCount,
                                        });
                                        eventRateData.push({
                                            name: `${moment(year, 'YYYY').format(
                                                'YYYY',
                                            )}W${week}`,
                                            y: eventRate,
                                            eventCount,
                                            weldCount,
                                            eventCode: faultCode,
                                            date,
                                        });
                                        targetData.push({
                                            name: `${moment(year, 'YYYY').format(
                                                'YYYY',
                                            )}W${week}`,
                                            y: 0.05,
                                        });
                                    }
                                });
                                eventRateData = orderBy(
                                    eventRateData,
                                    [
                                        function (o) {
                                            return moment(o?.date);
                                        },
                                    ],
                                    ['asc'],
                                );
                                if (findIndex(convertedData, { type: 'column' }) === -1) {
                                    convertedData.push({
                                        name: 'Cycles',
                                        color: '#149B74',
                                        data: cycleData,
                                        type: 'column',
                                    });
                                    convertedData.push({
                                        name: 'Target',
                                        // color: 'rgb(78,172,91)',
                                        yAxis: 1,
                                        data: targetData,
                                        dashStyle: 'ShortDash',
                                        marker: {
                                            enabled: false,
                                        },
                                    });
                                }
                                convertedData.push({
                                    name: faultCodeKey,
                                    data: eventRateData,
                                    type: 'line',
                                    yAxis: 1,
                                    tooltip: {
                                        pointFormat: `<tr><td style="color: {series.color}">Event Code : </td>
                                            <td style="text-align: left"><b>{point.eventCode}</b></td></tr>
                                            <tr><td style="color: {series.color}">Event Rate : </td>
                                            <td style="text-align: left"><b>{point.y}</b></td></tr>`,
                                    },
                                });
                            }
                        });
                        if (has(finalResult, key)) {
                            finalResult[key] = { ...finalResult[key], [viewType]: convertedData };
                        } else {
                            finalResult[key] = { [viewType]: convertedData };
                        }
                    }
                });
            });
            state.dReportWidgets = finalResult;
            state.isLoading = false;
        },

        setDReportWidget(state, action: PayloadAction<DReportWidget>) {
            state.dReportWidget = action.payload;
        },

        error(state, action: PayloadAction<CustomError>) {
            state.error = action.payload;
        },
        loading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        clear(state) {
            state = { ...initialState };
        },
    },
});

export const {
    actions: dReportWidgetActions,
    reducer: dReportWidgetReducer,
    name: dReportWidgetKey,
} = dReportWidgetsSlice;

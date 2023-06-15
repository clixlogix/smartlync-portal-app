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
import { Filters, MeasurementAggregateWidget, FilterNames } from 'models';
import { CycleGap, CycleGaps, CycleGapEvents, CycleGapEvent, CycleGapEventValue } from 'models';
import { MeasurementAggregateWidgetsState } from '.';
import { groupBy, transform, filter } from 'lodash';
import forEach from 'lodash/forEach';
import omit from 'lodash/omit';
import moment from 'moment';
import { CHART_DATE_TIME_DISPLAY_FORMAT } from 'constants/index';

// The initial state of the MeasurementAggregateWidget page
export const initialState: MeasurementAggregateWidgetsState = {
    measurementAggregateWidgets: [],
    measurementAggregateWidget: undefined,
    measurementAggregateWidgetsFilteredByRules: [],
    formattedCycleGapEvents: [],
    defaultEventValues: [],
    filters: {},
    defaultValues: {},
    filterValues: {},
    error: undefined,
    isLoading: false,
    localFilters: {},
};

const measurementAggregateWidgetsSlice = createSlice({
    name: 'measurementAggregateWidgets',
    initialState,
    reducers: {
        getAllMeasurementAggregateWidgets(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllMeasurementAggregateWidgets(state, action: PayloadAction<any>) {
            let { payload } = action;
            let { AllResult, events } = payload;
            const finalResult = {};
            forEach(AllResult, function (value, key) {
                let grpData = groupBy(value, 'tags.deviceName');
                let convertedData: any = [];
                const { filterValues = {} as any } = transform(
                    grpData,
                    function (acc, val, deviceKey) {
                        const name = deviceKey;
                        let data: any = [];
                        val.forEach((element) => {
                            const { deviceName, feederNo, outletNo, studId } = element?.tags;
                            element?.values.forEach((item) => {
                                data.push({
                                    x: moment(item[0]).valueOf(),
                                    y: item[1],
                                    time: item[0],
                                    measurementTime: item[1],
                                    deviceName,
                                    feederNo,
                                    outletNo,
                                    studId,
                                });
                            });

                            acc.filterValues[FilterNames.studId].add(`${studId}`);
                            acc.filterValues[FilterNames.outletNo].add(`${outletNo}`);
                            acc.filterValues[FilterNames.feederNo].add(`${feederNo}`);
                        });

                        convertedData.push({
                            name,
                            data,
                            type: 'scatter',
                            yAxis: 0,
                            marker: {
                                symbol: 'circle',
                            },
                        });
                        finalResult[key] = convertedData;
                        return acc;
                    },
                    {
                        filterValues: {
                            [FilterNames.feederNo]: new Set(),
                            [FilterNames.outletNo]: new Set(),
                            [FilterNames.studId]: new Set(),
                        },
                    },
                );
                state.isLoading = false;
                state.filterValues = filterValues;
            });
            /**** For Events ****/
            const groupedEventsData: { [key: string]: CycleGapEvents } = groupBy(events, 'tags.deviceName');
            const convertedEventsData: any = [];
            // const filterValuesEvents = {
            //     [FilterNames.studId]: new Set(),
            //     [FilterNames.outletNo]: new Set(),
            //     [FilterNames.feederNo]: new Set(),
            // };
            forEach(groupedEventsData, (device: CycleGapEvents, deviceId: string) => {
                const eventsData: any = [];
                forEach(device, (deviceData: CycleGapEvent) => {
                    const {
                        tags: { feederNo, outletNo, studId },
                        values,
                    } = deviceData;
                    studId && state.filterValues[FilterNames.studId].add(studId);
                    outletNo && state.filterValues[FilterNames.outletNo].add(outletNo);
                    feederNo && state.filterValues[FilterNames.feederNo].add(feederNo);
                    const EventTypeMapping = {
                        Warning: 2,
                        Fault: 1,
                        Info: 0,
                    };
                    forEach(values, (event: CycleGapEventValue) => {
                        const [time, eventType, active, eventCode, reason, description] = event;
                        eventsData.push({
                            x: moment(time).valueOf(),
                            y: EventTypeMapping[eventType],
                            time: moment(time).format(CHART_DATE_TIME_DISPLAY_FORMAT),
                            eventType,
                            active,
                            eventCode,
                            reason,
                            description,
                            feederNo: feederNo,
                            outletNo: outletNo,
                            studId: studId,
                        });
                    });
                });
                convertedEventsData.push({
                    name: deviceId,
                    showInLegend: true,
                    data: eventsData,
                    type: 'scatter',
                    yAxis: 0,
                    marker: {
                        symbol: 'circle',
                    },
                    tooltip: {
                        pointFormat: `<tr><td style="color: {series.color}">Time : </td>
                            <td style="text-align: left"><b>{point.time}</b></td></tr>
                            <tr><td style="color: {series.color}">FeederNo : </td>
                            <td style="text-align: left"><b>{point.feederNo}</b></td></tr>
                            <tr><td style="color: {series.color}">OutletNo : </td>
                            <td style="text-align: left"><b>{point.outletNo}</b></td></tr>
                            <tr><td style="color: {series.color}">StudId : </td>
                            <td style="text-align: left"><b>{point.studId}</b></td></tr>
                            <tr><td style="color: {series.color}">Description : </td>
                            <td style="text-align: left"><b>{point.description}</b></td></tr>`,
                    },
                });
            });

            const filteredResult = {};
            forEach({ ...finalResult }, function (value, key) {
                const series =
                    value?.reduce((acc: any[], item: any) => {
                        const data = filter(item?.data, { ...state.localFilters });
                        acc.push({ ...item, data });
                        return acc;
                    }, []) || [];
                filteredResult[key] = series;
            });
            state.measurementAggregateWidgets = { ...filteredResult };
            state.defaultValues = finalResult;

            state.formattedCycleGapEvents = convertedEventsData;
            state.defaultEventValues = convertedEventsData;
        },
        setMeasurementAggregateWidget(state, action: PayloadAction<MeasurementAggregateWidget>) {
            state.measurementAggregateWidget = action.payload;
        },

        localFiltering(state, action: PayloadAction<Filters>) {
            const { defaultValues } = state;
            const { payload } = action;
            const filteredResult = {};
            forEach(defaultValues, function (value, key) {
                const series =
                    value?.reduce((acc: any[], item: any) => {
                        const data = filter(item?.data, { ...payload });
                        acc.push({ ...item, data });
                        return acc;
                    }, []) || [];
                filteredResult[key] = series;
            });
            state.measurementAggregateWidgets = { ...filteredResult };

            const filteredCycleGapEvents: any =
                state.defaultEventValues?.reduce((acc: any[], item: any) => {
                    const data = filter(item?.data, { ...omit(action.payload, ['wip']) });
                    acc.push({ ...item, data });
                    return acc;
                }, []) || [];
            state.localFilters = payload;
            state.formattedCycleGapEvents = filteredCycleGapEvents;
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
    actions: measurementAggregateWidgetActions,
    reducer: measurementAggregateWidgetReducer,
    name: measurementAggregateWidgetKey,
} = measurementAggregateWidgetsSlice;

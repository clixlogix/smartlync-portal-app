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
import { Filters, FilterNames } from 'models';
import { CycleGapSprEvents, CycleGapSprEvent, CycleGapSprEventValue } from 'models';
import { MeasurementAggregateWidgetSprsState } from '.';
import { groupBy, transform, filter } from 'lodash';
import forEach from 'lodash/forEach';
import omit from 'lodash/omit';
import moment from 'moment';
import { CHART_DATE_TIME_DISPLAY_FORMAT } from 'constants/index';

// The initial state of the MeasurementAggregateWidgetSpr page
export const initialState: MeasurementAggregateWidgetSprsState = {
    measurementAggregateWidgetSprs: {},
    measurementAggregateWidgetSpr: undefined,
    measurementAggregateWidgetSprsFilteredByRules: [],
    formattedCycleGapEvents: [],
    defaultEventValues: [],
    filters: {},
    defaultValues: {},
    filterValues: {},
    error: undefined,
    isLoading: false,
    localFilters: {},
};

const measurementAggregateWidgetSprsSlice = createSlice({
    name: 'measurementAggregateWidgetSprs',
    initialState,
    reducers: {
        getAllMeasurementAggregateWidgetSprs(state, action: any) {
            state.filters = action.payload;
        },
        setAllMeasurementAggregateWidgetSprs(state, action: PayloadAction<any>) {
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
                            const { deviceName, outletNo, program } = element?.tags;
                            element?.values.forEach((item) => {
                                data.push({
                                    x: moment(item[0]).valueOf(),
                                    y: +item[1],
                                    time: item[0],
                                    measurementTime: item[0],
                                    deviceName,
                                    outletNo,
                                    program,
                                });
                            });

                            acc.filterValues[FilterNames.program].add(`${program}`);
                            acc.filterValues[FilterNames.outletNo].add(`${outletNo}`);
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
                            [FilterNames.outletNo]: new Set(),
                            [FilterNames.program]: new Set(),
                        },
                    },
                );
                state.isLoading = false;
                state.filterValues = filterValues;
            });

            /*** For Events ****/
            const groupedEventsData: { [key: string]: CycleGapSprEvents } = groupBy(events, 'tags.deviceName');
            const convertedEventsData: any = [];
            forEach(groupedEventsData, (device: CycleGapSprEvents, deviceId: string) => {
                const eventsData: any = [];
                forEach(device, (deviceData: CycleGapSprEvent) => {
                    const {
                        tags: { outletNo, program },
                        values,
                    } = deviceData;
                    program && state.filterValues[FilterNames.program].add(program);
                    outletNo && state.filterValues[FilterNames.outletNo].add(outletNo);
                    const EventTypeMapping = {
                        Spindle: 2,
                        Feeder: 1,
                        Regler: 0,
                    };
                    forEach(values, (event: CycleGapSprEventValue) => {
                        const [time, faultGroup, faultDescription, faultId] = event;
                        eventsData.push({
                            x: moment(time).valueOf(),
                            y: EventTypeMapping[faultGroup],
                            time: moment(time).format(CHART_DATE_TIME_DISPLAY_FORMAT),
                            faultGroup,
                            faultDescription,
                            faultId,
                            outletNo,
                            program,
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
                            <tr><td style="color: {series.color}">OutletNo : </td>
                            <td style="text-align: left"><b>{point.outletNo}</b></td></tr>
                            <tr><td style="color: {series.color}">Program : </td>
                            <td style="text-align: left"><b>{point.program}</b></td></tr>
                            <tr><td style="color: {series.color}">Description : </td>
                            <td style="text-align: left"><b>{point.faultDescription}</b></td></tr>`,
                    },
                    //boostThreshold: 1000,
                });
            });
            state.formattedCycleGapEvents = convertedEventsData;
            state.defaultEventValues = convertedEventsData;
            const filteredResult = {};
            forEach(finalResult, function (value, key) {
                const series =
                    value?.reduce((acc: any[], item: any) => {
                        const data = filter(item?.data, { ...state.localFilters });
                        acc.push({ ...item, data });
                        return acc;
                    }, []) || [];
                filteredResult[key] = series;
            });
            state.measurementAggregateWidgetSprs = filteredResult;
            state.defaultValues = finalResult;
        },
        localFiltering(state, action: PayloadAction<Filters>) {
            const { defaultValues, defaultEventValues } = state;
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
            state.measurementAggregateWidgetSprs = filteredResult;

            const filteredCycleGapEvents: any =
                defaultEventValues?.reduce((acc: any[], item: any) => {
                    const data = filter(item?.data, { ...omit(action.payload, ['wip']) });
                    acc.push({ ...item, data });
                    return acc;
                }, []) || [];
            state.formattedCycleGapEvents = filteredCycleGapEvents;
            state.localFilters = payload;
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
    actions: measurementAggregateWidgetSprActions,
    reducer: measurementAggregateWidgetSprReducer,
    name: measurementAggregateWidgetSprKey,
} = measurementAggregateWidgetSprsSlice;

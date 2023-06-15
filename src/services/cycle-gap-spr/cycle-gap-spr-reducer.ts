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
import {
    Filters,
    CycleGapSprs,
    FilterNames,
    CycleGapSprEvents,
    CycleGapSprEvent,
    CycleGapSprEventValue,
    CycleGapSprLocalFilter,
    CycleGapSprFilters,
} from 'models';
import { CycleGapSprsState } from '.';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import forEach from 'lodash/forEach';
import transform from 'lodash/transform';
import filter from 'lodash/filter';
import { CHART_DATE_TIME_DISPLAY_FORMAT } from 'constants/index';

// The initial state of the CycleGapSpr page
export const initialState: CycleGapSprsState = {
    filters: {},
    formattedCycleGaps: [],
    defaultValues: [],
    defaultEventValues: [],
    formattedCycleGapEvents: [],
    filterValues: {},
    error: undefined,
    isLoading: false,
    localFilters: {},
};

const applyLocalFilters = (defaultValues, localFilters: CycleGapSprLocalFilter) => {
    return (
        defaultValues?.reduce((acc: any[], item: any) => {
            const updatedLocalFilters = { ...localFilters };
            const data = filter(item?.data, updatedLocalFilters);
            acc.push({ ...item, data });
            return acc;
        }, []) || []
    );
};

const cycleGapSprsSlice = createSlice({
    name: 'cycleGapSprs',
    initialState,
    reducers: {
        getAllCycleGapSprs(state, action: PayloadAction<CycleGapSprFilters>) {
            state.filters = action?.payload.filter;
            state.localFilters = action.payload.localFilters;
        },
        setAllCycleGapSprs(state, action: PayloadAction<[CycleGapSprs, CycleGapSprEvents]>) {
            const { payload } = action;
            let convertedData: any = [];
            const groupedData = groupBy(payload[0], 'deviceName');
            const { filterValues = {} as any } = transform(
                groupedData,
                function (acc, value, key) {
                    const name = key;
                    let data: any = [];
                    value.forEach((element) => {
                        element.data.forEach((item) => {
                            data.push({
                                x: moment(item.time).valueOf(),
                                y: item.gap,
                                /** not wrapping it moment as it giving different date time
                                 *  in different system preparing for demo */
                                time: item.time, // moment(item.time).format(CHART_DATE_TIME_DISPLAY_FORMAT),
                                gap: item.gap,
                                outletNo: element.outletNo,
                                studId: element.program,
                            });
                        });
                        acc.filterValues[FilterNames.studId].add(`${element['program']}`);
                        acc.filterValues[FilterNames.outletNo].add(`${element['outletNo']}`);
                    });

                    convertedData.push({
                        name,
                        data,
                        type: 'scatter',
                        yAxis: 0,
                        marker: {
                            symbol: 'circle',
                        },
                        //boostThreshold: 1000,
                    });

                    return acc;
                },
                {
                    filterValues: {
                        [FilterNames.outletNo]: new Set(),
                        [FilterNames.studId]: new Set(),
                    },
                },
            );
            const groupedEventsData: { [key: string]: CycleGapSprEvents } = groupBy(payload[1], 'tags.deviceName');
            const convertedEventsData: any = [];
            forEach(groupedEventsData, (device: CycleGapSprEvents, deviceId: string) => {
                const eventsData: any = [];
                forEach(device, (deviceData: CycleGapSprEvent) => {
                    const {
                        tags: { outletNo, program },
                        values,
                    } = deviceData;
                    program && filterValues[FilterNames.studId].add(program);
                    outletNo && filterValues[FilterNames.outletNo].add(outletNo);
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
                            time,
                            faultGroup,
                            faultDescription,
                            faultId,
                            outletNo,
                            studId: program,
                        });
                    });
                });
                convertedEventsData.push({
                    name: deviceId,
                    showInLegend: false,
                    data: eventsData,
                    type: 'scatter',
                    yAxis: 1,
                    marker: {
                        symbol: 'circle',
                    },
                    tooltip: {
                        pointFormat: `<tr><td style="color: {series.color}">Time : </td>
                            <td style="text-align: left"><b>{point.time}</b></td></tr>
                            <tr><td style="color: {series.color}">OutletNo : </td>
                            <td style="text-align: left"><b>{point.outletNo}</b></td></tr>
                            <tr><td style="color: {series.color}">Program : </td>
                            <td style="text-align: left"><b>{point.studId}</b></td></tr>
                            <tr><td style="color: {series.color}">Description : </td>
                            <td style="text-align: left"><b>{point.faultDescription}</b></td></tr>`,
                    },
                    //boostThreshold: 1000,
                });
            });
            const { localFilters } = state;
            state.filterValues = filterValues;
            state.defaultValues = convertedData;
            state.defaultEventValues = convertedEventsData;
            state.formattedCycleGaps = applyLocalFilters(convertedData, localFilters);
            state.formattedCycleGapEvents = applyLocalFilters(convertedEventsData, localFilters);
        },

        error(state, action: PayloadAction<CustomError>) {
            state.error = action.payload;
        },
        loading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        localFiltering(state, action: PayloadAction<Filters>) {
            const { defaultValues, defaultEventValues } = state;
            state.formattedCycleGaps = applyLocalFilters(defaultValues, action.payload);
            state.formattedCycleGapEvents = applyLocalFilters(defaultEventValues, action.payload);
        },
    },
});

export const { actions: cycleGapSprActions, reducer: cycleGapSprReducer, name: cycleGapSprKey } = cycleGapSprsSlice;

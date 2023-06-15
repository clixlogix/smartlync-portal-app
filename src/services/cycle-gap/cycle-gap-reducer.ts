import { Clickable } from '..';
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
    CycleGap,
    CycleGaps,
    FilterNames,
    CycleGapEvents,
    CycleGapEvent,
    CycleGapEventValue,
    CycleGapLocalFilter,
    CycleGapFilters,
} from 'models';
import { CycleGapsState } from '.';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import forEach from 'lodash/forEach';
import transform from 'lodash/transform';
import filter from 'lodash/filter';
import omit from 'lodash/omit';
import { CHART_DATE_TIME_DISPLAY_FORMAT } from 'constants/index';

export const initialState: CycleGapsState = {
    cycleGap: undefined,
    filters: {},
    formattedCycleGaps: [],
    defaultValues: [],
    defaultEventValues: [],
    filterValues: {},
    formattedCycleGapEvents: [],
    error: undefined,
    isLoading: false,
    localFilters: {},
};

const applyLocalFilters = (defaultValues, localFilters: CycleGapLocalFilter, enableWip: boolean) => {
    return (
        defaultValues?.reduce((acc: any[], item: any) => {
            const updatedLocalFilters = enableWip ? { ...localFilters } : { ...omit(localFilters, ['wip']) };
            const data = filter(item?.data, updatedLocalFilters);
            acc.push({ ...item, data });
            return acc;
        }, []) || []
    );
};

const cycleGapsSlice = createSlice({
    name: 'cycleGaps',
    initialState,
    reducers: {
        getAllCycleGaps(state, action: PayloadAction<CycleGapFilters>) {
            state.filters = action.payload.filter;
            state.localFilters = action.payload.localFilters;
        },
        setAllCycleGaps(state, action: PayloadAction<[CycleGaps, CycleGapEvents]>) {
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
                                time: item.time,
                                gap: item.gap,
                                wip: item.wip,
                                feederNo: element.feederNo,
                                outletNo: element.outletNo,
                                studId: element.studId,
                            });
                        });

                        acc.filterValues[FilterNames.studId].add(`${element['studId']}`);
                        acc.filterValues[FilterNames.outletNo].add(`${element['outletNo']}`);
                        acc.filterValues[FilterNames.feederNo].add(`${element['feederNo']}`);
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
                        [FilterNames.feederNo]: new Set(),
                        [FilterNames.outletNo]: new Set(),
                        [FilterNames.studId]: new Set(),
                    },
                },
            );

            const groupedEventsData: { [key: string]: CycleGapEvents } = groupBy(payload[1], 'tags.deviceName');
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
                    studId && filterValues[FilterNames.studId].add(studId);
                    outletNo && filterValues[FilterNames.outletNo].add(outletNo);
                    feederNo && filterValues[FilterNames.feederNo].add(feederNo);
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
                            time,
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
                    showInLegend: false,
                    clickable: false,
                    data: eventsData,
                    type: 'scatter',
                    yAxis: 1,
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
                            <tr><td style="color: {series.color}">Event Type : </td>
                            <td style="text-align: left"><b>{point.eventType}</b></td></tr>
                            <tr><td style="color: {series.color}">Event Code : </td>
                            <td style="text-align: left"><b>{point.eventCode}</b></td></tr>
                            <tr><td style="color: {series.color}">Reason : </td>
                            <td style="text-align: left"><b>{point.reason}</b></td></tr>
                            <tr><td style="color: {series.color}">Description : </td>
                            <td style="text-align: left"><b>{point.description}</b></td></tr>`,
                    },
                    // boostThreshold: 1000,
                });
            });
            const { localFilters } = state;
            state.filterValues = filterValues;
            state.defaultValues = convertedData;
            state.defaultEventValues = convertedEventsData;
            state.formattedCycleGapEvents = applyLocalFilters(convertedEventsData, localFilters, false);
            state.formattedCycleGaps = applyLocalFilters(convertedData, localFilters, true);
        },

        setCycleGap(state, action: PayloadAction<CycleGap>) {
            state.cycleGap = action.payload;
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
        localFiltering(state, action: PayloadAction<CycleGapLocalFilter>) {
            const { defaultValues, defaultEventValues } = state;
            state.formattedCycleGaps = applyLocalFilters(defaultValues, action.payload, true);
            state.formattedCycleGapEvents = applyLocalFilters(defaultEventValues, action.payload, false);
        },
    },
});

export const { actions: cycleGapActions, reducer: cycleGapReducer, name: cycleGapKey } = cycleGapsSlice;

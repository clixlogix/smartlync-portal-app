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
import { Filters, EventRatePerDeviceSpr, EventRatePerDeviceSprs, FilterNames, view, ChartData } from 'models';
import { EventRatePerDeviceSprsState } from '.';
import { fillEmptyValuesObjects } from 'utils/fillEmptyValues';
import moment from 'moment';
import * as _ from 'lodash';

// The initial state of the EventRatePerDeviceSpr page
export const initialState: EventRatePerDeviceSprsState = {
    eventRatePerDeviceSprs: [],
    eventRatePerDeviceSpr: undefined,
    filters: {},
    filterValues: {},
    categories: [],
    defaultValues: [],

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const eventRatePerDeviceSprsSlice = createSlice({
    name: 'eventRatePerDeviceSprs',
    initialState,
    reducers: {
        getAllEventRatePerDeviceSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllEventRatePerDeviceSprs(state, action: PayloadAction<EventRatePerDeviceSprs>) {
            const { payload = [] } = action;
            const { filters } = state;

            const subLineGroupedPayload = _.groupBy(payload, 'subLine');
            let uniqWeeks: any = [];
            _.uniqBy(payload, filters.view === view.Weekly ? 'week' : 'date').forEach((element) => {
                uniqWeeks.push({
                    name: `${
                        filters.view === view.Weekly ? element?.week : moment(element?.date).format('YYYY-MM-DD')
                    }`,
                    week: `${element?.week}`,
                    y: 0,
                });
            });
            if (filters.view === view.Daily) {
                uniqWeeks = _.orderBy(
                    uniqWeeks,
                    [
                        function (o) {
                            return moment(o?.name);
                        },
                    ],
                    ['asc'],
                );
            }

            const finalData = {};
            let finalFilterValues = {};

            _.forEach(subLineGroupedPayload, function (value, lineKey) {
                let convertedData: ChartData[] = [];
                const groupedByDevicename = _.groupBy(value, 'deviceName');

                const { filterValues = {} as any } = _.transform(
                    groupedByDevicename,
                    function (acc, value, deviceNameKey) {
                        const name = deviceNameKey;
                        let data: any = [];
                        const sortedValues = _.orderBy(
                            value,
                            [
                                function (o) {
                                    return moment(o.date);
                                },
                            ],
                            ['asc'],
                        );

                        sortedValues.forEach((element) => {
                            const { date, eventCount = 0, rivetCount } = element;
                            let formattedDate = moment(date).format('YYYY-MM-DD');

                            const eventRate = !eventCount
                                ? 0
                                : +((eventCount / (eventCount + rivetCount)) * 1000000).toFixed(2);
                            data.push({
                                name: filters.view === view.Weekly ? `${element.week}` : formattedDate,
                                y: eventRate,
                                ...element,
                            });

                            acc.filterValues[FilterNames.week].add(`${element.week}`);
                        });

                        convertedData.push({
                            name,
                            data,
                        });

                        return acc;
                    },
                    {
                        filterValues: {
                            [FilterNames.week]: new Set(),
                        },
                    },
                );
                finalFilterValues = { ...filterValues };

                const series = fillEmptyValuesObjects(convertedData, uniqWeeks);
                finalData[lineKey] = series;
            });

            state.eventRatePerDeviceSprs = finalData;
            state.defaultValues = finalData;
            state.categories = uniqWeeks;
            state.filterValues = finalFilterValues;
        },

        setEventRatePerDeviceSpr(state, action: PayloadAction<EventRatePerDeviceSpr>) {
            state.eventRatePerDeviceSpr = action.payload;
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
        localFiltering(state, action: PayloadAction<Filters>) {
            const { defaultValues, eventRatePerDeviceSpr } = state;
            const { payload } = action;

            let filteredSeries: any = _.transform(
                defaultValues,
                function (acc, value, key) {
                    let seriesArray: any = [];
                    value.forEach((element) => {
                        const { name, data } = element;
                        const newData = _.filter(data, { ...payload });
                        seriesArray.push({ name, data: newData });
                    });
                    acc[key] = seriesArray;
                },
                {},
            );

            state.eventRatePerDeviceSprs = filteredSeries || eventRatePerDeviceSpr;
        },
    },
});

export const {
    actions: eventRatePerDeviceSprActions,
    reducer: eventRatePerDeviceSprReducer,
    name: eventRatePerDeviceSprKey,
} = eventRatePerDeviceSprsSlice;

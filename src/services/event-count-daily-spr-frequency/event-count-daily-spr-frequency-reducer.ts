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
import { EventCountDailyFrequencySpr, EventCountDailyFrequencySprs, FilterNames, Filters } from 'models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { EventCountDailySprFrequencysState } from '.';
import data from './sagas/data';

// The initial state of the EventCountDailySprFrequency page
export const initialState: EventCountDailySprFrequencysState = {
    eventCountDailyFrequencySprs: data,
    eventCountDailyFrequencySpr: undefined,
    eventCountDailyGraphFrequencySpr: [],
    filters: {},
    filterValues: {},
    error: undefined,
    isLoading: false,
};

const eventCountDailySprFrequencysSlice = createSlice({
    name: 'eventCountDailyFrequencySprs',
    initialState,
    reducers: {
        getAllEventCountDailyFrequencySprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllEventCountDailyFrequencySprs(state, action: PayloadAction<EventCountDailyFrequencySprs>) {
            const { payload = [] } = action;
            const {
                eventCountDailyFrequencys = [],
                eventCountDailyGraphFrequency = [],
                filterValues = {} as any,
            } = payload.reduce(
                (acc, row: EventCountDailyFrequencySpr, index) => {
                    const eventCode = row.eventCode;

                    acc.eventCountDailyFrequencys.push({ ...row, eventCode });
                    acc.eventCountDailyGraphFrequency.push([row.deviceName, row.occurrences]);

                    acc.filterValues.occurences.max = Math.max(acc.filterValues.occurences.max, row.occurrences);
                    acc.filterValues.occurences.avg = acc.filterValues.occurences.avg + row.occurrences;
                    acc.filterValues.occurences.min = Math.min(acc.filterValues.occurences.min, row.occurrences);
                    acc.filterValues[FilterNames.eventCode].add(row['eventCode']);
                    acc.filterValues[FilterNames.week].add(row['week']);
                    acc.filterValues[FilterNames.studId].add(`${row['studId']}`);

                    return acc;
                },
                {
                    eventCountDailyFrequencys: [] as EventCountDailyFrequencySprs,
                    eventCountDailyGraphFrequency: [] as any[],
                    filterValues: {
                        occurences: { min: 0, avg: 0, max: 0 },
                        [FilterNames.eventCode]: new Set(),
                        [FilterNames.week]: new Set(),
                        [FilterNames.studId]: new Set(),
                    },
                },
            );

            state.eventCountDailyFrequencySprs = eventCountDailyFrequencys;
            state.eventCountDailyGraphFrequencySpr = eventCountDailyGraphFrequency;
            state.filterValues = filterValues;
        },

        setEventCountDailyFrequencySpr(state, action: PayloadAction<EventCountDailyFrequencySpr>) {
            state.eventCountDailyFrequencySpr = action.payload;
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
    actions: eventCountDailySprFrequencyActions,
    reducer: eventCountDailySprFrequencyReducer,
    name: eventCountDailySprFrequencyKey,
} = eventCountDailySprFrequencysSlice;

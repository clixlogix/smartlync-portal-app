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
import { Filters, EventCountDailyFrequency, EventCountDailyFrequencys, FilterNames } from 'models';
import { EventCountDailyFrequencysState } from '.';

// The initial state of the EventCountDailyFrequency page
export const initialState: EventCountDailyFrequencysState = {
    eventCountDailyFrequencys: [],
    eventCountDailyFrequency: undefined,
    eventCountDailyGraphFrequency: [],
    filters: {},
    filterValues: {},
    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const eventCountDailyFrequencysSlice = createSlice({
    name: 'eventCountDailyFrequencys',
    initialState,
    reducers: {
        getAllEventCountDailyFrequencys(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllEventCountDailyFrequencys(state, action: PayloadAction<EventCountDailyFrequencys>) {
            // state.eventCountDailyFrequencys = action.payload;
            const { payload = [] } = action;
            const {
                eventCountDailyFrequencys = [],
                eventCountDailyGraphFrequency = [],
                filterValues = {} as any,
            } = payload.reduce(
                (acc, row: EventCountDailyFrequency, index) => {
                    const eventCode = row.eventCode;
                    // let description = `${row.description} `;

                    // if (row.fc === 17602) {
                    //     description = `${row.description} `;
                    // }

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
                    eventCountDailyFrequencys: [] as EventCountDailyFrequencys,
                    eventCountDailyGraphFrequency: [] as any[],
                    filterValues: {
                        occurences: { min: 0, avg: 0, max: 0 },
                        [FilterNames.eventCode]: new Set(),
                        [FilterNames.week]: new Set(),
                        [FilterNames.studId]: new Set(),
                    },
                },
            );

            state.eventCountDailyFrequencys = eventCountDailyFrequencys;
            state.eventCountDailyGraphFrequency = eventCountDailyGraphFrequency;
            state.filterValues = filterValues;
        },

        setEventCountDailyFrequency(state, action: PayloadAction<EventCountDailyFrequency>) {
            state.eventCountDailyFrequency = action.payload;
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
    actions: eventCountDailyFrequencyActions,
    reducer: eventCountDailyFrequencyReducer,
    name: eventCountDailyFrequencyKey,
} = eventCountDailyFrequencysSlice;

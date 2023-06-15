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
import { Filters, EventDescFrequency, EventDescFrequencys, FilterNames } from 'models';
import { EventDescFrequencysState } from '.';

// The initial state of the EventDescFrequency page
export const initialState: EventDescFrequencysState = {
    eventDescFrequencys: [],
    eventDescFrequency: undefined,
    eventDescGraphFrequency: [],
    filters: {},
    filterValues: { occurence: { min: 0, avg: 0, max: 0 }, faultCodes: [] } as any,

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const eventDescFrequencysSlice = createSlice({
    name: 'eventDescFrequencys',
    initialState,
    reducers: {
        getAllEventDescFrequencys(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllEventDescFrequencys(state, action: PayloadAction<EventDescFrequencys>) {
            const { payload = [] } = action;

            const { eventDescFrequencys = [], eventDescGraphFrequency = [], filterValues = {} as any } = payload.reduce(
                (acc, row: EventDescFrequency, index) => {
                    const faultCode = String(row.fc);
                    let description = `${row.description} `;

                    if (row.fc === 17602) {
                        description = `${row.description} `;
                    }

                    acc.eventDescFrequencys.push({ ...row, faultCode, description });
                    acc.eventDescGraphFrequency.push([
                        row.description,
                        row.occurrences,
                        row.fc,
                        { eventType: row.eventType },
                    ]);

                    acc.filterValues.occurences.max = Math.max(acc.filterValues.occurences.max, row.occurrences);
                    acc.filterValues.occurences.avg = acc.filterValues.occurences.avg + row.occurrences;
                    acc.filterValues.occurences.min = Math.min(acc.filterValues.occurences.min, row.occurrences);
                    acc.filterValues[FilterNames.faultCode].add(row['fc']);

                    return acc;
                },
                {
                    eventDescFrequencys: [] as EventDescFrequencys,
                    eventDescGraphFrequency: [] as any[],
                    filterValues: {
                        occurences: { min: 0, avg: 0, max: 0 },
                        [FilterNames.faultCode]: new Set(),
                    },
                },
            );

            filterValues.occurences.avg = filterValues.occurences.avg / (eventDescFrequencys.length || 1);

            state.eventDescFrequencys = eventDescFrequencys;
            // TODO: fix the invalid description that is
            //       causing highcharts error. Then remove the slice(20)
            state.eventDescGraphFrequency = eventDescGraphFrequency;
            state.filterValues = filterValues;
        },

        setEventDescFrequency(state, action: PayloadAction<EventDescFrequency>) {
            state.eventDescFrequency = action.payload;
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
    actions: eventDescFrequencyActions,
    reducer: eventDescFrequencyReducer,
    name: eventDescFrequencyKey,
} = eventDescFrequencysSlice;

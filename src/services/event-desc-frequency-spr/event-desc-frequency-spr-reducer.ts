import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { Filters, EventDescFrequencySprs, EventDescFrequencySpr, FilterNames } from 'models';
import { EventDescFrequencySprsState } from '.';

// The initial state of the EventDescFrequencySpr page
export const initialState: EventDescFrequencySprsState = {
    eventDescFrequencySprs: [],
    eventDescGraphFrequencySprs: [],
    filters: {},
    filterValues: { occurence: { min: 0, avg: 0, max: 0 }, faultCodes: [] } as any,
    error: undefined,
    isLoading: false,
};

const eventDescFrequencySprsSlice = createSlice({
    name: 'eventDescFrequencySprs',
    initialState,
    reducers: {
        getAllEventDescFrequencySprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllEventDescFrequencySprs(state, action: PayloadAction<EventDescFrequencySprs>) {
            state.eventDescFrequencySprs = action.payload;

            const { payload = [] } = action;

            const { eventDescFrequencys = [], eventDescGraphFrequency = [], filterValues = {} as any } = payload.reduce(
                (acc, row: EventDescFrequencySpr) => {
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
                    eventDescFrequencys: [] as EventDescFrequencySprs,
                    eventDescGraphFrequency: [] as any[],
                    filterValues: {
                        occurences: { min: 0, avg: 0, max: 0 },
                        [FilterNames.faultCode]: new Set(),
                    },
                },
            );

            filterValues.occurences.avg = filterValues.occurences.avg / (eventDescFrequencys.length || 1);

            state.eventDescFrequencySprs = eventDescFrequencys;
            state.eventDescGraphFrequencySprs = eventDescGraphFrequency;
            state.filterValues = filterValues;
        },
        error(state, action: PayloadAction<CustomError>) {
            state.error = action.payload;
        },
        loading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
    },
});

export const {
    actions: eventDescFrequencySprActions,
    reducer: eventDescFrequencySprReducer,
    name: eventDescFrequencySprKey,
} = eventDescFrequencySprsSlice;

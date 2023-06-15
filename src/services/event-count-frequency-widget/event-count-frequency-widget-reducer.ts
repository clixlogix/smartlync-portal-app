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
import { Filters, EventCountFrequency, EventCountFrequencies, FilterNames } from 'models';
import { EventCountFrequencyWidgetsState } from '.';

// The initial state of the EventCountFrequencyWidget page
export const initialState: EventCountFrequencyWidgetsState = {
    eventCountFrequencyWidgets: [],
    eventCountFrequencyWidget: undefined,
    eventCountFrequencyGraphWidgets: [],
    filters: {},
    filterValues: {},
    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const eventCountFrequencyWidgetsSlice = createSlice({
    name: 'eventCountFrequencyWidgets',
    initialState,
    reducers: {
        getAllEventCountFrequencyWidgets(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllEventCountFrequencyWidgets(state, action: PayloadAction<EventCountFrequencies>) {
            const { payload = [] } = action;
            const {
                eventCountDailyFrequencys = [],
                eventCountFrequencyGraphWidgets = [],
                filterValues = {} as any,
            } = payload.reduce(
                (acc, row: EventCountFrequency, index) => {
                    const eventCode = String(row.eventCode);

                    acc.eventCountDailyFrequencys.push({ ...row, eventCode });
                    acc.eventCountFrequencyGraphWidgets.push([row.deviceName, row.occurrences]);
                    acc.filterValues.occurences.max = Math.max(acc.filterValues.occurences.max, row.occurrences);
                    acc.filterValues.occurences.avg = acc.filterValues.occurences.avg + row.occurrences;
                    acc.filterValues.occurences.min = Math.min(acc.filterValues.occurences.min, row.occurrences);
                    acc.filterValues[FilterNames.eventCode].add(row['eventCode']);
                    acc.filterValues[FilterNames.week].add(row['week']);
                    acc.filterValues[FilterNames.studId].add(`${row['studId']}`);

                    return acc;
                },
                {
                    eventCountDailyFrequencys: [] as EventCountFrequencies,
                    eventCountFrequencyGraphWidgets: [] as any[],
                    filterValues: {
                        occurences: { min: 0, avg: 0, max: 0 },
                        [FilterNames.eventCode]: new Set(),
                        [FilterNames.week]: new Set(),
                        [FilterNames.studId]: new Set(),
                    },
                },
            );

            // filterValues.occurences.avg = filterValues.occurences.avg / (eventDescFrequencys.length || 1);

            state.eventCountFrequencyWidgets = eventCountDailyFrequencys;
            // TODO: fix the invalid description that is
            //       causing highcharts error. Then remove the slice(20)
            state.eventCountFrequencyGraphWidgets = eventCountFrequencyGraphWidgets;
            state.filterValues = filterValues;
        },

        // setEventCountFrequencyWidget(state, action: PayloadAction<EventCountFrequency>) {
        //     state.eventCountFrequencyWidget = action.payload;
        // },

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
    actions: eventCountFrequencyWidgetActions,
    reducer: eventCountFrequencyWidgetReducer,
    name: eventCountFrequencyWidgetKey,
} = eventCountFrequencyWidgetsSlice;

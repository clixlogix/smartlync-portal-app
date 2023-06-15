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
import { Filters, EventRatePerEvent, EventRatePerEvents, FilterNames, view, ChartData } from 'models';
import { EventRatePerEventsState } from '.';
import { fillEmptyValuesObjects } from 'utils/fillEmptyValues';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import orderBy from 'lodash/orderBy';
import transform from 'lodash/transform';
import filter from 'lodash/filter';

// The initial state of the EventRatePerEvent page
export const initialState: EventRatePerEventsState = {
    eventRatePerEvents: [],
    eventRatePerEvent: undefined,
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
const eventRatePerEventsSlice = createSlice({
    name: 'eventRatePerEvents',
    initialState,
    reducers: {
        getAllEventRatePerEvents(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllEventRatePerEvents(state, action: PayloadAction<EventRatePerEvents>) {
            const { payload = [] } = action;
            const { filters } = state;
            let convertedData: ChartData[] = [];

            const groupedPayload = groupBy(payload, 'faultCode');
            let uniqWeeks: any = [];
            uniqBy(payload, filters.view === view.Weekly ? 'week' : 'date').forEach((element) => {
                uniqWeeks.push({
                    name: `${
                        filters.view === view.Weekly ? element?.week : moment(element?.date).format('YYYY-MM-DD')
                    }`,
                    week: `${element?.week}`,
                    y: 0,
                });
            });
            if (filters.view === view.Daily) {
                uniqWeeks = orderBy(
                    uniqWeeks,
                    [
                        function (o) {
                            return moment(o?.name);
                        },
                    ],
                    ['asc'],
                );
            }

            const { filterValues = {} as any } = transform(
                groupedPayload,
                function (acc, value, key) {
                    const name = key;
                    let data: any = [];
                    const sortedValues = orderBy(
                        value,
                        [
                            function (o) {
                                return moment(o.date);
                            },
                        ],
                        ['asc'],
                    );

                    sortedValues.forEach((element) => {
                        const { date, eventCount = 0, weldCount = 0, week } = element;
                        let formattedDate = moment(date).format('YYYY-MM-DD');

                        const eventRate = !eventCount
                            ? 0
                            : +((eventCount / (eventCount + weldCount)) * 1000000).toFixed(2);

                        data.push({
                            name: filters.view === view.Weekly ? `${week}` : formattedDate,
                            y: eventRate,
                            ...element,
                        });

                        acc.filterValues[FilterNames.week].add(`${week}`);
                    });

                    if (name !== 'null') {
                        convertedData.push({
                            name,
                            data,
                        });
                    }

                    return acc;
                },
                {
                    filterValues: {
                        [FilterNames.week]: new Set(),
                    },
                },
            );

            const categories =
                filters.view === view.Weekly
                    ? orderBy(
                          Array.from(filterValues.week),
                          [
                              function (o) {
                                  return +o;
                              },
                          ],
                          ['asc'],
                      )
                    : [...uniqWeeks];

            const series = fillEmptyValuesObjects(convertedData, uniqWeeks);

            state.eventRatePerEvents = series;
            state.defaultValues = series;
            state.categories = categories;
            state.filterValues = filterValues;
        },

        setEventRatePerEvent(state, action: PayloadAction<EventRatePerEvent>) {
            state.eventRatePerEvent = action.payload;
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
            const { defaultValues } = state;

            const filteredSeries: any =
                defaultValues?.reduce((acc: any[], item: any) => {
                    const data = filter(item?.data, { ...action.payload });
                    acc.push({ ...item, data });
                    return acc;
                }, []) || [];
            state.eventRatePerEvents = filteredSeries;
        },
    },
});

export const {
    actions: eventRatePerEventActions,
    reducer: eventRatePerEventReducer,
    name: eventRatePerEventKey,
} = eventRatePerEventsSlice;

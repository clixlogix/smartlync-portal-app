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
import { Filters, StationAvailabilityTrend, StationAvailabilityTrends } from 'models';
import { StationAvailabilityTrendsState } from '.';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import forEach from 'lodash/forEach';
import moment from 'moment';
import orderBy from 'lodash/orderBy';

// The initial state of the StationAvailabilityTrend page
export const initialState: StationAvailabilityTrendsState = {
    stationAvailabilityTrends: [],
    stationAvailabilityTrend: undefined,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const stationAvailabilityTrendsSlice = createSlice({
    name: 'stationAvailabilityTrends',
    initialState,
    reducers: {
        getAllStationAvailabilityTrends(state, action: PayloadAction<Filters>) {
            const { payload } = action;
            const fromWeekArray: string[] = [];
            const toWeekArray: string[] = [];
            let refWeek = moment(payload.fromTime);
            do {
                fromWeekArray.push(refWeek.format('YYYYWW'));
                toWeekArray.push(refWeek.clone().add(8, 'weeks').endOf('isoWeek').format('YYYYWW'));
                refWeek.add(1, 'weeks');
            } while (refWeek.format('YYYYWW') !== moment(payload.toTime).add(1, 'weeks').format('YYYYWW'));
            state.filters = {
                ...payload,
                fromWeek: fromWeekArray.join(','),
                toWeek: toWeekArray.join(','),
            };
        },
        setAllStationAvailabilityTrends(state, action: PayloadAction<StationAvailabilityTrends>) {
            const { payload } = action;
            const { filters } = state;
            const grouping = filters.groupBy;
            const convertedData: any = [];
            const groupedData = groupBy(payload, grouping);

            forEach(groupedData, function (value, key) {
                const name = key;
                let data: any = [];
                const sortedValue = orderBy(
                    value,
                    [
                        function (o) {
                            return moment(`${filters.view === 'weekly' ? o.yearWeek : o.startWeek}`, 'YYYYWW');
                        },
                    ],
                    ['asc'],
                );
                sortedValue.forEach((element) => {
                    let label;
                    label = `${moment(`${element.startWeek}`, 'YYYYWW').format('[W]WW')}-${moment(
                        `${element.endWeek}`,
                        'YYYYWW',
                    ).format('[W]WW')}`;
                    if (filters.view === 'weekly') {
                        label = `${moment(`${element.yearWeek}`, 'YYYYWW').format('[W]WW')}`;
                    }
                    data.push([label, element.ta]);
                });

                convertedData.push({
                    name,
                    data,
                    type: 'spline',
                });
            });

            state.stationAvailabilityTrends = convertedData;
        },

        setStationAvailabilityTrend(state, action: PayloadAction<StationAvailabilityTrend>) {
            state.stationAvailabilityTrend = action.payload;
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
    actions: stationAvailabilityTrendActions,
    reducer: stationAvailabilityTrendReducer,
    name: stationAvailabilityTrendKey,
} = stationAvailabilityTrendsSlice;

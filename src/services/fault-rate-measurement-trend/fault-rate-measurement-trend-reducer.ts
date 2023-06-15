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
import { Filters, FaultRateMeasurementTrend, FaultRateMeasurementTrends } from 'models';
import { FaultRateMeasurementTrendsState } from '.';
import data from './sagas/data';
import moment from 'moment';

// The initial state of the FaultRateMeasurementTrend page
export const initialState: FaultRateMeasurementTrendsState = {
    faultRateMeasurementTrends: data,
    faultRateMeasurementTrend: undefined,
    filters: {},
    categories: [],
    graphData: [],

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const faultRateMeasurementTrendsSlice = createSlice({
    name: 'faultRateMeasurementTrends',
    initialState,
    reducers: {
        getAllFaultRateMeasurementTrends(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllFaultRateMeasurementTrends(state, action: PayloadAction<FaultRateMeasurementTrends>) {
            // state.faultRateMeasurementTrends = action.payload;
            const { payload } = action;
            const categories: any = [];
            const graphData: any = data.map((item) => {
                categories.push(item?.faultRate);
                return graphData.push({
                    name: moment(item?.dateTime).valueOf(),
                    y: item?.faultRate,
                    ...item,
                });
            });

            state.faultRateMeasurementTrends = payload;
            state.categories = categories;
            state.graphData = graphData;
        },

        setFaultRateMeasurementTrend(state, action: PayloadAction<FaultRateMeasurementTrend>) {
            state.faultRateMeasurementTrend = action.payload;
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
    actions: faultRateMeasurementTrendActions,
    reducer: faultRateMeasurementTrendReducer,
    name: faultRateMeasurementTrendKey,
} = faultRateMeasurementTrendsSlice;

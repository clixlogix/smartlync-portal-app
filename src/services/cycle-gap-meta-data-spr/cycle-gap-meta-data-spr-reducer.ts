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
import { Filters, CycleGapMetaDataSpr } from 'models';
import { CycleGapMetaDataSprsState } from '.';

// The initial state of the CycleGapMetaDataSpr page
export const initialState: CycleGapMetaDataSprsState = {
    cycleGapMetaDataSprs: [],
    cycleGapMetaDataSpr: undefined,
    cycleGapMetaDataSprsFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const cycleGapMetaDataSprsSlice = createSlice({
    name: 'cycleGapMetaDataSprs',
    initialState,
    reducers: {
        getAllCycleGapMetaDataSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllCycleGapMetaDataSprs(state, action: PayloadAction<any>) {
            const { metaData, graphData } = action.payload;

            state.cycleGapMetaDataSprs = {
                metaData,
                graphData: {
                    rivetGraphData: {
                        y: graphData[0].RIVET_CURVE.dataY,
                        x: graphData[0].RIVET_CURVE.dataX,
                    },
                    referenceGraphData: {
                        y: graphData[0].REFERENCE_CURVE.dataY,
                        x: graphData[0].REFERENCE_CURVE.dataX,
                    },
                },
            };
        },

        setCycleGapMetaDataSpr(state, action: PayloadAction<CycleGapMetaDataSpr>) {
            state.cycleGapMetaDataSpr = action.payload;
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
    actions: cycleGapMetaDataSprActions,
    reducer: cycleGapMetaDataSprReducer,
    name: cycleGapMetaDataSprKey,
} = cycleGapMetaDataSprsSlice;

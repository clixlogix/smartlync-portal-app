import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { Filters, CycleGapMetaData } from 'models';
import { CycleGapMetaDatasState } from '.';
import { convertGraphicalDataToTimerSeries } from './sagas/data';
import moment from 'moment';
import get from 'lodash/get';

// The initial state of the CycleGapMetaData page
export const initialState: CycleGapMetaDatasState = {
    cycleGapMetaDatas: [],
    cycleGapMetaData: undefined,
    cycleGapMetaDatasFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
    pins: [],
};

/*
 *
 *
 */
const cycleGapMetaDatasSlice = createSlice({
    name: 'cycleGapMetaDatas',
    initialState,
    reducers: {
        getAllCycleGapMetaDatas(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllCycleGapMetaDatas(state, action: PayloadAction<any>) {
            const { metaData, graphData } = action.payload;
            const { filters } = state;

            const dateTime: number = moment(filters.fromTime).unix() * 1000;
            const currentData = get(graphData, [0, 'CURRENT'], {});
            const voltageData = get(graphData, [0, 'VOLTAGE'], {});
            const liftPositionData = get(graphData, [0, 'LIFT_POSITION'], {});
            const data = {
                voltageData: convertGraphicalDataToTimerSeries(voltageData, dateTime),
                currentData: convertGraphicalDataToTimerSeries(currentData, dateTime),
                liftPositionData: convertGraphicalDataToTimerSeries(liftPositionData, dateTime),
            };
            state.cycleGapMetaDatas = { metaData, graphData: data };
        },

        setCycleGapMetaData(state, action: PayloadAction<CycleGapMetaData>) {
            state.cycleGapMetaData = action.payload;
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
        getPins(state) {
            // todo
            // let oldPins = localStorage.getItem('pins');
            // if (oldPins) oldPins = JSON.parse(oldPins);
            // if (oldPins) state.pins = oldPins;
        },
        setPins(state, action) {
            state.pins = action.payload;
            // localStorage.setItem('pins', JSON.stringify([...action.payload]));
        },
    },
});

export const {
    actions: cycleGapMetaDataActions,
    reducer: cycleGapMetaDataReducer,
    name: cycleGapMetaDataKey,
} = cycleGapMetaDatasSlice;

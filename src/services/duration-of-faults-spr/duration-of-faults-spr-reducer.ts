import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { Filters, DurationOfFaultsSprs } from 'models';
import { DurationOfFaultsSprsState } from '.';

export const initialState: DurationOfFaultsSprsState = {
    durationOfFaultsSprs: [],
    filters: {},
    error: undefined,
    isLoading: false,
};

const durationOfFaultsSprsSlice = createSlice({
    name: 'durationOfFaultsSprs',
    initialState,
    reducers: {
        getAllDurationOfFaultsSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllDurationOfFaultsSprs(state, action: PayloadAction<DurationOfFaultsSprs>) {
            state.durationOfFaultsSprs = action.payload;
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
    actions: durationOfFaultsSprActions,
    reducer: durationOfFaultsSprReducer,
    name: durationOfFaultsSprKey,
} = durationOfFaultsSprsSlice;

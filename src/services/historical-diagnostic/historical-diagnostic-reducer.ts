import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { Filters, HistoricalDiagnostics } from 'models';
import { HistoricalDiagnosticsState } from '.';

export const initialState: HistoricalDiagnosticsState = {
    historicalDiagnostics: [],
    historicalDiagnostic: undefined,
    historicalDiagnosticsFilteredByRules: [],
    filters: {},
    historicalSpr: [],
    error: undefined,
    isLoading: false,
};

const historicalDiagnosticsSlice = createSlice({
    name: 'historicalDiagnostics',
    initialState,
    reducers: {
        getAllHistoricalDiagnostics(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        getHistoricalDiagnostic(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllHistoricalDiagnostics(state, action: PayloadAction<HistoricalDiagnostics>) {
            const historicals = action.payload;
            const merged = [].concat.apply([], historicals);
            state.historicalDiagnostics = merged;
        },
        setAllHistoricalSpr(state, action: PayloadAction<HistoricalDiagnostics>) {
            const historicals = action.payload;
            const merged = [].concat.apply([], historicals);
            state.historicalSpr = merged;
        },
        setHistoricalDiagnostic(state, action: any) {
            state.historicalDiagnostic = action.payload;
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
    actions: historicalDiagnosticActions,
    reducer: historicalDiagnosticReducer,
    name: historicalDiagnosticKey,
} = historicalDiagnosticsSlice;

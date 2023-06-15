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
import { FaultCodes, Filters } from 'models';
import { FaultCodesState } from '.';

// The initial state of the FaultCode page
export const initialState: FaultCodesState = {
    faultCodes: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const faultCodesSlice = createSlice({
    name: 'faultCodes',
    initialState,
    reducers: {
        faultCodes(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setFaultCodes(state, action: PayloadAction<FaultCodes>) {
            state.faultCodes = action.payload;
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

export const { actions: faultCodesActions, reducer: faultCodesReducer, name: faultCodesKey } = faultCodesSlice;

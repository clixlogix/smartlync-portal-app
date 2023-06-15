import { createSlice } from 'utils/@reduxjs/toolkit';

export interface operationsFormState {
    isOpen: boolean;
}

export const initialState = {
    isOpen: false,
};

const operationsFormSlice = createSlice({
    name: 'operationsForm',
    initialState,
    reducers: {
        isOpen: (state) => {
            state.isOpen = !state.isOpen;
        },
    },
});

export const { actions, reducer, name: newOperation } = operationsFormSlice;

/*
 * Msg Slice
 *
 * Here we define:
 * - The shape of our msg container's slice of Redux store,
 * - All the actions which can be triggered for this slice, including their effects on the store.
 *
 * Note that, while we are using dot notation in our reducer, we are not actually mutating the state
 * manually. Under the hood, we use immer to apply these updates to a new copy of the state.
 * Please see https://immerjs.github.io/immer/docs/introduction for more information.
 *
 */

import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { MsgState } from '.';

// The initial state of the GithubRepoForm container
export const initialState: MsgState = {
    success: '',
    warning: '',
    error: '',
};

const msgSlice = createSlice({
    name: 'msg',
    initialState,
    reducers: {
        information(state, action: PayloadAction<string>) {
            state.success = action.payload;
        },
        warning(state, action: PayloadAction<string>) {
            state.warning = action.payload;
        },
        error(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        clear(state) {
            state = { ...initialState };
        },
    },
});

export const { actions, reducer, name: msg } = msgSlice;

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
import { RecommendedActionsState } from '.';

// The initial state of the RecommendedAction page
export const initialState: RecommendedActionsState = {
    recommendedActions: { recommendedAction: [] },
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const recommendedActionsSlice = createSlice({
    name: 'recommendedActions',
    initialState,
    reducers: {
        recommendedActions(state, action: PayloadAction<any /* RecommendedAction */>) {
            state.filters = action.payload;
        },
        setRecommendedActions(state, action: PayloadAction<any /* RecommendedAction */>) {
            state.recommendedActions = action.payload;
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
        // submitActions(state, action: PayloadAction<FaultActions>) {
        //     state.filters = action.payload;
        // },
    },
});

export const {
    actions: recommendedActionsActions,
    reducer: recommendedActionsReducer,
    name: recommendedActionsKey,
} = recommendedActionsSlice;

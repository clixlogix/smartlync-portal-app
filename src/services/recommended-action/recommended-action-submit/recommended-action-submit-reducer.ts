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
import { Filters /* RecommendedActionSubmit */ } from 'models';
import { RecommendedActionSubmitsState } from '.';

// The initial state of the RecommendedActionSubmit page
export const initialState: RecommendedActionSubmitsState = {
    recommendedActionSubmits: {},
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const recommendedActionSubmitsSlice = createSlice({
    name: 'recommendedActionSubmits',
    initialState,
    reducers: {
        recommendedActionSubmits(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        faultActions(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setRecommendedActionSubmits(state, action: PayloadAction<any /* RecommendedActionSubmit */>) {
            state.recommendedActionSubmits = action.payload;
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
    actions: recommendedActionSubmitsActions,
    reducer: recommendedActionSubmitsReducer,
    name: recommendedActionSubmitsKey,
} = recommendedActionSubmitsSlice;

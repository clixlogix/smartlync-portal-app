// import { useSelector } from 'react-redux';
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
import { RecommendedActionsHistorysState } from '.';
import { Filters, FaultActions, FaultActionView, FaultActionType } from 'models';

// The initial state of the RecommendedActionsHistory page
export const initialState: RecommendedActionsHistorysState = {
    recommendedActionsHistorys: [],
    getOriginalHistory: [],
    recommendedActionsHistory: undefined,

    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const recommendedActionsHistorysSlice = createSlice({
    name: 'recommendedActionsHistorys',
    initialState,
    reducers: {
        getAllRecommendedActionsHistorys(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllRecommendedActionsHistorys(state, action: PayloadAction<FaultActions>) {
            state.recommendedActionsHistorys = action.payload;
            state.getOriginalHistory = action.payload;
        },
        updateRecommendedActionsHistoryItem(state, action: PayloadAction<FaultActionView>) {
            const { actionId = '', actionType, actionKey } = action.payload;
            const { recommendedChecked, takenChecked, ...payload } = action.payload;
            let actions: FaultActions = [...(state.recommendedActionsHistorys || [])];

            actions = actions.filter(
                (act) =>
                    !(
                        (act.actionId === actionId && act.actionType === actionType) ||
                        (act.actionType === FaultActionType.Comment && actionKey === '')
                    ),
            );

            if (
                (payload.actionType === FaultActionType.UserAction && takenChecked) ||
                (payload.actionType === FaultActionType.RecommendedAction && recommendedChecked) ||
                payload.actionType === FaultActionType.Comment
            ) {
                actions.push(action.payload);
            }

            state.recommendedActionsHistorys = actions;
        },

        setRecommendedActionsHistory(state, action: PayloadAction<any>) {
            state.recommendedActionsHistory = action.payload;
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
    actions: recommendedActionsHistorysActions,
    reducer: recommendedActionsHistorysReducer,
    name: recommendedActionsHistorysKey,
} = recommendedActionsHistorysSlice;

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
import { Filters, OpportunityAnalysis, OpportunityAnalysiss, OpportunityStage } from 'models';
import { OpportunityAnalysissState } from '.';
import { getNumber } from 'utils';

// The initial state of the OpportunityAnalysis page
export const initialState: OpportunityAnalysissState = {
    opportunityAnalysiss: [],
    opportunityAnalysis: undefined,
    filters: {},
    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */

const opportunityAnalysissSlice = createSlice({
    name: 'opportunityAnalysiss',
    initialState,
    reducers: {
        getAllOpportunityAnalysiss(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllOpportunityAnalysiss(state, action: PayloadAction<OpportunityAnalysiss>) {
            const { payload } = action;
            const newData: OpportunityAnalysis[] = [];

            payload.forEach((value, index) => {
                const {
                    deviceName,
                    eventCode,
                    station,
                    description,
                    deviceHealth,
                    mttr,
                    alpha,
                    beta,
                    studType,
                    actionData,
                    occurredOn,
                } = value;
                newData.push({
                    deviceName,
                    eventCode,
                    station,
                    description,
                    deviceHealth,
                    occurredOn,
                    studType: studType || actionData[0]?.studType || '',
                    alpha: getNumber(alpha),
                    beta: getNumber(beta),
                    mttr: getNumber(mttr),
                    actionData,
                    latestStage:
                        actionData.findIndex((item) => item.actionType === 'taken') >= 0
                            ? OpportunityStage.AT
                            : OpportunityStage.AR,
                });
            });
            state.opportunityAnalysiss = newData;
        },

        setOpportunityAnalysis(state, action: PayloadAction<OpportunityAnalysis>) {
            state.opportunityAnalysis = action.payload;
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
    actions: opportunityAnalysisActions,
    reducer: opportunityAnalysisReducer,
    name: opportunityAnalysisKey,
} = opportunityAnalysissSlice;

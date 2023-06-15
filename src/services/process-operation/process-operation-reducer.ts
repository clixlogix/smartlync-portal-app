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
import { FilterNames, Filters, OperationItem, OperationItems } from 'models';
import { ProcessOperationsState } from '.';
import data from './sagas/data';

// The initial state of the ProcessOperation page
export const initialState: ProcessOperationsState = {
    operationItems: data || [],
    operationItem: undefined,
    filters: {},
    filterValues: {},

    error: undefined,
    isLoading: false,
};

const setFilter = (row: OperationItem, filters: Filters): OperationItem => {
    row.hidden = Object.keys(filters).reduce((acc: boolean, key: string) => {
        if (filters[key]) {
            switch (key) {
                case FilterNames.anomalyConfidence:
                    if (row?.confidence && row?.confidence < filters[key]) {
                        acc = true;
                    }
                    break;
                case FilterNames.deviceName:
                case FilterNames.systemType:
                case FilterNames.stationName:
                default:
                    if (row[key] && row[key] !== filters[key]) {
                        acc = true;
                    }
                    break;
            }
        }
        return acc;
    }, false);

    return { ...row };
};

/*
 *
 *
 */
const processOperationsSlice = createSlice({
    name: 'operationItems',
    initialState,
    reducers: {
        getAllOperationItems(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllOperationItems(state, action: PayloadAction<OperationItems>) {
            state.operationItems = action.payload;
        },

        addOperationItem(state, action: PayloadAction<OperationItem>) {
            const prevValues = state.filterValues || {};
            const { payload = {} as any } = action;
            if (Object.keys(payload).length === 0) return;
            // TODO: remove hardcoded system types... this should be retrieved from Data-Flows
            payload[FilterNames.systemType] = state.filters[FilterNames.systemType] || 'SWS';

            state.operationItems.unshift(setFilter(payload, state.filters));
            state.operationItems.splice(500);

            const { filterValues } = [payload].reduce(
                (acc, row) => {
                    acc.filterValues[FilterNames.anomaly].add(payload[FilterNames.anomaly]);
                    acc.filterValues[FilterNames.deviceName].add(payload[FilterNames.deviceName]);
                    acc.filterValues[FilterNames.stationName].add(payload[FilterNames.stationName]);
                    acc.filterValues[FilterNames.systemType].add(payload[FilterNames.systemType]);

                    return acc;
                },
                {
                    filterValues: {
                        [FilterNames.anomaly]: new Set(prevValues[FilterNames.anomaly]),
                        [FilterNames.deviceName]: new Set(prevValues[FilterNames.deviceName]),
                        [FilterNames.stationName]: new Set(prevValues[FilterNames.stationName]),
                        [FilterNames.systemType]: new Set(prevValues[FilterNames.systemType]),
                    },
                },
            );

            state.filterValues = Object.keys(filterValues).reduce((acc = {}, key) => {
                acc[key] = Array.from(filterValues[key]);
                return acc;
            }, {} as any);
        },

        filterAllOperationItems(state, action: PayloadAction<Filters>) {
            state.filters = (action.payload || {}) as Filters;
            state.operationItems = Array.from(state.operationItems || []).map((row: OperationItem) =>
                setFilter(row, state.filters),
            );
        },

        setOperationItem(state, action: PayloadAction<OperationItem>) {
            state.operationItem = action.payload;
        },

        error(state, action: PayloadAction<CustomError>) {
            state.error = action.payload;
        },
        loading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        clear(state) {
            state = { ...state, ...initialState };
        },
    },
});

export const {
    actions: processOperationActions,
    reducer: processOperationReducer,
    name: processOperationKey,
} = processOperationsSlice;

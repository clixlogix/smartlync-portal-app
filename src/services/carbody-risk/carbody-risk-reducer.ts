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
import { Filters, CarbodyRisk, CarbodyRisks, RiskTableHeadValue, SortOrderDirection } from 'models';
import { CarbodyRisksState } from '.';
import data from './sagas/data';
import remove from 'lodash/remove';
import orderBy from 'lodash/orderBy';

// The initial state of the CarbodyRisk page
export const initialState: CarbodyRisksState = {
    carbodyRisks: [],
    carbodyRisk: undefined,
    columns: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const carbodyRisksSlice = createSlice({
    name: 'carbodyRisks',
    initialState,
    reducers: {
        getAllCarbodyRisks(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },

        setAllCarbodyRisks(state, action: PayloadAction<CarbodyRisks>) {
            const { payload } = action;

            const newPayload = remove(payload, function (n) {
                return !data.includes(n?.weldId);
            });

            const { columns = [], tableData = {} } = newPayload.reduce(
                (acc, item: any, index) => {
                    const { carBody = '', studId = '', weldId = item?.weldId || '', ...rest } = item;
                    if (!carBody && !studId) {
                        return acc;
                    }

                    if (!carBody) {
                        const node: RiskTableHeadValue = { studId, ...rest };
                        acc.columns[studId] = acc.columns[studId]
                            ? acc.columns[node.studId]
                            : { ...node, weldId: new Set<string>() };
                        return acc;
                    }

                    if (!acc.tableData[carBody]) {
                        acc.tableData[carBody] = {
                            id: index,
                            carBody,
                            total: { carBody, studId, weldId, risk: 0 },
                        };
                    }

                    if (!studId) {
                        acc.tableData[carBody].total = { carBody, studId, weldId, ...rest };
                        return acc;
                    }

                    const node: CarbodyRisk = { carBody, studId, weldId, ...rest };

                    acc.tableData[carBody][studId] = node;
                    if (!acc.columns[studId]) {
                        acc.columns[studId] = { ...node, weldId: new Set<string>() };
                    }
                    acc.columns[studId].weldId.add(weldId);

                    return acc;
                },
                {
                    columns: {},
                    tableData: {} as any[],
                },
            );

            const carbodyRisks: any[] = Object.values(tableData);

            state.columns = Object.values(columns) as RiskTableHeadValue[];
            state.carbodyRisks = carbodyRisks;
        },

        setCarbodyRisk(state, action: PayloadAction<CarbodyRisk>) {
            state.carbodyRisk = action.payload;
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
        columnSort(state, action: PayloadAction<any>) {
            const { carbodyRisks, columns = [] } = { ...state };
            const { id = '', asc = SortOrderDirection.NONE } = action.payload;

            switch (id) {
                case 'carbodyId':
                case 'overallRiskRow':
                    const sortedCarbodyId = orderBy(
                        carbodyRisks,
                        [id === 'carbodyId' ? 'id' : 'total'],
                        [asc === 1 ? 'asc' : 'desc'],
                    );
                    state.carbodyRisks = sortedCarbodyId;
                    break;
                case 'studId':
                case 'overallRiskColumn':
                    const [carBodyId, total, ...rest] = columns;
                    const col = id === 'studId' ? id : 'risk';

                    const sortedColumns = rest.sort((a, b) =>
                        asc === 1 ? Number(a[col]) - Number(b[col]) : Number(b[col]) - Number(a[col]),
                    );
                    state.columns = [carBodyId, total, ...sortedColumns];
                    break;
                default:
                    break;
            }
        },
    },
});

export const { actions: carbodyRiskActions, reducer: carbodyRiskReducer, name: carbodyRiskKey } = carbodyRisksSlice;

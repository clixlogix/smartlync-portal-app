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
import { Filters, CarBodyTable, CarBodyTables, SortOrderDirection, RiskTableHeadValue } from 'models';
import { CarBodyTablesState } from '.';
import * as _ from 'lodash';

// The initial state of the CarBodyTable page
export const initialState: CarBodyTablesState = {
    carBodyTables: [],
    carBodyTable: undefined,
    columns: [],
    unfilteredData: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const carBodyTablesSlice = createSlice({
    name: 'carBodyTables',
    initialState,
    reducers: {
        getAllCarBodyTables(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllCarBodyTables(state, action: PayloadAction<CarBodyTables>) {
            const { payload } = action;
            const columns: Array<RiskTableHeadValue> = [];

            const extCol: Set<string> = new Set<string>();
            const grouping = 'carBody';

            payload.forEach((row: any) => {
                const { studID } = row;
                extCol.add(studID);
            });
            const extraColumns: Array<string> = [...Array.from(extCol)];
            const defaultTableValues = 0;

            const risk = 0;
            const intervals: any = extraColumns.reduce((acc = {}, studId) => {
                acc[studId] = defaultTableValues;
                columns[studId] = { studId, risk };
                return acc;
            }, {});

            const carBodyTablesData = Array.from(
                payload
                    .reduce((acc: Map<string, any>, row: any, index: number) => {
                        const key = grouping
                            .split(',')
                            .map((g) => row[g])
                            .join(',');
                        const { carBody, studID, total = 0, risk = +(Math.random() * 10).toFixed(0) } = row;
                        const dte = studID;

                        let tableRow = {
                            id: `${100000 + index}` || `${Math.random()}`,
                            carBody,
                            total,
                            studID: '',
                            ...intervals,
                            [dte]: risk,
                        };

                        if (risk > 0) {
                            columns[dte].risk = risk;
                        }

                        if (acc.has(key)) {
                            tableRow = acc.get(key);
                            tableRow[dte] = risk;
                        }

                        acc.set(key, tableRow);
                        return acc;
                    }, new Map<string, any>())
                    .values(),
            );

            state.columns = [...Object.values(columns)];
            state.carBodyTables = carBodyTablesData;
        },

        setCarBodyTable(state, action: PayloadAction<CarBodyTable>) {
            state.carBodyTable = action.payload;
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
            const { carBodyTables, columns = [] } = { ...state };
            const { id = '', asc = SortOrderDirection.NONE } = action.payload;

            switch (id) {
                case 'carbodyId':
                case 'overallRiskRow':
                    const sortedCarbodyId = _.orderBy(
                        carBodyTables,
                        [id === 'carbodyId' ? 'id' : 'total'],
                        [asc === 1 ? 'asc' : 'desc'],
                    );
                    state.carBodyTables = sortedCarbodyId;
                    break;
                case 'studId':
                    const [carBodyId, total, ...rest] = columns;
                    const sortedColumns = rest.sort((a, b) =>
                        asc === 1 ? Number(a) - Number(b) : Number(b) - Number(a),
                    );
                    state.columns = [carBodyId, total, ...sortedColumns];
                    break;
                case 'overallRiskColumn':
                    // sort by overall risk column totals...
                    // TODO: not done yet...
                    break;
                default:
            }
        },
    },
});

export const { actions: carBodyTableActions, reducer: carBodyTableReducer, name: carBodyTableKey } = carBodyTablesSlice;

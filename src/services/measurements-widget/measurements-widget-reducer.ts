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
import { Filters, MeasurementsWidget, MeasurementsWidgets, FilterNames } from 'models';
import { MeasurementsWidgetsState } from '.';
import data from './sagas/data';
import * as _ from 'lodash';
import moment from 'moment';

// The initial state of the MeasurementsWidget page
export const initialState: MeasurementsWidgetsState = {
    measurementsWidgets: data,
    measurementsWidget: undefined,
    measurementsWidgetsFilteredByRules: [],
    filters: {},
    defaultValues: [],
    filterValues: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const measurementsWidgetsSlice = createSlice({
    name: 'measurementsWidgets',
    initialState,
    reducers: {
        getAllMeasurementsWidgets(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllMeasurementsWidgets(state, action: PayloadAction<MeasurementsWidgets>) {
            // state.measurementsWidgets = action.payload;
            const { payload } = action;
            let convertedData: any = [];

            const groupedData = _.groupBy(payload, function (item) {
                return item?.tags?.deviceName;
            });

            const { filterValues = {} as any } = _.transform(
                groupedData,
                function (acc, value, key) {
                    const name = key;
                    let data: any = [];
                    value.forEach((element) => {
                        const { deviceName, feederNo, outletNo, studId } = element?.tags;
                        element?.values.forEach((item) => {
                            data.push({
                                x: moment(item[0]).valueOf(),
                                y: item[1],
                                time: item[0],
                                energy: item[1],
                                deviceName,
                                feederNo,
                                outletNo,
                                studId,
                            });
                        });

                        acc.filterValues[FilterNames.studId].add(`${studId}`);
                        acc.filterValues[FilterNames.outletNo].add(`${outletNo}`);
                        acc.filterValues[FilterNames.feederNo].add(`${feederNo}`);
                    });

                    convertedData.push({
                        name,
                        data,
                        type: 'scatter',
                        yAxis: 0,
                        marker: {
                            symbol: 'circle',
                        },
                    });

                    return acc;
                },
                {
                    filterValues: {
                        [FilterNames.feederNo]: new Set(),
                        [FilterNames.outletNo]: new Set(),
                        [FilterNames.studId]: new Set(),
                    },
                },
            );

            state.measurementsWidgets = convertedData;
            state.defaultValues = convertedData;
            state.filterValues = filterValues;
        },

        setMeasurementsWidget(state, action: PayloadAction<MeasurementsWidget>) {
            state.measurementsWidget = action.payload;
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
        localFiltering(state, action: PayloadAction<Filters>) {
            const { defaultValues } = state;

            const filtered: any =
                defaultValues?.reduce((acc: any[], item: any) => {
                    const data = _.filter(item?.data, { ...action.payload });
                    acc.push({ ...item, data });
                    return acc;
                }, []) || [];
            state.measurementsWidgets = filtered;
        },
    },
});

export const {
    actions: measurementsWidgetActions,
    reducer: measurementsWidgetReducer,
    name: measurementsWidgetKey,
} = measurementsWidgetsSlice;

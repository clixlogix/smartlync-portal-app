import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import moment from 'moment';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import transform from 'lodash/transform';
import isNumber from 'lodash/isNumber';

import { CustomError } from 'utils/error';
import { Filters, MeasurementsSprWidgets, FilterNames } from 'models';
import { MeasurementsSprWidgetsState } from '.';

export const initialState: MeasurementsSprWidgetsState = {
    measurementsSprWidgets: [],
    measurementsSprWidgetsFilteredByRules: [],
    filterValues: {},
    filters: {},

    error: undefined,
    isLoading: false,
};

const measurementsSprWidgetsSlice = createSlice({
    name: 'measurementsSprWidgets',
    initialState,
    reducers: {
        getAllMeasurementsSprWidgets(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllMeasurementsSprWidgets(state, action: PayloadAction<MeasurementsSprWidgets>) {
            const { payload } = action;
            let convertedData: any = [];

            const groupedData = groupBy(payload, function (item) {
                return item?.tags?.deviceName;
            });

            const { filterValues = {} as any } = transform(
                groupedData,
                function (acc, value, key) {
                    const name = key;
                    let data: any = [];
                    value.forEach((element) => {
                        const { deviceName, outletNo } = element?.tags;
                        element?.values.forEach((item) => {
                            const gap = item[1];
                            const gapNumeric = isNumber(gap) ? gap : Number(gap);
                            data.push({
                                x: moment(item[0]).valueOf(),
                                y: gapNumeric,
                                time: item[0],
                                energy: gapNumeric,
                                deviceName,
                                outletNo,
                            });
                        });
                        acc.filterValues[FilterNames.outletNo].add(`${outletNo}`);
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
                        [FilterNames.outletNo]: new Set(),
                    },
                },
            );

            state.measurementsSprWidgets = convertedData;
            state.measurementsSprWidgetsFilteredByRules = convertedData;
            state.filterValues = filterValues;
        },

        error(state, action: PayloadAction<CustomError>) {
            state.error = action.payload;
        },
        loading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        localFiltering(state, action: PayloadAction<Filters>) {
            const { measurementsSprWidgets } = state;

            const filtered: any =
                measurementsSprWidgets?.reduce((acc: any[], item: any) => {
                    const data = filter(item?.data, { ...action.payload });
                    acc.push({ ...item, data });
                    return acc;
                }, []) || [];
            state.measurementsSprWidgetsFilteredByRules = filtered;
        },
    },
});

export const {
    actions: measurementsSprWidgetActions,
    reducer: measurementsSprWidgetReducer,
    name: measurementsSprWidgetKey,
} = measurementsSprWidgetsSlice;

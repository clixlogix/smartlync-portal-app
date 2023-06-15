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
import { Filters, WeldingTimeMeasurementTrend, WeldingTimeMeasurementTrends, FilterNames } from 'models';
import { WeldingTimeMeasurementTrendsState } from '.';
import { groupBy, transform, filter } from 'lodash';
import moment from 'moment';
// import data from './sagas/data';

// The initial state of the WeldingTimeMeasurementTrend page
export const initialState: WeldingTimeMeasurementTrendsState = {
    weldingTimeMeasurementTrends: [],
    weldingTimeMeasurementTrend: undefined,
    filters: {},
    error: undefined,
    defaultValues: [],
    filterValues: {},
    isLoading: false,
};

/*
 *
 *
 */
const weldingTimeMeasurementTrendsSlice = createSlice({
    name: 'weldingTimeMeasurementTrends',
    initialState,
    reducers: {
        getAllWeldingTimeMeasurementTrends(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllWeldingTimeMeasurementTrends(state, action: PayloadAction<WeldingTimeMeasurementTrends>) {
            // state.weldingTimeMeasurementTrends = action.payload;
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
                        const { deviceName, feederNo, outletNo, studId } = element?.tags;
                        element?.values.forEach((item) => {
                            data.push({
                                x: moment(item[0]).valueOf(),
                                y: item[1],
                                time: item[0],
                                weldTime: item[1],
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

            state.weldingTimeMeasurementTrends = convertedData;
            state.defaultValues = convertedData;
            state.filterValues = filterValues;
        },

        setWeldingTimeMeasurementTrend(state, action: PayloadAction<WeldingTimeMeasurementTrend>) {
            state.weldingTimeMeasurementTrend = action.payload;
        },

        localFiltering(state, action: PayloadAction<Filters>) {
            const { defaultValues } = state;

            const filteredWeldTime: any =
                defaultValues?.reduce((acc: any[], item: any) => {
                    const data = filter(item?.data, { ...action.payload });
                    acc.push({ ...item, data });
                    return acc;
                }, []) || [];
            state.weldingTimeMeasurementTrends = filteredWeldTime;
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
    actions: weldingTimeMeasurementTrendActions,
    reducer: weldingTimeMeasurementTrendReducer,
    name: weldingTimeMeasurementTrendKey,
} = weldingTimeMeasurementTrendsSlice;

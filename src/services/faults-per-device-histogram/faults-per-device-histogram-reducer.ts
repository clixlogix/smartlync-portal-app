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
import { Filters, FaultsPerDeviceHistograms, ChartData } from 'models';
import { FaultsPerDeviceHistogramsState } from '.';
import { groupBy, transform } from 'lodash';

// The initial state of the FaultsPerDeviceHistogram page
export const initialState: FaultsPerDeviceHistogramsState = {
    faultsPerDeviceHistograms: [],
    faultsPerDeviceHistogram: undefined,
    faultsPerDeviceHistogramsFilteredByRules: [],
    filters: {},
    filterValues: {},
    categories: [],
    defaultValues: [],
    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const faultsPerDeviceHistogramsSlice = createSlice({
    name: 'faultsPerDeviceHistograms',
    initialState,
    reducers: {
        getAllFaultsPerDeviceHistograms(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllFaultsPerDeviceHistograms(state, action: PayloadAction<FaultsPerDeviceHistograms>) {
            const { payload = [] } = action;

            // const { filters } = state;
            let convertedData: ChartData[] = [];
            let categories = new Set();

            const groupedPayload = groupBy(payload, 'eventCode');

            const { filterValues = {} as any } = transform(
                groupedPayload,
                function (acc, value, key) {
                    const name = key;
                    let data: any = [];
                    if (key) {
                        value.forEach((element) => {
                            const { deviceName, eventCode, details, occurrences } = element;

                            data.push({
                                name: deviceName,
                                y: parseInt(occurrences),
                                eventCode: eventCode,
                                details,
                                occurrences: occurrences,
                                deviceName: deviceName,
                                ...element,
                            });
                            categories.add(deviceName);
                        });
                        convertedData.push({
                            name,
                            data,
                            type: 'histogram',
                        });
                    }

                    return acc;
                },
                {
                    filterValues: {},
                },
            );
            state.categories = categories;
            state.faultsPerDeviceHistograms = convertedData;
            state.filterValues = filterValues;
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
    actions: faultsPerDeviceHistogramActions,
    reducer: faultsPerDeviceHistogramReducer,
    name: faultsPerDeviceHistogramKey,
} = faultsPerDeviceHistogramsSlice;

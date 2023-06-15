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
import { Filters, EssentialControlWidgets, FilterNames } from 'models';
import { EssentialControlWidgetssState } from '.';
import { filter } from 'lodash';
import * as _ from 'lodash';

// The initial state of the EssentialControlWidgets page
export const initialState: EssentialControlWidgetssState = {
    essentialControlWidgetss: [],
    essentialControlWidgets: undefined,
    essentialControlWidgetssFilteredByRules: [],
    formattedEssentialControlEvents: [],
    filters: {},
    defaultEventValues: [],
    defaultValues: {},
    filterValues: {},
    error: undefined,
    isLoading: false,
    localFilters: {},
};

/*
 *
 *
 */
const essentialControlWidgetssSlice = createSlice({
    name: 'essentialControlWidgetss',
    initialState,
    reducers: {
        getAllEssentialControlWidgetss(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllEssentialControlWidgetss(state, action: PayloadAction<any>) {
            let { payload } = action;
            let { AllResult } = payload;
            const finalResult = {};
            let filterValues = {};

            let feederNoFilter = new Set();
            let outletNoFilter = new Set();
            let studIdFilter = new Set();

            Object.entries(AllResult).forEach((entry: any) => {
                const [key, value] = entry;

                const time: any = [];
                const actual: any = [];
                const minimum: any = [];
                const maximum: any = [];

                _.forEach(value, function (data, key) {
                    const { deviceName, feederNo, outletNo, studId } = data?.tags;
                    feederNoFilter.add(`${feederNo}`);
                    outletNoFilter.add(`${outletNo}`);
                    studIdFilter.add(`${studId}`);

                    data?.values?.forEach((item, i) => {
                        time?.push(item[0]);
                        actual?.push(item[1]);
                        minimum?.push(item[2]);
                        maximum?.push(item[3]);
                    });
                    filterValues = {
                        [FilterNames.feederNo]: feederNoFilter,
                        [FilterNames.outletNo]: outletNoFilter,
                        [FilterNames.studId]: studIdFilter,
                    };
                });
                state.filterValues = filterValues;
                finalResult[key] = [{ time, actual, minimum, maximum }];
            });

            const convertedEventsData: any = [];
            const filteredResult = {};

            _.forEach(finalResult, function (value, key) {
                const series =
                    value?.reduce((acc: any[], item: any) => {
                        const data = filter(item?.data, { ...state.localFilters });
                        acc.push({ ...item, data });
                        return acc;
                    }, []) || [];
                filteredResult[key] = series;
            });

            state.essentialControlWidgetss = { ...filteredResult };
            state.defaultValues = finalResult;

            state.formattedEssentialControlEvents = convertedEventsData;
            state.defaultEventValues = convertedEventsData;
        },

        setEssentialControlWidgets(state, action: PayloadAction<EssentialControlWidgets>) {
            state.essentialControlWidgets = action.payload;
        },

        // filterEssentialControlWidgetssByRules(state, action: PayloadAction<Rule[]>) {
        //     state.essentialControlWidgetssFilteredByRules = filterByRule(
        //         state.essentialControlWidgetss,
        //         action.payload,
        //     );
        // },

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
    actions: essentialControlWidgetsActions,
    reducer: essentialControlWidgetsReducer,
    name: essentialControlWidgetsKey,
} = essentialControlWidgetssSlice;

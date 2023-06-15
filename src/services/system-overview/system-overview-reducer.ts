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
import { FilterNames, Filters, SystemOverview, SystemOverviews } from 'models';
import { SystemOverviewsState } from '.';
import { Rule } from 'components/panels/RulesPanel/RulesPanel';
import { filterByRule } from 'utils/filterByRule';
import maintenanceDataMap from 'services/system-overview/data';

// The initial state of the SystemOverview page
export const initialState: SystemOverviewsState = {
    systemOverviews: [],
    systemOverviewsFilteredByRule: [],
    filters: {},
    filterValues: {},
    pinSystemOverviews: [],
    error: undefined,
    isLoading: false,
};

const setFilter = (row: SystemOverview, filters: Filters): SystemOverview => {
    const [line, station] = row[FilterNames.deviceName].split(' ');

    row.hidden = Object.keys(filters).reduce((acc: boolean, key: string) => {
        if (filters[key]) {
            switch (key) {
                case FilterNames.deviceLine:
                    if (line && !filters[key].includes(line)) {
                        acc = true;
                    }
                    break;
                case FilterNames.stationName:
                    if (station && !filters[key].includes(station)) {
                        acc = true;
                    }
                    break;
                case FilterNames.deviceName:
                default:
                    if (row[key] && row[key] !== filters[key]) {
                        acc = true;
                    }
                    break;
            }
        }
        return acc;
    }, false);

    return new SystemOverview({ ...row });
};

/*
 *
 *
 */
const systemOverviewsSlice = createSlice({
    name: 'systemOverviews',
    initialState,
    reducers: {
        systemOverviews(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },

        setSystemOverviews(state, action: PayloadAction<SystemOverviews>) {
            const pinnedDatafromLS = localStorage.getItem('myPinnedItems');
            const pinnedItems = action.payload.map((row) => {
                let pinned = pinnedDatafromLS?.includes(row.deviceName);
                let maintenanceData: any = '';
                maintenanceData = maintenanceDataMap.has(row.deviceName)
                    ? maintenanceDataMap.get(row.deviceName).deviceHealth
                    : maintenanceData;

                return { ...row, pinned, deviceHealth: row?.health ? row?.health : maintenanceData };
            });
            state.systemOverviews = pinnedItems;
            state.systemOverviewsFilteredByRule = filterByRule(state.systemOverviews, []);
        },

        filterSystemOverviews(state, action: PayloadAction<Filters>) {
            state.filters = (action.payload || {}) as Filters;

            state.systemOverviewsFilteredByRule = (
                state.systemOverviewsFilteredByRule || []
            ).map((row: SystemOverview) => setFilter(row, state.filters));
        },

        filterSystemOverviewsByRules(state, action: PayloadAction<Rule[]>) {
            state.systemOverviewsFilteredByRule = filterByRule(state.systemOverviews, action.payload);
        },

        pinSystemOverviews(state, action: PayloadAction<string>) {
            const deviceName: string = action.payload;
            const existingEntries: string[] = [deviceName];
            const dataFromLS = localStorage.getItem('myPinnedItems');
            const parsedPinnedDataFromLS = dataFromLS ? JSON.parse(dataFromLS) : [];
            existingEntries.push(...parsedPinnedDataFromLS);

            localStorage.setItem('myPinnedItems', JSON.stringify(existingEntries));
            state.systemOverviewsFilteredByRule = state.systemOverviewsFilteredByRule.map((row: SystemOverview) => {
                if (existingEntries.includes(row.deviceName)) {
                    row.pinned = true;
                }
                return row;
            });
        },

        unPinSystemOverviews(state, action: PayloadAction<string>) {
            const deviceName: string = action.payload;
            const pinnedDatafromLS = localStorage.getItem('myPinnedItems');
            const parsedPinnedDataFromLS = pinnedDatafromLS ? JSON.parse(pinnedDatafromLS) : [];
            const updatedDataFromLS = parsedPinnedDataFromLS.filter((item) => item !== deviceName);

            localStorage.setItem('myPinnedItems', JSON.stringify(updatedDataFromLS));
            state.systemOverviewsFilteredByRule = (state.systemOverviewsFilteredByRule || []).map(
                (row: SystemOverview) => {
                    if (row.deviceName === deviceName) {
                        row.pinned = false;
                    }
                    return row;
                },
            );
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
    actions: systemOverviewsActions,
    reducer: systemOverviewsReducer,
    name: systemOverviewsKey,
} = systemOverviewsSlice;

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
import { FaultCounts, Filters, ReportingDataView } from 'models';
import { FaultCountsState } from '.';
import moment from 'moment';

// The initial state of the FaultRate page
export const initialState: FaultCountsState = {
    faultCounts: [],
    faultReports: [],
    totalFaultCounts: { total: 0 },
    filters: {},
    filterValues: {},

    error: undefined,
    isLoading: false,
};

type IntervalViewData = {
    label: ReportingDataView;
    labelFormat: string;
    period: string;
    fn: string;
    colWidth: number;
    groupingFormat: string;
    sortCompare?: Function;
};

const intervalViews: IntervalViewData[] = [];

// setup common properties for each kind of view
intervalViews[ReportingDataView.Hourly] = {
    label: ReportingDataView.Hourly,
    labelFormat: `h`,
    extendedLabelFormat: `(DD-MMM)`,
    period: 'hour',
    fn: 'dayOfYear',
    colWidth: 84,
    expandedColWidth: 175,
    groupingFormat: 'YYYYMMDD',
    threshold: { ratio: 0.2 },
    // customTableHeader: DailyTableHeader,
    // customBodyRender: DailyTableBody,
    // customHeadLabelRender: DailyTableHeadLabel,
    // customHeadRender: DailyTableHeader,
};
intervalViews[ReportingDataView.Daily] = {
    label: ReportingDataView.Daily,
    labelFormat: `dddd`,
    extendedLabelFormat: `(DD-MMM)`,
    period: 'day',
    fn: 'dayOfYear',
    colWidth: 84,
    expandedColWidth: 175,
    groupingFormat: 'YYYYMMDD',
    threshold: { ratio: 0.2 },
    // customTableHeader: DailyTableHeader,
    // customBodyRender: DailyTableBody,
    // customHeadLabelRender: DailyTableHeadLabel,
    // customHeadRender: DailyTableHeader,
};
intervalViews[ReportingDataView.Weekly] = {
    label: ReportingDataView.Weekly,
    labelFormat: 'W',
    period: 'isoWeek',
    fn: 'isoWeek',
    colWidth: 42,
    expandedColWidth: 190,
    groupingFormat: 'YYYYWW',
    threshold: { eventCount: 20 },
    // customTableHeader: WeeklyTableHeader,
    // customBodyRender: WeeklyTableBody,
    // customHeadLabelRender: WeeklyTableHeadLabel,
    // customHeadRender: WeeklyTableHead,
    sortCompare: true,
};

/*
 *
 *
 */
const faultCountsSlice = createSlice({
    name: 'faultCounts',
    initialState,
    reducers: {
        faultCounts(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setFaultCounts(state, action: PayloadAction<FaultCounts>) {
            const { payload = [] } = action;
            const { filters = {} } = state;

            const totalFaultCounts = { ...initialState.totalFaultCounts };

            const { grouping = 'faultCode', view = ReportingDataView.Weekly } = {
                ...filters,
            };
            const { groupingFormat = 'YYYYWW', period = 'isoWeek' } = intervalViews[view];

            const intervals: any = {};

            const endInterval = !filters.toTime ? moment() : moment(filters.toTime);
            const from = !filters.fromTime
                ? moment(endInterval).subtract(3, 'months').toDate()
                : moment(filters.fromTime, 'YYYY-MM-DD+HH:mm:ss').toDate();
            const currInterval = moment(from);

            let cnt = 0;
            const defaultTableValues = { cycleCount: 0, eventCount: 0, wipCount: 0, wopCount: 0 };

            do {
                const dte = currInterval.format(groupingFormat).toString();
                intervals[dte] = { time: moment(dte, groupingFormat).toDate(), ...defaultTableValues };
                currInterval.add(1 as moment.DurationInputArg1, period as moment.DurationInputArg2);
                cnt++;
                totalFaultCounts[dte] = 0;
            } while (!currInterval.isSameOrAfter(endInterval) && cnt < 52);

            state.faultReports = Array.from(
                payload
                    .reduce((acc: Map<string, any>, row: any) => {
                        const { faultCode = row.event, event, description, extendedDescription, time, ...rest } = row;
                        const datetime = moment(time);
                        const dte = moment(time).format(groupingFormat).toString();
                        const sanitizeRowrow = { ...row, faultCode };

                        const key = grouping
                            .split(',')
                            .map((g) => sanitizeRowrow[g])
                            .join(',');

                        let tableRow: any;

                        totalFaultCounts[dte] = !totalFaultCounts[dte]
                            ? rest.eventCount
                            : totalFaultCounts[dte] + rest.eventCount;

                        if (!acc.has(key)) {
                            tableRow = {
                                faultCode,
                                description: { description, extendedDescription },
                                ...intervals,
                                [dte]: { time: datetime.toDate(), ...defaultTableValues, ...rest },
                                total: rest.eventCount,
                            };
                        } else {
                            tableRow = acc.get(key);

                            // if time/column already exist add to existing time
                            // else create new time column

                            if (tableRow[dte]) {
                                const rowData = { ...tableRow[dte] };

                                Object.keys(rest).forEach((k) => {
                                    rowData[k] += rest[k];
                                });
                                tableRow[dte] = rowData;
                            } else {
                                tableRow[dte] = { time: datetime.toDate(), ...defaultTableValues, ...rest };
                            }
                            tableRow.total += rest.eventCount;
                        }

                        acc.set(key, tableRow);

                        return acc;
                    }, new Map<string, any>())
                    .values(),
            );

            state.faultCounts = action.payload;
            state.totalFaultCounts = totalFaultCounts;
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

export const { actions: faultCountsActions, reducer: faultCountsReducer, name: faultCountsKey } = faultCountsSlice;

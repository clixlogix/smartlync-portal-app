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
import { Filters, FaultReportItem, FaultReports, ReportingDataView } from 'models';
import { FaultReportsState } from '.';
import data from './sagas/data';
import moment from 'moment';

// The initial state of the FaultReport page
export const initialState: FaultReportsState = {
    faultReports: data,
    faultReport: undefined,
    filters: {},

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
    threshold: { faultCount: 20 },
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
const faultReportsSlice = createSlice({
    name: 'faultReports',
    initialState,
    reducers: {
        getAllFaultReports(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllFaultReports(state, action: PayloadAction<FaultReports>) {
            const { payload = [] } = action;
            const { filters = {} } = state;
            const { grouping = 'studType,deviceName', view = ReportingDataView.Weekly } = {
                ...filters,
            };
            const { groupingFormat = 'YYYYWW', period = 'isoWeek' } = intervalViews[view];

            const intervals: any = {};

            const from = !filters.fromTime
                ? moment().subtract(3, 'months').toDate()
                : moment(filters.fromTime, 'YYYY-MM-DD+HH:mm:ss').toDate();
            const currInterval = moment(from);
            const endInterval = !filters.toTime ? moment() : moment(filters.toTime);

            let cnt = 0;
            const defaultTableValues = { cycleCount: 0, faultCount: 0, wipCount: 0, wopCount: 0 };
            do {
                const dte = currInterval.format(groupingFormat).toString();
                intervals[dte] = { time: moment(dte, groupingFormat).toDate(), ...defaultTableValues };
                currInterval.add(1 as moment.DurationInputArg1, period as moment.DurationInputArg2);
                cnt++;
            } while (!currInterval.isSameOrAfter(endInterval) && cnt < 52);

            state.faultReports = Array.from(
                payload
                    .reduce((acc: Map<string, any>, row: FaultReportItem) => {
                        const key = grouping
                            .split(',')
                            .map((g) => row[g])
                            .join(',');
                        const { deviceName, studId, studType, time, ...rest } = row;
                        const dte = moment(time).format(groupingFormat).toString();

                        let tableRow = {
                            deviceName,
                            studId,
                            studType,
                            ...intervals,
                            [dte]: { ...rest, time },
                        };

                        if (acc.has(key)) {
                            tableRow = acc.get(key);

                            // if time/column already exist add to existing time
                            // else create new time column

                            if (tableRow[dte]) {
                                Object.keys(rest).forEach((key) => {
                                    tableRow[dte][key] += Number(rest[key]);
                                });
                            } else {
                                tableRow[dte] = { ...rest, time };
                            }
                        }

                        acc.set(key, tableRow);
                        return acc;
                    }, new Map<string, any>())
                    .values(),
            );
        },

        setFaultReport(state, action: PayloadAction<FaultReportItem>) {
            state.faultReport = action.payload;
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

export const { actions: faultReportActions, reducer: faultReportReducer, name: faultReportKey } = faultReportsSlice;

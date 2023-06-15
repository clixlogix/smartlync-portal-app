/**
 *
 * FaultReport
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { faultReportActions, faultReportReducer, faultReportKey } from 'services/fault-report/fault-report-reducer';
import { selectFaultReports, selectFaultReportIsLoading } from 'services/fault-report/fault-report-selectors';
import { getAllFaultReportsSaga } from 'services/fault-report/sagas/fault-report-saga-get-all';
import { Filters, FaultReports, ReportingDataView, FilterNames } from 'models';
import { TableBody as WeeklyTableBody, TableHeader as WeeklyTableHead } from './components/weekly';
import { TableHeader as DailyTableHeader, TableBody as DailyTableBody } from './components/daily';
import Table from 'components/Table';
import { WidgetProps, Widget } from 'widgets';
import { columns as initialColumns } from './columns';
import moment from 'moment';
import { messages } from './messages';

import 'scss/main.scss';
import './FaultReport.scss';

interface FaultReportProps extends WidgetProps {}

type IntervalViewData = {
    label: ReportingDataView;
    labelFormat: string;
    period: string;
    fn: string;
    colWidth: number;
    threshold?: any;
    groupingFormat: string;
    extendedLabelFormat?: string;
    expandedColWidth?: number;
    sortCompare?: Function;
    customHeadRender?: Function;
    customBodyRender?: Function;
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
    customBodyRender: DailyTableBody,
    customHeadRender: DailyTableHeader,
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
    customBodyRender: DailyTableBody,
    customHeadRender: DailyTableHeader,
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
    customBodyRender: WeeklyTableBody,
    customHeadRender: WeeklyTableHead,
    sortCompare: true,
};

export const FaultReportWidget: Widget<FaultReportProps> = memo((props: FaultReportProps) => {
    const { className = '', filters = {} } = props;

    useInjectReducer({ key: faultReportKey, reducer: faultReportReducer });
    useInjectSaga({ key: faultReportKey, saga: getAllFaultReportsSaga });

    const { t, i18n } = useTranslation();
    const [colGrouping] = useState<string[]>(['studType', 'deviceName']);
    const faultReports: FaultReports | undefined = useSelector(selectFaultReports);
    const faultReportIsLoading: boolean = useSelector(selectFaultReportIsLoading);
    const [sortColumn] = useState<string>();
    const [weeklyExpandAll] = useState<boolean>(false);

    const dispatch = useDispatch();

    const displayRows: FaultReports = useMemo(() => {
        return (faultReports || []).filter((row) => !row.hidden);
    }, [faultReports]);

    if (props.isLoading) {
        props.isLoading(faultReportIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        tenant: 'daimler',
        grouping: 'studType,deviceName',
        langCode: ['en'],
        fromTime: '2021-02-01+00:00:00',
        toTime: '2021-06-28T17:47:06.847Z',
        faultCode: '20002',
        view: ReportingDataView.Weekly,
        ...defaultFilters,
        // add your filters here
        ...filters,
    });

    const serviceFilters = useMemo(() => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }), [
        widgetFilters,
        filters,
        i18n.language,
    ]);

    useEffect(() => {
        dispatch(faultReportActions.getAllFaultReports(serviceFilters));
    }, [dispatch, serviceFilters]);

    const { view = ReportingDataView.Weekly } = filters;

    const tableTheme = useMemo(() => {
        const obj: any = {
            root: {
                '&$disabled': {
                    color: '#ffdb38',
                },
            },
            MuiTableCell: {
                root: {
                    font: 'normal normal normal 18px/60px Open Sans',
                },
            },
            MUIDataTableBodyCell: {
                stackedCommon: {
                    color: '#fff',
                    textAlign: 'center',
                },
            },
        };

        return obj;
    }, []);

    const options = {
        filterType: 'checkbox',
        elavation: 4,
        enableNestedDataAccess: '.',
    };

    const tableData = displayRows;
    const tableColumns = useMemo(() => {
        const fixedColumns = ['deviceName', 'studId', 'studType'];
        const columns = Object.keys(tableData.length > 0 ? tableData[0] : {})
            .filter((key) => !fixedColumns.includes(key))
            .map((col, index) => {
                const { groupingFormat, labelFormat } = intervalViews[view];
                const time = moment(col, groupingFormat);
                const columnOptions: any = {};

                if (intervalViews[view].customHeadRender) {
                    columnOptions.customHeadRender = (columnMeta, handleToggleColumn, sortOrder) =>
                        // @ts-ignore
                        intervalViews[view].customHeadRender({
                            columnMeta,
                            handleToggleColumn: () => {},
                            // (columnName: string, index: number) =>
                            //     preHandleToggleColumn(columnName, index, handleToggleColumn, sortOrder),
                            sortOrder,
                            order: undefined,
                            className: '  ',
                            expand: weeklyExpandAll,
                            width: !weeklyExpandAll
                                ? intervalViews[view].colWidth
                                : intervalViews[view].expandedColWidth,
                            labelFormat: intervalViews[view].labelFormat,
                            extendedLabelFormat: intervalViews[view].extendedLabelFormat,
                            threshold: intervalViews[view].threshold,
                            langCode: i18n.language,
                            sortColumn,
                            handleTableLinkClick: () => {},
                        });
                }

                if (intervalViews[view].customBodyRender) {
                    columnOptions.customBodyRender = (value, tableMeta, updateValue) =>
                        // @ts-ignore
                        intervalViews[view].customBodyRender({
                            value,
                            tableMeta,
                            updateValue,
                            expand: weeklyExpandAll,
                            threshold: intervalViews[view].threshold,
                            className: 'x-cls-body-cell',
                            colGrouping,
                            sortColumn,
                            width: !weeklyExpandAll
                                ? intervalViews[view].colWidth
                                : intervalViews[view].expandedColWidth,
                            onShowRecommendedAction: () => {}, // setShowRecommendedActionsPopUp,
                            onTableRowClick: () => {}, // setCellSelected,
                            setOccurredOn: () => {}, // setOccurredOn,
                        });
                }

                return {
                    name: time.format(labelFormat),
                    options: columnOptions,
                };
            });
        return [...initialColumns.slice(0, 3).map((c) => ({ ...c, label: t(messages[c.label]) })), ...columns];
    }, [view, tableData, t, i18n.language, weeklyExpandAll, sortColumn, colGrouping]);

    return (
        <Div className={`${className} x-cls-fault-report-widget`}>
            <SizeMe>
                {({ size }) => {
                    const { height = 0 } = size as any;
                    const tableBodyHeight = height - 220;

                    return (
                        <Table
                            className={`x-cls-fault-report-widget-table`}
                            data={displayRows}
                            columns={tableColumns}
                            options={{ ...options, tableBodyHeight }}
                            themeObj={tableTheme}
                        />
                    );
                }}
            </SizeMe>
        </Div>
    );
});

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
*/
];
export const FaultReportProperty = Object.assign(
    {},
    {
        defaultFilters: defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 0,
            w: 2,
            h: 3,
            minW: 1,
            minH: 1,
        },
    },
);

export default FaultReportWidget;

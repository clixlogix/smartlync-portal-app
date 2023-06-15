/**
 *
 * DevicesFaultReport
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import Loader from 'components/Loader';
import { faultCountsActions, faultCountsReducer, faultCountsKey } from 'services/fault/fault-count/fault-count-reducer';
import {
    selectFaultReports,
    selectTotalFaultCounts,
    selectFaultCountsIsLoading,
} from 'services/fault/fault-count/fault-count-selectors';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { faultCountsSaga } from 'services/fault/fault-count/fault-count-saga';
import { FilterNames, Filters, ReportingDataView, IntervalViewData } from 'models';
import { TableHeadLabel as WeeklyTableHeadLabel } from './components/weekly';
import { TableHeader as DailyTableHeader, TableBody as DailyTableBody } from './components/daily';
import { TableHeadLabel as HourlyTableHeadLabel } from './components/hourly';
import { getInitialColumns as initialColumns, totalColumn } from './columns';
import { useQueryParam } from 'utils';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import useMediaQuery from '@mui/material/useMediaQuery';
import Table from 'components/Table';
import { WidgetProps, Widget } from 'widgets';
import moment from 'moment';
import { messages } from './messages';

import 'scss/main.scss';
import './DevicesFaultReport.scss';

interface DevicesFaultReportProps extends WidgetProps {
    localFilters?: Filters;
}

// setup common properties for each kind of view
const intervalViews: IntervalViewData[] = [];

intervalViews[ReportingDataView.Hourly] = {
    label: ReportingDataView.Hourly,
    labelFormat: `h`,
    extendedLabelFormat: `(DD-MMM)`,
    period: 'hour',
    fn: 'dayOfYear',
    colWidth: 42,
    expandedColWidth: 175,
    groupingFormat: 'YYYYMMDD',
    threshold: { ratio: 0.2 },
    customHeadLabelRender: HourlyTableHeadLabel,
};
intervalViews[ReportingDataView.Daily] = {
    label: ReportingDataView.Daily,
    labelFormat: `D`,
    extendedLabelFormat: `(DD-MMM)`,
    period: 'day',
    fn: 'dayOfYear',
    colWidth: 42,
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
    expandedColWidth: 220,
    groupingFormat: 'YYYYWW',
    threshold: { faultCount: 20 },
    customHeadLabelRender: WeeklyTableHeadLabel,
    sortCompare: true,
};

const FAULT_COUNT_THRESHOLD = 50;
const defaultFilters: Filters = {
    [FilterNames.reportThreshold]: FAULT_COUNT_THRESHOLD,
    [FilterNames.studType]: undefined,
    [FilterNames.faultAssignment]: 2,
    [FilterNames.weekDay]: undefined,
    [FilterNames.event]: 'Fault',
};

export const DevicesFaultReportWidget: Widget<DevicesFaultReportProps> = memo((props: DevicesFaultReportProps) => {
    useInjectReducer({ key: faultCountsKey, reducer: faultCountsReducer });
    useInjectSaga({ key: faultCountsKey, saga: faultCountsSaga });

    const { className = '', filters = {} } = props;
    const { t, i18n } = useTranslation();
    const [expanded] = useState<boolean>(false);
    const [plantId] = useQueryParam<string>('plantId', '1', true);
    const [colGrouping] = useState<string[]>(['fault', 'description']);
    const dispatch = useDispatch();

    const faultReports: any[] = useSelector(selectFaultReports);
    const totalFaultCounts = useSelector(selectTotalFaultCounts);
    const isLoading = useSelector(selectFaultCountsIsLoading);

    const displayRows = useMemo(() => {
        return faultReports || [];
    }, [faultReports]);

    if (props.isLoading) {
        props.isLoading(isLoading);
    }

    let screenSize;
    if (useMediaQuery('(max-width:960px)')) {
        screenSize = 'extraSmall';
    }
    if (useMediaQuery('(max-width:1024px)')) {
        screenSize = 'small';
    }
    if (useMediaQuery('(min-width:1024px) and (max-width:1500px)')) {
        screenSize = 'medium';
    }

    const [widgetFilter] = useState<Filters>({
        [FilterNames.plantId]: plantId,
        [FilterNames.reportThreshold]: FAULT_COUNT_THRESHOLD,
        [FilterNames.view]: ReportingDataView.Daily,
        [FilterNames.selectedLanguage]: i18n.language,
        [FilterNames.systemType]: 'SWS',
        ...defaultFilters,
        // add your filters here
        ...filters,
    });

    const widgetFilters = useMemo(
        () => ({
            ...filters,
            ...widgetFilter,
        }),
        [widgetFilter, filters],
    );

    const serviceFilters = useMemo(() => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }), [
        widgetFilters,
        filters,
        i18n.language,
    ]);

    useEffect(() => {
        const { weekDay, weekDayNo, reportThreshold, ...dispatchFilter } = serviceFilters;
        if (!!weekDay) {
            // @ts-ignore
            dispatchFilter.weekDay = weekDayNo;
        }
        dispatch(faultCountsActions.faultCounts(dispatchFilter));
    }, [dispatch, serviceFilters, filters.faultCode]);

    const { view = ReportingDataView.Weekly } = { ...widgetFilters };
    const tableData = displayRows;

    const tableColumns = useMemo(() => {
        const fixedColumns = ['faultCode', 'description', 'total'];
        const columns = Object.keys(tableData.length > 0 ? tableData[0] : {})
            .filter((key) => !fixedColumns.includes(key))
            .map((col, index) => {
                const { groupingFormat, labelFormat } = intervalViews[view];
                const time = moment(col, groupingFormat);
                const columnOptions: any = {
                    setCellProps: () => ({ className: 'cell-content fault-data-cell ' }),
                    setCellHeaderProps: () => ({ className: 'cell-header fault-header-cell' }),
                };

                if (intervalViews[view]?.customHeadRender) {
                    columnOptions.customHeadRender = (columnMeta, handleToggleColumn, sortOrder) =>
                        // @ts-ignore
                        intervalViews[view]?.customHeadRender({
                            columnMeta,
                            handleToggleColumn: () => {},
                            sortOrder,
                            order: undefined,
                            className: '  ',
                            expanded,
                            width: !expanded ? intervalViews[view]?.colWidth : intervalViews[view].expandedColWidth,
                            labelFormat: intervalViews[view].labelFormat,
                            extendedLabelFormat: intervalViews[view].extendedLabelFormat,
                            threshold: intervalViews[view].threshold,
                            langCode: i18n.language,
                            handleTableLinkClick: () => {},
                        });
                }

                if (intervalViews[view]?.customBodyRender) {
                    columnOptions.customBodyRender = (value, tableMeta, updateValue) =>
                        // @ts-ignore
                        intervalViews[view]?.customBodyRender({
                            value,
                            tableMeta,
                            updateValue,
                            threshold: {
                                ...intervalViews[view]?.threshold,
                                faultCount: widgetFilters[FilterNames.reportThreshold],
                            },
                            className: 'x-cls-body-cell',
                            colGrouping,
                            onShowRecommendedAction: () => {},
                            onTableRowClick: () => {},
                            setOccurredOn: () => {},
                        });
                }

                if (intervalViews[view]?.customHeadLabelRender) {
                    columnOptions.customHeadLabelRender = (columnMeta) =>
                        // @ts-ignore
                        intervalViews[view]?.customHeadLabelRender({
                            columnMeta,
                        });
                }

                return {
                    label: time.format(labelFormat),
                    name: col,
                    options: columnOptions,
                };
            });

        const cols: Array<any> = initialColumns(screenSize)
            .slice(0, colGrouping.length)
            .map((c) => ({ ...c, label: t(messages[c.label]) }));
        const overallColumn = { ...totalColumn[0], label: t(messages[totalColumn[0].label]) };

        return [...cols, ...columns, overallColumn];
    }, [tableData, screenSize, colGrouping, t, view, expanded, i18n.language, widgetFilters]);

    const tableTheme = useMemo(() => {
        const obj = {
            root: {
                '&$disabled': {
                    color: '#ffdb38',
                },
            },
            MuiTableCell: {
                root: {
                    border: 'none',
                    backgroundColor: 'red',
                    padding: '4px',
                    font: 'normal normal normal 18px/60px Open Sans',
                },
                head: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: intervalViews?.[view]?.colWidth,
                },
                body: {
                    color: 'transparent',
                },
                footer: {
                    backgroundColor: 'red !important',
                },
            },
            MuiButton: {
                text: {
                    color: '#fff',
                },
            },
            MuiPaper: {
                root: {
                    backgroundColor: '#000',
                },
            },
            MuiSvgIcon: {
                root: {
                    color: '#fff',
                },
            },
            MUIDataTableHeadCell: {
                sortActive: {
                    color: '#fff',
                },
                contentWrapper: {
                    margin: 'auto auto',
                    width: intervalViews?.[view]?.colWidth,
                },
                fixedHeader: { padding: '0px 0px 0px 0px' },
                toolButton: { marginLeft: 'auto', marginRight: 'auto' },
            },
            MUIDataTableBodyCell: {
                stackedCommon: {
                    color: '#fff',
                    whiteSpace: expanded ? 'pre-wrap' : 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'center',
                },
            },
            MuiTableSortLabel: {
                icon: { color: '#fff' },
                iconDirectionAsc: { color: '#fff !important' },
                iconDirectionDesc: { color: '#fff !important' },
            },
        };
        return { ...obj };
    }, [view, expanded]);

    const options = {
        elavation: 4,
        enableNestedDataAccess: '.',
        sort: false,
        filter: false,
        fixedHeader: true,
        filterType: false,
        download: false,
        search: false,
        print: false,
        viewColumns: false,
        selectableRows: 'none',
        pagination: false,
        selectableRowsHeader: false,
        responsive: 'vertical',
        customToolbar: null,

        // responsive: 'scrollMaxHeight',
        // responsive: 'sstackedcroll',
        // onRowClick: handleOnRowClick,

        customTableBodyFooterRender: function (opts) {
            const cols = opts.columns.slice(2) || [];

            return (
                <TableFooter className={'x-cls-footer'}>
                    <TableRow className="x-cls-footer-row">
                        <TableCell
                            colSpan={2}
                            key={'index-00-first'}
                            className={'x-cls-footer-cell x-cls-footer-label'}
                        >
                            <Span>{t(messages.overAllResult)}</Span>
                        </TableCell>
                        {cols.map((col, i) => {
                            const value = totalFaultCounts[col.name] === 0 ? '' : totalFaultCounts[col.name];
                            return (
                                <TableCell key={`key-footer-${i}`} className={'x-cls-footer-cell'}>
                                    <Span>{value}</Span>
                                </TableCell>
                            );
                        })}
                        <TableCell key={`key-footer-00-end`} className={'x-cls-footer-cell'}></TableCell>
                    </TableRow>
                </TableFooter>
            );
        },
    };

    return (
        <Div className={`${className} x-cls-devices-fault-report-widget`}>
            <div className={` ${displayRows?.length <= 0 ? 'empty-table' : ''}`}>
                {displayRows.length > 0 && (
                    <Table
                        className={`x-cls-devices-fault-report-widget-table`}
                        data={displayRows}
                        columns={tableColumns}
                        options={options}
                        themeObj={tableTheme}
                    />
                )}
                {displayRows.length === 0 && (
                    <Div className="x-cls-loading animated-zoom">
                        {isLoading && <Loader />}
                        {!isLoading && <Div>{t(messages.noData)}</Div>}
                    </Div>
                )}
                {displayRows.length > 0 && <Div></Div>}
            </div>
        </Div>
    );
});

const Div = styled.div``;
const Span = styled.span``;

// extra widget properties
const defaultDevicesFaultReportFilters = [
    {
        name: FilterNames.station,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.deviceName,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
];

export const DevicesFaultReportProperty = Object.assign(
    {},
    {
        defaultFilters: defaultDevicesFaultReportFilters,
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

export default DevicesFaultReportWidget;

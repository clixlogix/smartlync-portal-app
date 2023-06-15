/**
 *
 * ReportingView
 * */
import React, { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
// import { DashboardFilterPanel } from 'components/panels';
import { PageProps, Page } from 'pages';

import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';

import {
    DashboardFilter,
    DateFilterData,
    FilterType,
    NumberRangeFilterData,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import Table from 'components/Table';
import moment, { Moment } from 'moment';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as _ from 'lodash';
import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
import {
    FaultCounts,
    Filters,
    FilterNames,
    // SidePanelOpenState,
    ReportingViewDateFormats,
    ReportingDataView,
    CarTypes,
    ScreenNames,
} from 'models';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { faultCountsActions, faultCountsReducer, faultCountsKey } from 'services/fault/fault-count/fault-count-reducer';
import { selectFaultCounts, selectFaultCountsIsLoading } from 'services/fault/fault-count/fault-count-selectors';
import { faultCountsSaga } from 'services/fault/fault-count/fault-count-saga';
import FilterPanel, { FilterActions } from './FilterPanel';
import { getInitialColumns } from './columns';
import { messages } from './messages';
import { Images } from 'constants/index';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import { useQueryParam, getDefaultFilterDate } from 'utils';
import Loader from 'components/Loader';
import { useFilters } from 'utils/hooks/use-filters';
import { filterByLocalFilters } from 'utils/filterByLocalFilters';
import { ReportingViewIntervalViews, initialValues, SystemType } from 'constants/staticValues';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { FilterButton } from 'components/FilterButton/FilterButton';
import gtag from 'ga-gtag';
import { Pages } from 'constants/defaultDateConfig';

import './ReportingViewB.scss';

applyPlugin(jsPDF);

const intervalViews = [];

const FAULT_COUNT_THRESHOLD = 50;

// setup common properties for each kind of view
intervalViews[ReportingDataView.Daily] = {
    label: ReportingDataView.Daily,
    labelFormat: ReportingViewIntervalViews.Daily.labelFormat,
    period: ReportingViewIntervalViews.Daily.period,
    fn: ReportingViewIntervalViews.Daily.fn,
    colWidth: ReportingViewIntervalViews.Daily.colWidth,
};
intervalViews[ReportingDataView.Weekly] = {
    label: ReportingDataView.Weekly,
    labelFormat: ReportingViewIntervalViews.Weekly.labelFormat,
    period: ReportingViewIntervalViews.Weekly.period,
    fn: ReportingViewIntervalViews.Weekly.fn,
    colWidth: ReportingViewIntervalViews.Weekly.colWidth,
};

interface ReportingViewBProps extends PageProps { }

/**
 *
 *
 * @param {Props} props
 * @returns
 */

const listOfLocalFilters = [];

export const ReportingViewB: Page<ReportingViewBProps> = memo((props: ReportingViewBProps) => {
    useInjectReducer({ key: faultCountsKey, reducer: faultCountsReducer });
    useInjectSaga({ key: faultCountsKey, saga: faultCountsSaga });

    const dispatch = useDispatch();
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const [faultCode] = useQueryParam<string>('faultCode', '');
    const [deviceName] = useQueryParam<string>('deviceName', '');
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.Reporting)), []);
    const defaultFilters: Filters = useMemo(
        () => ({
            [FilterNames.plantId]: initialValues.default.plantID,
            [FilterNames.fromTime]: START_TIME.clone()
                .subtract(initialValues.reportingViewPage.fromTimeMoment, 'days')
                .startOf('day'),
            [FilterNames.toTime]: START_TIME.clone().endOf('day'),
            [FilterNames.eventCode]: '',
            [FilterNames.studType]: undefined,
            [FilterNames.deviceName]: undefined,
            [FilterNames.faultAssignment]: initialValues.default.faultAssignment,
            [FilterNames.weekDay]: undefined,
            [FilterNames.eventType]: 'Fault',
            [FilterNames.eventTypeCode]: 0,
            [FilterNames.systemType]: SystemType.SWS,
            [FilterNames.view]: ReportingDataView.Daily,
        }),
        [],
    );

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
            [FilterNames.reportThreshold]: FAULT_COUNT_THRESHOLD,
            [FilterNames.dynamicOn]: true,
            [FilterNames.langCode]: i18n.language,
            [FilterNames.eventCode]: faultCode,
            [FilterNames.deviceName]: deviceName,
        },
        listOfLocalFilters,
    });

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const [expand] = useState<boolean>(false);
    const [reportingDataView] = useState<ReportingDataView>(ReportingDataView.Daily);
    const [colGrouping] = useState<string[]>(['event', 'description']);

    const faultCounts: FaultCounts = useSelector(selectFaultCounts);
    const faultCountsIsLoading = useSelector(selectFaultCountsIsLoading);
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };
    const faultAssignments: string[] = useMemo(
        () => [`${t(messages.maintainance)}`, `${t(messages.active)}`, `${t(messages.all)}`],
        [t],
    );

    let screenSize;
    if (useMediaQuery('(max-width:1024px)')) {
        screenSize = 'small';
    }
    if (useMediaQuery('(min-width:1024px) and (max-width:1500px)')) {
        screenSize = 'medium';
    }

    useEffect(() => {
        const { weekDayNo } = apiFilters;
        dispatch(
            faultCountsActions.faultCounts({
                eventCode: faultCode,
                ...apiFilters,
                langCode: i18n.language,
                weekDay: weekDayNo,
                ...breadCrumbsDataType,
            }),
        );
    }, [dispatch, apiFilters, i18n.language, faultCode, breadCrumbsDataType]);

    const onFilterChanged = useCallback(
        (filter: Filters) => {
            changeFilters(filter);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filters],
    );

    const dataAfterLocalFilters = useMemo(() => {
        return filterByLocalFilters(faultCounts, localFilters);
    }, [faultCounts, localFilters]);

    const compareDateVal = (interval: Moment, time: Moment, view: ReportingDataView): boolean => {
        return moment(interval)[intervalViews[view].fn]() === moment(time)[intervalViews[view].fn]();
    };

    const getColumnName = useCallback((time: Moment, view: ReportingDataView): string => {
        return moment(time).format(intervalViews[view].labelFormat);
    }, []);

    const getValue = (tableColumn: any, tData: any): any => {
        let headerArray: any = [];
        let headerWeekArray: any = [``, `${t(messages.week)}`];
        let headerYearArray: any = [``, `${t(messages.year)}`];
        let bodyArray: any = [];
        let footerArray: any = [`${t(messages.overAllResult)}`, ''];
        const cols = tData.totals.slice(2) || [];

        tableColumn.forEach((item, index) => {
            if (index > 1) {
                const weekNumber = `W${moment(item.options.time).format('W')}`;
                headerWeekArray.push(weekNumber);
                const year = `${moment(item.options.time).format('YYYY')}`;
                headerYearArray.push(year);
                if (index < tableColumn.length - 1) {
                    const date = `${moment(item.options.time).format('MMM')}\n${moment(item.options.time).format(
                        'DD',
                    )}`;
                    headerArray.push(date);
                }
            }
            if (index <= 1 || index === tableColumn.length - 1) {
                headerArray.push(item.name);
            }
        });

        tData.data.forEach((d) => {
            let bodyItem = '';
            let dataArray: any = [];
            d.forEach((item) => {
                if (item?.eventCount || item?.eventCount === 0) {
                    bodyItem = item['eventCount'] || '';
                } else {
                    bodyItem = item || '';
                }
                dataArray.push(bodyItem);
            });
            bodyArray.push(dataArray);
        });
        cols.forEach((col) => {
            footerArray.push(col);
        });

        return { headerArray, headerWeekArray, headerYearArray, bodyArray, footerArray };
    };

    const exportPDF = () => {
        const unit = 'pt';
        const size = 'A3'; // Use A1, A2, A3 or A4
        const orientation = 'landscape'; // portrait or landscape

        const doc = new jsPDF(orientation, unit, size);

        doc.addImage(Images.EluPDFLogo, 'JPEG', 1040, -10, 174, 65);

        doc.setFontSize(13);
        const title = `${t(messages.PDFTitle)}`;
        doc.text(title, 20, 20);

        doc.setFontSize(11);

        const faultAssignment = `${t(messages.faultAssignment)} : ${faultAssignments[filters.faultAssignment]}`;
        doc.text(faultAssignment, 20, 35);

        const weekDay = `${t(messages.weekDay)} : ${filters.weekDay || t(messages.all)}`;
        doc.text(weekDay, 20, 50); // previous y axis => 80

        const deviceName = `${t(messages.deviceName)} : ${filters.deviceName || t(messages.all)}`;
        doc.text(deviceName, 20, 65); // previous y axis => 95

        const studType = `${t(messages.studType)} : ${filters.studType || t(messages.all)}`;
        doc.text(studType, 20, 80); // previous y axis => 110

        const event = `${t(messages.event)} : ${filters.event}`;
        doc.text(event, 20, 95); // previous y axis => 125

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bolditalic');

        const thresholdMessage = `*${t(messages.thresholdRedMarkingNote, {
            threshold: filters.reportThreshold || FAULT_COUNT_THRESHOLD,
            period: 'day',
        }).toUpperCase()}`;
        doc.text(thresholdMessage, 20, 115);

        const {
            headerArray = [],
            headerWeekArray = [],
            headerYearArray = [],
            bodyArray = [],
            footerArray = [],
        } = getValue(tableColumns, tableData);

        const { fromTime, toTime } = filters;
        const days = moment.duration(moment(toTime).diff(moment(fromTime))).asDays();

        let content = {
            head: [headerYearArray, headerWeekArray, headerArray],
            body: bodyArray,
            foot: [footerArray],
            margin: 20,
            startY: 120,
            theme: 'grid',
            styles: { cellWidth: 'wrap' },
            columnStyles: {
                '1': { cellWidth: days > 26 ? 250 : null },
            },
            horizontalPageBreak: true,
            rowPageBreak: 'auto',
            showFoot: 'lastPage',
            overflow: 'linebreak', // overflow: 'linebreak'|'ellipsize'|'visible'|'hidden' = 'normal'
            headStyles: {
                valign: 'middle',
                halign: 'center',
                fillColor: [220, 230, 242],
                fontSize: 11,
                cellPadding: 2,
            },
            bodyStyles: { valign: 'middle', halign: 'center', fontStyle: 'bold', fontSize: 11, cellPadding: 2 },
            footStyles: {
                valign: 'middle',
                halign: 'center',
                fillColor: [220, 230, 242],
                fontSize: 11,
                cellPadding: 2,
            },
            didParseCell: function (data) {
                if (data.section === 'body' && data.column.index > 1) {
                    data.cell.styles.lineWidth = 1; // Set border line width
                    data.cell.styles.lineColor = [0, 0, 0]; // Set border color black
                    if (data.cell.raw === 0) {
                        data.cell.text = ``;
                    }
                    if (data.cell.raw > filters.reportThreshold && data.column.index < data.row.raw.length - 1) {
                        data.cell.styles.fillColor = [255, 0, 0]; // Red color fill
                        data.cell.styles.textColor = [255, 255, 255]; // White text color
                        data.cell.styles.fontSize = 12; // Set font size 1up than normal
                    } else {
                        data.cell.styles.fillColor = [177, 194, 106]; // rgb(177, 194, 106) color fill
                    }
                }
                if (data.section === 'foot' && data.column.index === 0) {
                    data.cell.colSpan = 2;
                    data.cell.styles.halign = 'right';
                }
                if (data.section === 'head' && data.row.index <= 1 && data.column.index === 1) {
                    data.cell.styles.halign = 'right';
                    data.cell.styles.cellWidth = days > 42 ? 230 : null;
                    // data.cell.styles.minCellWidth = 150;
                }
                if (
                    data.section === 'head' &&
                    data.row.index <= 1 &&
                    data.column.index > 1 &&
                    data.column.index < data.row.raw.length
                ) {
                    if (data.row.raw[data.column.index] !== data.row.raw[data.column.index - 1]) {
                        data.cell.text = `${data.cell.raw}`; // Use an icon in didDrawCell instead
                    } else {
                        data.cell.text = ``; // Use an icon in didDrawCell instead
                    }
                    data.cell.styles.cellWidth = 'wrap';
                }
                if (data.row.section === 'body' && data.column.dataKey === 1) {
                    data.cell.text = data.cell.raw.split('\n')[0]; // Use an icon in didDrawCell instead
                    data.cell.styles.halign = 'left';
                }
            },
            willDrawCell: function (data) {
                if (data.section === 'head' || data.section === 'foot') {
                    doc.setTextColor(0, 0, 0); // Black
                }
            },
        };

        // @ts-ignore
        doc.autoTable(content);
        doc.save(`${t(messages.PDFFileName)}.pdf`);
        gtag('event', 'Report_Download', {
            page_location: '/reportingViewB',
            reprtB_download: 'true',
        });
    };

    const onFilterAction = (action: FilterActions) => {
        switch (action) {
            case FilterActions.FileUpload:
                history.push({ pathname: '/upload' });
                break;
            case FilterActions.ExportExcel:
            case FilterActions.ExportToPDF:
                exportPDF();
                break;
            default:
                break;
        }
    };

    const dateRange: any = {
        startDate: filters.fromTime,
        endDate: filters.toTime,
    };
    const startDatePlaceholder = moment(dateRange.startDate).format(initialValues.default.dateFormat);
    const endDatePlaceholder = moment(dateRange.endDate).format(initialValues.default.dateFormat);
    const crumbs: BreadcrumbLinks = useMemo(() => {
        const retVal = [
            {
                name: ScreenNames.home,
                label: t('ScreenName.Home'),
                href: '/home',
            },
            {
                name: ScreenNames.reportingViewB,
                label: t('ScreenName.ReportingViewB'),
            },
            {
                name: FilterNames.dateRange,
                label: `DATE RANGE : ${moment(filters.fromTime).format('YYYY-MM-DD')} - ${moment(filters.toTime).format(
                    'YYYY-MM-DD',
                )}`,
            },
        ];

        if (filters?.[FilterNames.deviceName]) {
            retVal.push(filters[FilterNames.deviceName]);
        }
        return retVal;
    }, [filters, t]);

    const onBreadcrumbChange = (crumb: string | Filters) => {
        if (typeof crumb === 'string') {
            // a link was selected to route to page
            return;
        }

        if (crumb[FilterNames.carTypeId]) {
            const carId = carTypes.find(({ name }) => name === crumb[FilterNames.carTypeId])?.id;

            if (carId) {
                crumb[FilterNames.carTypeId] = carId;
            }
        }

        // a filter was selected so update filters
        onFilterChanged({ ...(crumb as Filters) });
    };

    const intervalRange: {
        start: number;
        range: number;
        intervals: Array<Moment>;
        minFaultCount: number;
        maxFaultCount: number;
    } = useMemo(() => {
        if (dataAfterLocalFilters === undefined) {
            return {
                start: 0,
                range: 0,
                intervals: [],
                maxFaultCount: 0,
                minFaultCount: 0,
            };
        }

        const faultCountsRange = dataAfterLocalFilters.reduce(
            (acc, row) => {
                // TODO: get API to not return invalid dates !!!
                // @ts-ignore
                const time = moment(row.time);

                acc.startInterval = time.isSameOrBefore(acc.startInterval) ? time : acc.startInterval;
                acc.endInterval = time.isSameOrAfter(acc.endInterval) ? time : acc.endInterval;
                acc.minFaultCount = Math.min(acc.minFaultCount, row.eventCount);
                acc.maxFaultCount = Math.max(acc.maxFaultCount, row.eventCount);

                return acc;
            },
            {
                minFaultCount: 0,
                maxFaultCount: 0,
                startInterval: moment(filters.fromTime),
                endInterval: moment(filters.toTime),
            },
        );

        const start = faultCountsRange.startInterval[intervalViews[reportingDataView].fn]();

        const intervals: Moment[] = [];

        // get weeks
        const currInterval = moment(faultCountsRange?.startInterval);

        // adding three(3) extra period onto intervals for future dates/information
        const endInterval = moment(faultCountsRange?.endInterval);

        let cnt = 0;
        do {
            intervals.push(moment(currInterval));
            currInterval.add(1, intervalViews[reportingDataView].period); // 'week');
            cnt++;
        } while (
            // !currInterval.isSameOrAfter(endInterval) &&
            !currInterval.isAfter(endInterval) &&
            (reportingDataView === ReportingDataView.Daily ? cnt < 366 : cnt < 52)
        );

        const { minFaultCount = 0, maxFaultCount = 0 } = faultCountsRange;
        return { start, range: cnt, intervals, minFaultCount, maxFaultCount };
    }, [dataAfterLocalFilters, reportingDataView, filters]);

    // NOTE: This is the aggregation
    //       function that will group the data according to
    //       reportingDataView such as ReportingDataView.weekly which will group
    //       the rows based on the week of the year.
    //
    const tableData: { data: any[][]; totals: number[] } = useMemo(() => {
        const output: { data: any[][]; totals: number[] } = {
            data: [],
            totals: new Array(colGrouping.length + intervalRange.intervals.length).fill(0),
        };
        const groupingFormat = ReportingViewDateFormats[reportingDataView];

        const firstPass: any[] = _.groupBy(dataAfterLocalFilters, (row) => {
            return colGrouping.map((g) => row[g]).join(',');
        });

        const rows: any[][] = Object.values(firstPass);

        output.data = rows.map((row, i) => {
            const b = _.groupBy(row, (rowData) => {
                const dte = moment(rowData.time).format(groupingFormat).toString();
                let key = [...colGrouping.map((g) => rowData[g]), dte].join(',');

                return key;
            });
            const rowsData: any = Object.values(b);

            const z = rowsData.map((row) =>
                row.reduce((a, b) => ({
                    ...b,
                    eventCount: typeof a.eventCount === 'string' ? parseInt(a.eventCount) : a.eventCount,
                    // cycleCount: a.cycleCount + b.cycleCount,
                })),
            );
            let { event, description, extendedDescription } = z[0];
            let overAllRowSum = 0;

            if (extendedDescription) {
                description += `\n${extendedDescription}`;
            }

            const finalData = [event, description];

            intervalRange.intervals.forEach((week: Moment, index: number) => {
                const foundIt = z.find((d) => compareDateVal(week, d.time, reportingDataView));
                const { eventCount = 0 } = foundIt || ({} as any);
                const faultCountAmount = typeof eventCount === 'string' ? parseInt(eventCount) : eventCount;
                finalData.push({ eventCount: faultCountAmount });
                output.totals[colGrouping.length + index] += faultCountAmount;
                overAllRowSum += faultCountAmount;
            });

            finalData.push(overAllRowSum);

            return finalData;
        });
        return output;
    }, [intervalRange, dataAfterLocalFilters, colGrouping, reportingDataView]);

    const tableColumns = useMemo(() => {
        const cols: Array<any> = getInitialColumns(screenSize)
            .slice(0, 2)
            .map((c) => ({ ...c, name: t(messages[c.name]) }));

        const dataCellCol = {
            options: {
                filter: false,
                sortThirdClickReset: true,
                setCellProps: (value) => {
                    return {
                        className: `data-cell ${value > filters.reportThreshold ? 'selected' : 'past-data'}`,
                    };
                },
                setCellHeaderProps: () => ({
                    className: 'data-cell-header past-data',
                }),
                customSort: (data, colIndex, order, meta) => {
                    return data.sort((a, b) => {
                        return (
                            (parseInt(a.data[colIndex].eventCount) < parseInt(b.data[colIndex].eventCount) ? -1 : 1) *
                            (order === 'desc' ? 1 : -1)
                        );
                    });
                },
            },
        };
        const dataColumnsOptions = {
            customBodyRender: (value, _tableMeta, _updateValue) => {
                const { eventCount = '' } = value || {
                    eventCount: '',
                };

                return eventCount === 0 ? '' : eventCount;
            },
        };

        intervalRange.intervals.forEach((time: Moment, index: number) => {
            let colData = dataCellCol;

            cols.push({
                name: getColumnName(time, reportingDataView),
                ...{ ...colData, options: { ...colData.options, ...dataColumnsOptions, time } },
            });
        });

        // TODO: verify with product if it looks better with the data column have fixed sizes
        //       this will provide an empty column to the right of the table columns
        //       this can be removed to get theappearance of all the columns filling available space but
        //       with variable column width.
        cols.push({
            name: t(messages.overAllResult),
            label: t(messages.overAllResult),
            options: {
                filter: false,
                display: true,
                sort: true,
                sortThirdClickReset: true,
                setCellProps: () => ({
                    className: 'cell-content fault-code-totals',
                    style: {
                        position: 'sticky',
                        backgroundColor: '#182129',
                        color: '#FFF',
                        width: '140px',
                        minWidth: '140px',
                        maxWidth: '140px',
                        right: 0,
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap',
                        outline: '1.0px solid #525252',
                    },
                }),
                setCellHeaderProps: () => ({
                    className: 'cell-header fault-code-totals',
                    style: {
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        position: 'sticky',
                        right: 0,
                        background: 'white',
                        zIndex: 101,
                        backgroundColor: '#182129',
                        outline: '1.0px solid #525252',
                    },
                }),
            },
        });

        return cols;
    }, [screenSize, intervalRange.intervals, t, filters.reportThreshold, getColumnName, reportingDataView]);

    const options: any = useMemo(() => {
        const height = 500;
        let params: any = {
            pagination: false,
            tableBodyHeight: `${height - 15}px`,
        };

        if (tableData.data?.length > 75) {
            params = {
                jumpToPage: true,
                pagination: true,
                rowsPerPage: 75,
                rowsPerPageOptions: [75, 100, 200],
                tableBodyHeight: `${height - 75}px`, // TODO: this should be set automatically based on the titlebar, filterpanel and oolbar-section height
            };
        }

        return {
            filter: false,
            sort: true,
            pagination: false,
            fixedHeader: true,
            elevation: 5,
            selectableRowsHeader: false,
            responsive: 'vertical',
            search: false,
            download: false,
            print: false,
            viewColumns: false,
            customToolbar: null,
            selectableRows: 'none',
            enableNestedDataAccess: '.',
            sortThirdClickReset: true,
            confirmFilters: true,
            customSort: (data, colIndex, order, meta) => {
                return data.sort((a, b) => {
                    if (colIndex > 0 && colIndex !== a.data.length - 1) {
                        return (
                            (a.data[colIndex].eventCount < b.data[colIndex].eventCount ? -1 : 1) *
                            (order === 'asc' ? 1 : -1)
                        );
                    } else if (colIndex > 0 && colIndex === a.data.length - 1) {
                        return (
                            (a.data[a.data.length - 1] < b.data[b.data.length - 1] ? -1 : 1) *
                            (order === 'asc' ? 1 : -1)
                        );
                    } else {
                        return (a.data[colIndex] < b.data[colIndex] ? -1 : 1) * (order === 'asc' ? 1 : -1);
                    }
                });
            },
            onDownload: (buildHead, buildBody, columns, data) => {
                return '\uFEFF' + buildHead(columns) + buildBody(data);
            },

            customTableBodyFooterRender: function (opts) {
                const cols = tableData.totals.slice(2) || [];

                return (
                    <TableFooter className={'x-cls-footer'}>
                        <TableRow className="x-cls-footer-">
                            <TableCell
                                colSpan={2}
                                key={'index-00-first'}
                                className={'x-cls-footer-cell x-cls-footer-label'}
                            >
                                <span>{t(messages.overAllResult)}</span>
                            </TableCell>
                            {cols.map((col, i) => (
                                <TableCell key={`key-footer-${i}`} className={'x-cls-footer-cell'}>
                                    <span>{col || 0}</span>
                                </TableCell>
                            ))}
                            <TableCell key={`key-footer-00-end`} className={'x-cls-footer-cell'}></TableCell>
                        </TableRow>
                    </TableFooter>
                );
            },
            ...params,
        };
    }, [t, tableData]);

    // extra widget properties
    const availableFilters: DashboardFilter[] = [
        {
            name: FilterNames.reportThreshold,
            type: FilterType.NumberRange,
            data: {
                value: FAULT_COUNT_THRESHOLD,
                min: intervalRange.minFaultCount,
                max: intervalRange.maxFaultCount,
                // [FilterNames.dynamicOn]: false,
            } as NumberRangeFilterData,
        },
        { name: FilterNames.studType, type: FilterType.Select, data: { options: [] } as SelectFilterData },
        { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
        {
            name: FilterNames.dateRange,
            type: FilterType.Date,
            data: {
                fromTime: filters.fromTime,
                toTime: filters.toTime,
                startDatePlaceholder,
                endDatePlaceholder,
            } as DateFilterData, // set default value here
        },
        { name: FilterNames.faultCode, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    ];

    const { dynamicOn } = filters;
    const tableBodyHeight = window.innerHeight - 350;
    return (
        <Div className="report-B">
            <Div style={{ height: '100%' }} className={' stanleyCol'}>
                <Helmet>
                    <title>{t(messages.pageTitle)}</title>
                    <meta name="description" content={t(messages.pageTitle)} />
                </Helmet>

                {availableFilters.length > 0 && (
                    <DashboardFilterPanel
                        filters={{ ...filters }}
                        availableFilters={availableFilters}
                        defaultFilters={defaultFilters}
                        open={filterPanelOpen}
                        setOpen={() => setFilterPanelOpen(false)}
                        onFilterChange={onFilterChanged}
                    />
                )}

                <Div className={`page-body-reporting-b stanleyCol `}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexDirection: 'row-reverse',
                            marginTop: '10px',
                        }}
                    >
                        {/* <Div className={'x-cls-title'}></Div> */}
                        {availableFilters.length > 0 && (
                            <FilterButton isEdit={false} hanldeFilterPanelOpen={setFilterPanelOpen} />
                        )}
                        <Breadcrumb
                            availableFilters={availableFilters}
                            filters={filters}
                            crumbs={crumbs}
                            onClick={onBreadcrumbChange}
                        />
                    </div>
                    <Div className="page-filter-B">
                        <FilterPanel
                            className={'x-cls-page-filter'}
                            onChange={onFilterChanged}
                            filters={filters}
                            onFilterAction={onFilterAction}
                        />
                    </Div>
                    <Div className="toolbar-section">
                        <Div className="left-section">
                            <span className={'thresholdLabel'}>{t(messages.thresholdLabel)}</span>
                            {!dynamicOn && (
                                <Div className="x-cls-view-nav">
                                    <span className="nav-value" title="Threshold filter">
                                        : &nbsp; {'  over '}{' '}
                                        {t(messages.thresholdRedMarkingNote, {
                                            threshold: filters.reportThreshold || 50,
                                            period: 'day',
                                        })}
                                    </span>
                                </Div>
                            )}
                        </Div>
                    </Div>
                    <Div className={`stanleyCol page-wrapper ${tableData.data.length > 0 ? '' : 'empty-table'}`}>
                        {tableData.data?.length > 0 && (
                            <Table
                                className={'x-cls-reporting-data'}
                                data={tableData.data}
                                columns={tableColumns}
                                options={options}
                                tableBodyHeight={tableBodyHeight}
                            />
                        )}
                        {tableData.data.length === 0 && (
                            <Div className={'x-cls-loading animated-zoom '}>
                                {faultCountsIsLoading && <Loader />}
                                {!faultCountsIsLoading && <Div>{t(messages.noData)}</Div>}
                            </Div>
                        )}
                    </Div>
                </Div>
            </Div>
        </Div>
    );
});

const Div = styled.div``;

export default ReportingViewB;

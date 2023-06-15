/**
 *
 * ReportingView
 * */
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import Loader from 'components/Loader';
import {
    DashboardFilter,
    DateFilterData,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import Table from 'components/Table';
import { Images } from 'constants/index';
import { initialValues, RCAIntervalViews, SystemType } from 'constants/staticValues';
import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
import * as _ from 'lodash';
import {
    CarTypes,
    FaultRates,
    FilterNames,
    Filters,
    IntervalViewData,
    ReportingDataView,
    ReportingDataViewType,
    ScreenNames,
} from 'models';
import moment, { Moment } from 'moment';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { faultRatesActions, faultRatesKey, faultRatesReducer } from 'services/fault/fault-rate/fault-rate-reducer';
import { faultRatesSaga } from 'services/fault/fault-rate/fault-rate-saga';
import {
    selectFaultRates,
    selectFaultRatesFilterValues,
    selectFaultRatesIsLoading,
} from 'services/fault/fault-rate/fault-rate-selectors';
import { getNumber, getDefaultFilterDate, useQueryParam } from 'utils';
import { filterByLocalFilters } from 'utils/filterByLocalFilters';
import { useFilters } from 'utils/hooks/use-filters';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { ParentLabel } from '.';
import { getInitialColumns } from './columns';
import { TableBody as DailyTableBody, TableHeader as DailyTableHeader } from './components/daily';
import { TableBody as HouryTableBody, TableHeader as HourlyTableHeader } from './components/hourly';
import {
    TableBody as WeeklyTableBody,
    TableHeader as WeeklyTableHead,
    TableHeader as WeeklyTableHeader,
    TableHeadLabel as WeeklyTableHeadLabel,
} from './components/weekly';
import FilterPanel, { FilterActions } from './FilterPanel';
import { messages } from './messages';
import SliderPanel from './SliderPanel';
import Stack from '@mui/material/Stack';
import { Pages } from 'constants/defaultDateConfig';

import { FilterButton } from 'components/FilterButton/FilterButton';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { useTheme } from '@mui/material/styles';
import './ReportingView.scss';

applyPlugin(jsPDF);

const intervalViews: IntervalViewData[] = [];

export enum ReportingCellView {
    FaultRate = 'FaultRate',
    FaultCount = 'FaultCount',
    Expanded = 'Expanded',
}

// setup common properties for each kind of view
intervalViews[ReportingDataView.Hourly] = {
    label: RCAIntervalViews.hourly.hourly,
    labelFormat: RCAIntervalViews.hourly.labelFormat,
    extendedLabelFormat: RCAIntervalViews.hourly.extendedLabelFormat,
    period: RCAIntervalViews.hourly.period,
    fn: RCAIntervalViews.hourly.fn,
    colWidth: RCAIntervalViews.hourly.colWidth,
    expandedColWidth: RCAIntervalViews.hourly.expandedColWidth,
    groupingFormat: RCAIntervalViews.hourly.groupingFormat,

    threshold: RCAIntervalViews.hourly.threshold,
    customBodyRender: HouryTableBody,
    customHeadRender: HourlyTableHeader,
};
intervalViews[ReportingDataView.Daily] = {
    label: RCAIntervalViews.Daily.daily,
    labelFormat: RCAIntervalViews.Daily.labelFormat,
    extendedLabelFormat: RCAIntervalViews.Daily.extendedLabelFormat,
    period: RCAIntervalViews.Daily.period,
    fn: RCAIntervalViews.Daily.fn,
    colWidth: RCAIntervalViews.Daily.colWidth,
    expandedColWidth: RCAIntervalViews.Daily.expandedColWidth,
    groupingFormat: RCAIntervalViews.Daily.groupingFormat,
    threshold: RCAIntervalViews.Daily.threshold,
    customBodyRender: DailyTableBody,
    customHeadRender: DailyTableHeader,
};
intervalViews[ReportingDataView.Weekly] = {
    label: RCAIntervalViews.Weekly.weekly,
    labelFormat: RCAIntervalViews.Weekly.labelFormat,
    period: RCAIntervalViews.Weekly.period,
    fn: RCAIntervalViews.Weekly.fn,
    colWidth: RCAIntervalViews.Weekly.colWidth,
    expandedColWidth: RCAIntervalViews.Weekly.expandedColWidth,
    groupingFormat: RCAIntervalViews.Weekly.groupingFormat,
    threshold: RCAIntervalViews.Weekly.threshold,
    customTableHeader: WeeklyTableHeader,
    customBodyRender: WeeklyTableBody,
    customHeadLabelRender: WeeklyTableHeadLabel,
    customHeadRender: WeeklyTableHead,
    sortCompare: true,
};
const resetFilters: Filters = {
    faultCode: initialValues.rcaPage.faultCode,
    studType: undefined,
    deviceName: undefined,
    // studId: undefined,
};

const listOfLocalFilters = [];

interface Props { }

/**
 *
 *
 * @param {Props} props
 * @returns
 */
export const ReportingView = memo((props: Props) => {
    useInjectReducer({ key: faultRatesKey, reducer: faultRatesReducer });
    useInjectSaga({ key: faultRatesKey, saga: faultRatesSaga });

    const dispatch = useDispatch();
    const history = useHistory();

    /* TODO: We need this in future */

    const { t, i18n } = useTranslation();

    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.FailureModeAnalysis)), []);

    const defaultFilters = useMemo(
        () => ({
            [FilterNames.fromTime]: START_TIME.clone()
                .subtract(initialValues.rcaPage.fromTimeMoment, 'isoWeek')
                .startOf('isoWeek'),
            [FilterNames.toTime]: START_TIME.clone()
                .add(initialValues.rcaPage.toTimeMoment, 'isoWeek')
                .endOf('isoWeek'),
            [FilterNames.eventCode]: '',
            [FilterNames.studType]: undefined,
            [FilterNames.deviceName]: undefined,
            [FilterNames.studId]: undefined,
            [FilterNames.view]: ReportingDataView.Weekly,
            [FilterNames.plantId]: initialValues.default.plantID,
            [FilterNames.grouping]: 'studType,deviceName',
            [FilterNames.systemType]: SystemType.SWS,
            [FilterNames.deviceLine]: '',
            [FilterNames.deviceSubLine]: 0,
            [FilterNames.carbodyId]: '0',
        }),
        [START_TIME],
    );

    const [studType] = useQueryParam<string>('studType', defaultFilters.studType || '');
    const [deviceName] = useQueryParam<string>('deviceName', defaultFilters.deviceName || '');
    // const [plantId] = useQueryParam<string>('plantId', defaultFilters.plantId);
    const { plantId } = useSelector(selectBreadcrumbFilters);
    const [faultCode] = useQueryParam<string>('faultCode', defaultFilters.eventCode);
    // TODO: NO-OP, can be removed
    const [activeAction, setActiveAction] = useState<FilterActions>(FilterActions.None);
    const [reportingDataView, setReportingDataView] = useState<ReportingDataView>(defaultFilters.view);
    // TODO: NO-OP, add when required.
    const [reportingDataViewType, setReportingDataViewType] = useState<ReportingDataViewType>(
        ReportingDataViewType.Table,
    );
    const [colGrouping /* setColGrouping */] = useState<string[]>(defaultFilters.grouping.split(','));
    const [showRecommendedActionsPopUp, setShowRecommendedActionsPopUp] = useState(false);
    const [cellSelected, setCellSelected] = useState({});
    const [occurredOn, setOccurredOn] = useState('');
    const [correctionWidth, setCorrectionWidth] = useState('405px');
    const [showFaultRate, setFautRateVisibility] = useState(true);
    const [isPercentage, setPercentage] = useState(true);
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    // const eventTypes = useMemo(() => {
    //     return [
    //         t('Filters.Fault'),
    //         t('Filters.Warning'),
    //         t('Filters.Componentexchange'),
    //         t('Filters.FirmwareUpdate'),
    //         t('Filters.Info'),
    //         t('Filters.Maintenance'),
    //     ];
    // }, [t]);

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
            [FilterNames.plantId]: plantId,
            [FilterNames.systemType]: SystemType.SWS,
            [FilterNames.eventType]: 'Fault',
            [FilterNames.eventTypeCode]: 0,
            [FilterNames.eventCode]: faultCode ? faultCode : '',
            [FilterNames.studType]: studType || '',
            [FilterNames.deviceName]: deviceName || '',
        },
        listOfLocalFilters,
    });

    const filters = useMemo(() => {
        return {
            ...apiFilters,
            ...localFilters,
            ...breadCrumbsDataType,
        };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const faultRates: FaultRates = useSelector(selectFaultRates);
    const filterValues = useSelector(selectFaultRatesFilterValues);
    const faultRatesIsLoading = useSelector(selectFaultRatesIsLoading);
    const [expandAll] = useState<boolean>(false);
    const [sortColumn, setSortColumn] = useState<string>();
    const [order, setOrder] = useState<string>();
    const [weeklyExpandAll, setWeeklyExpandAll] = useState<boolean>(false);
    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);

    const dataAfterLocalFilters = useMemo(() => {
        return filterByLocalFilters(faultRates, localFilters);
    }, [faultRates, localFilters]);

    let screenSize;
    if (useMediaQuery('(max-width:1200px)')) {
        screenSize = 'small';
    }

    useEffect(() => {
        dispatch(
            faultRatesActions.faultRates({
                ...apiFilters,
                ...breadCrumbsDataType,
            }),
        );
        setShowRecommendedActionsPopUp(false);
    }, [dispatch, apiFilters, t, breadCrumbsDataType]);

    const onFilterChanged = useCallback(
        (filter: any) => {
            changeFilters(filter);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filters],
    );

    const compareDateVal = (interval: Moment, time: Moment, view: ReportingDataView): boolean => {
        if (view === ReportingDataView.Hourly) {
            return moment(time).isSame(interval);
        }
        return (
            interval[intervalViews[view].fn]() === moment(time)[intervalViews[view].fn]() &&
            interval.year() === moment(time).year()
        );
    };

    const handleTableLinkClick = useCallback(
        (event, label, view: ReportingDataView, name?, time?: Moment | string | Moment) => {
            let { fromTime, toTime } = filters;

            switch (view) {
                case ReportingDataView.Weekly:
                    // set week range for this year;
                    fromTime = START_TIME.clone()
                        .subtract(initialValues.rcaPage.fromTimeMoment, 'isoWeek')
                        .startOf('isoWeek');
                    toTime = START_TIME.clone().add(initialValues.rcaPage.toTimeMoment, 'isoWeek');
                    setCorrectionWidth('405px');
                    onFilterChanged({ fromTime, toTime, view: ReportingDataView.Weekly, disabled: false });
                    setReportingDataView(ReportingDataView.Weekly);
                    break;
                case ReportingDataView.Daily:
                    // set day range for this week;
                    fromTime = moment(time).isoWeekYear(label).isoWeek(parseInt(name)).startOf('isoWeek');
                    toTime = moment().isoWeekYear(label).isoWeek(parseInt(name)).endOf('isoWeek');
                    onFilterChanged({ fromTime, toTime, view: ReportingDataView.Daily, disabled: false });
                    if (moment(fromTime).week() >= moment().week()) {
                        setCorrectionWidth('350px');
                    }
                    if (moment(fromTime).week() < moment().week()) {
                        setCorrectionWidth('405px');
                    }
                    setReportingDataView(ReportingDataView.Daily);
                    break;
                case ReportingDataView.Hourly:
                    // set day range for this week;
                    fromTime = moment(time).startOf('day');
                    toTime = moment(time).endOf('day');
                    onFilterChanged({ fromTime, toTime, view: ReportingDataView.Hourly, disabled: false });
                    setReportingDataView(ReportingDataView.Hourly);
                    break;
                default:
                    break;
            }

            return event ? event.stopPropagation() : '';
        },
        [filters, START_TIME, onFilterChanged],
    );

    const onFilterAction = (action: FilterActions) => {
        switch (action) {
            case FilterActions.ClearFilters:
                changeFilters({ ...filters, ...resetFilters });
                setShowRecommendedActionsPopUp(false);
                break;
            case FilterActions.FileUpload:
                history.push({ pathname: '/upload' });
                break;
            case FilterActions.ExportExcel:
            case FilterActions.ExportToPDF:
                exportPDF();
                break;
            default:
                setActiveAction(FilterActions.None);
        }
        // setActiveAction(action);
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

        const faultAssignment = `${t(messages.faultCode)} : ${apiFilters.eventCode || ''}`;
        doc.text(faultAssignment, 20, 40);

        const {
            headerArray = [],
            headerWeekArray = [],
            headerYearArray = [],
            bodyArray = [],
            footerArray = [],
        } = getValue(tableColumns, tableData, showFaultRate);

        // const { fromTime, toTime } = filters;
        // const days = moment.duration(moment(toTime).diff(moment(fromTime))).asDays();
        const threshold = showFaultRate
            ? intervalViews[reportingDataView].threshold?.ratio
            : intervalViews[reportingDataView].threshold?.faultCount;

        let content = {
            head: [headerYearArray, headerWeekArray, headerArray],
            body: bodyArray,
            foot: showFaultRate ? null : [footerArray],
            margin: 20,
            startY: 50,
            theme: 'grid',
            styles: { cellWidth: 'wrap' },
            // columnStyles: {
            //     '1': { cellWidth: days > 42 ? null : null },
            // },
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
                    if (data.cell.raw > threshold && data.column.index < data.row.raw.length - 1) {
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
                    // data.cell.styles.cellWidth = days > 42 ? 230 : null;
                    // data.cell.styles.minCellWidth = 150;
                }
                if (
                    data.section === 'head' &&
                    data.row.index <= 1 &&
                    data.column.index > 1 &&
                    data.column.index < data.row.raw.length
                ) {
                    if (data.row.raw[data.column.index] !== data.row.raw[data.column.index - 1] && data.column.index) {
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
    };

    const getValue = (tableColumn: any, tData: any, showFaultRate: boolean): any => {
        let headerArray: any = [];
        let headerWeekArray: any = [``, `${t(messages.week)}`];
        let headerYearArray: any = [``, `${t(messages.year)}`];
        let bodyArray: any = [];
        let footerArray: any = [`${t(messages.faultCountSum)}`, ''];
        const cols = tData.totals.slice(2) || [];

        tableColumn.forEach((item, index) => {
            if (index > 1) {
                const weekNumber = `${RCAIntervalViews.Weekly.labelFormat}${moment(item.options.time).format(
                    RCAIntervalViews.Weekly.labelFormat,
                )}`;
                const colLength = showFaultRate ? tableColumn.length : tableColumn.length - 1;
                headerWeekArray.push(index < colLength ? weekNumber : '');
                const year = `${moment(item.options.time).format(RCAIntervalViews.Yearly.groupBy)}`;
                headerYearArray.push(year);
                if (index < colLength) {
                    let date = '';
                    if (reportingDataView === ReportingDataView.Weekly) {
                        date = `${moment(item.options.time).format(RCAIntervalViews.Monthly.formatGeneral)}\n${moment(
                            item.options.time,
                        ).format(RCAIntervalViews.Daily.formatGeneral)}`;
                    }
                    if (reportingDataView === ReportingDataView.Daily) {
                        date = `${moment(item.options.time).format(RCAIntervalViews.Daily.labelFormat)}\n${moment(
                            item.options.time,
                        ).format(RCAIntervalViews.Daily.extendedLabelFormat)}`;
                    }
                    if (reportingDataView === ReportingDataView.Hourly) {
                        date = `${moment(item.options.time).format('HH:mm')}`;
                    }
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
                if (item?.eventCount || item?.ratio || item?.eventCount === 0 || item?.ratio === 0 || item?.duration) {
                    bodyItem = showFaultRate ? `${getNumber(item?.ratio)}` : `${getNumber(item?.eventCount)}`;
                } else {
                    bodyItem = item || '';
                }
                dataArray.push(bodyItem);
            });
            bodyArray.push(dataArray);
        });
        cols.forEach((col) => {
            footerArray.push(col === 0 ? '' : getNumber(col));
        });

        return { headerArray, headerWeekArray, headerYearArray, bodyArray, footerArray };
    };

    // const theme = useMemo(() => {
    //     const widthCalculator = () => {
    //         switch (reportingDataView) {
    //             case ReportingDataView.Daily:
    //                 return !expandAll
    //                     ? intervalViews[reportingDataView].colWidth
    //                     : intervalViews[reportingDataView].expandedColWidth;
    //             case ReportingDataView.Weekly:
    //                 return !weeklyExpandAll
    //                     ? intervalViews[reportingDataView].colWidth
    //                     : intervalViews[reportingDataView].expandedColWidth;
    //             default:
    //                 return intervalViews[reportingDataView].colWidth;
    //         }
    //     };
    //     const obj = {
    //         root: {
    //             '&$disabled': {
    //                 color: '#ffdb38',
    //             },
    //         },
    //         MuiTableCell: {
    //             root: {
    //                 border: '1.0px solid #525252',
    //                 backgroundColor: '#000',
    //                 padding: '10px',
    //                 width: 'initial',
    //             },
    //             head: {
    //                 color: 'white',
    //                 width: widthCalculator(),
    //             },
    //             body: {
    //                 color: 'transparent',
    //             },
    //             footer: { backgroundColor: '#182129' },
    //         },
    //         MuiButton: {
    //             text: {
    //                 color: '#fff',
    //             },
    //         },
    //         MuiPaper: {
    //             root: {
    //                 backgroundColor: '#000',
    //                 color: '#fff',
    //             },
    //         },
    //         MuiList: {
    //             root: {
    //                 color: '#fff',
    //             },
    //         },
    //         MuiMenu: {
    //             list: {
    //                 color: '#fff',
    //             },
    //         },
    //         MuiSvgIcon: {
    //             colorPrimary: {
    //                 color: '#000',
    //             },
    //             root: {
    //                 color: '#fff',
    //             },
    //         },

    //         MUIDataTableHeadCell: {
    //             sortActive: {
    //                 color: '#fff',
    //             },
    //             contentWrapper: {
    //                 margin: 'auto auto',
    //                 width: widthCalculator(),
    //             },
    //             fixedHeader: { textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
    //             toolButton: { marginLeft: 'auto', marginRight: 'auto' },
    //         },
    //         MUIDataTableBodyCell: {
    //             stackedCommon: {
    //                 color: '#fff',
    //             },
    //         },
    //         MuiTableSortLabel: {
    //             icon: { color: '#fff' },
    //             iconDirectionAsc: { color: '#fff !important', marginLeft: -8, marginRight: 0 },
    //             iconDirectionDesc: { color: '#fff !important', marginLeft: -8, marginRight: 0 },
    //         },
    //         MUIDataTable: {
    //             responsiveBase: { backgroundColor: '#000' },
    //             caption: {
    //                 position: 'initial',
    //                 width: '98%',
    //                 backgroundColor: '#ccc',
    //             },
    //         },
    //     };
    //     return createMuiTheme(
    //         adaptV4Theme({
    //             overrides: { ...obj },
    //         }),
    //     );
    // }, [reportingDataView, expandAll, weeklyExpandAll]);

    const intervalRange: {
        start: number;
        range: number;
        intervals: Array<Moment>;
        startInterval: Moment;
        endInterval: Moment;
    } = useMemo(() => {
        if (dataAfterLocalFilters === undefined) {
            return {
                start: 0,
                range: 0,
                intervals: [],
                startInterval: moment(),
                endInterval: moment(),
            };
        }
        const currentTime = moment();

        const faultRatesRange = dataAfterLocalFilters.reduce(
            (acc, row) => {
                // TODO: get API to not return invalid dates !!!
                // @ts-ignore
                const time = moment(row.time);

                acc.startInterval = time.isSameOrBefore(acc.startInterval) ? time : acc.startInterval;
                acc.endInterval = time.isSameOrAfter(acc.endInterval) ? time : acc.endInterval;

                return acc;
            },
            { startInterval: currentTime, endInterval: currentTime },
        );

        const start = faultRatesRange?.startInterval[intervalViews[reportingDataView].fn]();

        const intervals: Moment[] = [];

        const currInterval = moment(filters.fromTime);
        const endInterval =
            reportingDataView === ReportingDataView.Weekly
                ? moment(filters.toTime).add(3, 'week')
                : moment(filters.toTime);

        let cnt = 0;
        do {
            intervals.push(moment(currInterval));
            currInterval.add(1, intervalViews[reportingDataView].period); // 'week');
            cnt++;
        } while (!currInterval.isSameOrAfter(endInterval) && cnt < 52);

        return { start, range: cnt, intervals, ...faultRatesRange };
    }, [dataAfterLocalFilters, reportingDataView, filters.fromTime, filters.toTime]);

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
        const groupingFormat = intervalViews[reportingDataView].groupingFormat;
        const faultCountTotal = new Array(colGrouping.length + intervalRange.intervals.length).fill(0);
        const cycleCountTotal = new Array(colGrouping.length + intervalRange.intervals.length).fill(0);
        const faultRatioTotal = new Array(colGrouping.length + intervalRange.intervals.length).fill(0);

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

            const z = rowsData.map((row: any) =>
                row.reduce((a, b) => ({
                    ...b,
                    eventCount: +a.eventCount + +b.eventCount,
                    cycleCount: +a.cycleCount + +b.cycleCount,
                    wipCount: +a?.wipCount + +b?.wipCount,
                    wopCount: +a?.wopCount + +b?.wopCount,
                    duration: +a?.duration + +b?.duration,
                })),
            );

            const { studType, deviceName /*, studId*/ } = z[0];
            let finalData = [studType, deviceName /*, studId*/]; // Commenting studId
            let faultCountRowSum = 0;
            let cycleCountRowSum = 0;

            intervalRange.intervals.forEach((week: Moment, index: number) => {
                const foundIt = z.find((d) => compareDateVal(week, d.time, reportingDataView));
                let { eventCount = 0, cycleCount = 0, wipCount = 0, wopCount = 0, eventRatio, wopRatio, duration = 0 } =
                    foundIt || ({} as any);
                eventCount = getNumber(+eventCount);
                cycleCount = getNumber(+cycleCount);
                wipCount = getNumber(+wipCount);
                wopCount = getNumber(+wopCount);
                duration = getNumber(+duration);

                let ratio = 0;
                let wipWopRatio = 0;
                if (!!foundIt) {
                    // Conditions to check if eventRatio and wopRatio are there or not which
                    // is provided by sigmoid API. If not calculate the values.
                    if (!eventRatio || !wopRatio) {
                        const denominator = eventCount + cycleCount;
                        const wr_denominator = wipCount + +wopCount;
                        ratio = denominator === 0 ? 0 : eventCount / denominator;
                        wipWopRatio = wr_denominator === 0 ? 0 : +wopCount / wr_denominator;
                    }
                    if (eventRatio) {
                        ratio = getNumber(+eventRatio);
                    }
                    if (wopRatio) {
                        wipWopRatio = getNumber(+wopRatio);
                    }
                    const mainIndex = colGrouping.length + index;

                    if (index < intervalRange.intervals.length) {
                        faultCountRowSum += eventCount;
                        cycleCountRowSum += cycleCount;

                        faultCountTotal[mainIndex] += eventCount;
                        cycleCountTotal[mainIndex] += cycleCount;

                        const numerator = faultCountTotal[mainIndex];
                        const denominator = faultCountTotal[mainIndex] + cycleCountTotal[mainIndex];
                        faultRatioTotal[mainIndex] = numerator / denominator;
                    }
                }

                finalData.push({
                    eventCount: week.isAfter(moment()) ? +eventCount.toFixed(2) : eventCount,
                    cycleCount,
                    ratio,
                    wipWopRatio,
                    wopCount,
                    duration,
                    time: week,
                });
            });
            const denominator = faultCountRowSum + cycleCountRowSum;
            const faultRateRowSum = faultCountRowSum / denominator;

            output.totals = showFaultRate ? faultRatioTotal : faultCountTotal;
            finalData.push(showFaultRate ? faultRateRowSum : getNumber(faultCountRowSum));
            return finalData;
        });
        return output;
    }, [colGrouping, intervalRange.intervals, reportingDataView, dataAfterLocalFilters, showFaultRate]);

    const tableColumns = useMemo(() => {
        const cols: Array<any> = getInitialColumns(screenSize)
            .slice(0, colGrouping.length)
            .map((c) => ({ ...c, name: t(messages[c.name]) }));

        const dataCellCol = {
            options: {
                filter: false,
                sortThirdClickReset: true,
                setCellProps: () => ({
                    className:
                        reportingDataView === ReportingDataView.Weekly
                            ? `data-cell past-data ${weeklyExpandAll ? 'left-border-weekly ' : ''}`
                            : 'data-cell past-data-daily',
                }),
                setCellHeaderProps: () => ({
                    className:
                        reportingDataView === ReportingDataView.Weekly
                            ? 'data-cell-header past-data'
                            : 'data-cell-header past-data-daily',
                }),
            },
        };

        const preHandleToggleColumn = (sortSubColumn: string, column: number, cb, order) => {
            setSortColumn(sortSubColumn);
            cb(column, order, sortSubColumn);
        };

        const dataColumnsOptions: any = {
            sortThirdClickReset: true,
            setCellProps: () => {
                return {
                    className: `${reportingDataView} data-cell `,
                };
            },
        };
        const BodyCell = intervalViews[reportingDataView].customBodyRender;

        if (intervalViews[reportingDataView].customBodyRender) {
            dataColumnsOptions.customBodyRender = (value, tableMeta, updateValue) => (
                <BodyCell
                    value={value}
                    tableMeta={tableMeta}
                    updateValue={updateValue}
                    expand={weeklyExpandAll}
                    threshold={intervalViews[reportingDataView].threshold}
                    className={'x-cls-body-cell'}
                    colGrouping={colGrouping}
                    sortColumn={sortColumn}
                    showFaultRate={showFaultRate}
                    isPercentage={isPercentage}
                    width={
                        !weeklyExpandAll
                            ? intervalViews[reportingDataView].colWidth
                            : intervalViews[reportingDataView].expandedColWidth
                    }
                    onShowRecommendedAction={setShowRecommendedActionsPopUp}
                    onTableRowClick={setCellSelected}
                    setOccurredOn={setOccurredOn}
                />
            );
        }

        const HeadCell = intervalViews[reportingDataView].customHeadRender;

        if (intervalViews[reportingDataView].customHeadRender) {
            dataColumnsOptions.customHeadRender = (columnMeta, handleToggleColumn, sortOrder) => (
                <React.Fragment key={`${Math.random()}`}>
                    <HeadCell
                        columnMeta={columnMeta}
                        handleToggleColumn={(columnName: string, index: number) =>
                            preHandleToggleColumn(columnName, index, handleToggleColumn, sortOrder)
                        }
                        sortOrder={sortOrder}
                        order={order}
                        className={'  '}
                        expand={weeklyExpandAll}
                        showFaultRate={showFaultRate}
                        width={
                            !weeklyExpandAll
                                ? intervalViews[reportingDataView].colWidth
                                : intervalViews[reportingDataView].expandedColWidth
                        }
                        labelFormat={intervalViews[reportingDataView].labelFormat}
                        extendedLabelFormat={intervalViews[reportingDataView].extendedLabelFormat}
                        threshold={intervalViews[reportingDataView].threshold}
                        langCode={i18n.language}
                        sortColumn={sortColumn}
                        handleTableLinkClick={handleTableLinkClick}
                    />
                </React.Fragment>
            );
        }

        if (intervalViews[reportingDataView].sortCompare) {
            dataColumnsOptions.sortCompare = (order) => (a, b) => {
                setOrder(order);
                switch (sortColumn) {
                    case 'faults':
                        const fault1 = a?.data?.eventCount,
                            fault2 = b?.data?.eventCount;
                        return (fault1 - fault2) * (order === 'asc' ? 1 : -1);
                    case 'cycle':
                        const cycle1 = a?.data?.cycleCount,
                            cycle2 = b?.data?.cycleCount;
                        return (cycle1 - cycle2) * (order === 'asc' ? 1 : -1);
                    case 'ratio':
                        const ratio1 = a?.data?.ratio,
                            ratio2 = b?.data?.ratio;
                        return (ratio1 - ratio2) * (order === 'asc' ? 1 : -1);
                    case 'wop':
                        const wop1 = a?.data?.wopCount,
                            wop2 = b?.data?.wopCount;
                        return (wop1 - wop2) * (order.direction === 'asc' ? 1 : -1);
                    case 'duration':
                        const duration1 = a?.data?.duration,
                            duration2 = b?.data?.duration;
                        return (duration1 - duration2) * (order.direction === 'asc' ? 1 : -1);
                    default:
                        return 0;
                }
            };
        }

        const currentDataCellCol = {
            options: {
                filter: false,
                sortThirdClickReset: true,
                setCellProps: () => {
                    return {
                        className:
                            reportingDataView === ReportingDataView.Weekly
                                ? `${reportingDataView} data-cell current-data`
                                : `${reportingDataView} data-cell current-data-daily`,
                    };
                },
                setCellHeaderProps: () => ({
                    className:
                        reportingDataView === ReportingDataView.Weekly
                            ? `${reportingDataView} data-cell-header current-data`
                            : `${reportingDataView} data-cell-header current-data-daily`,
                }),
            },
        };

        const futureDataCellCol = {
            options: {
                filter: false,
                sortThirdClickReset: true,
                setCellProps: () => {
                    return {
                        className:
                            reportingDataView === ReportingDataView.Weekly
                                ? `${reportingDataView} data-cell future-data`
                                : `${reportingDataView} data-cell future-data-daily`,
                    };
                },
                setCellHeaderProps: () => ({
                    className:
                        reportingDataView === ReportingDataView.Weekly
                            ? `${reportingDataView} data-cell-header future-data`
                            : `${reportingDataView} data-cell-header future-data-daily`,
                }),
            },
        };

        const futureForcastedDataCellCol = {
            options: {
                filter: false,
                sortThirdClickReset: true,
                setCellProps: () => {
                    return {
                        className:
                            reportingDataView === ReportingDataView.Weekly
                                ? `${reportingDataView} data-cell future-data-forcasted`
                                : `${reportingDataView} data-cell future-data-daily-forcasted`,
                    };
                },
                setCellHeaderProps: () => ({
                    className:
                        reportingDataView === ReportingDataView.Weekly
                            ? `${reportingDataView} data-cell-header future-data-forcasted`
                            : `${reportingDataView} data-cell-header future-data-daily-forcasted`,
                }),
            },
        };

        const currentDateValue = moment(filters.toTime);

        intervalRange.intervals.forEach((time: Moment) => {
            let colData = dataCellCol;

            if (time.isSameOrAfter(currentDateValue)) {
                colData = futureForcastedDataCellCol;
            }

            if (time.isSameOrBefore(currentDateValue)) {
                colData = dataCellCol;
            }

            cols.push({
                name: moment(time).format(intervalViews[reportingDataView].labelFormat),
                label: time.year(),
                ...{ ...colData, options: { ...dataColumnsOptions, ...colData.options, time } },
            });
        });

        if (!showFaultRate) {
            cols.push({
                name: t(messages.faultCountSum, { unit: showFaultRate ? 'Rate' : 'Count' }),
                label: t(messages.faultCountSum, { unit: showFaultRate ? 'Rate' : 'Count' }),
                options: {
                    filter: false,
                    sortThirdClickReset: true,
                    display: true,
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
                            zIndex: 99,
                            outline: '1.0px solid #525252',
                            textAlign: 'center',
                            whiteSpace: 'pre-wrap',
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
                    customBodyRender: (value: number) => {
                        const faultRate = isPercentage ? value.toFixed(4) : (value * 1000000).toFixed(1);
                        return <span>{showFaultRate ? faultRate : value.toFixed(0)}</span>;
                    },
                },
            });
        }

        if (intervalRange.intervals.length < 1) {
            cols.push({ name: t(messages.faultCountSum), label: '' });
        }
        return cols;
    }, [
        screenSize,
        colGrouping,
        reportingDataView,
        i18n.language,
        intervalRange.intervals,
        t,
        showFaultRate,
        weeklyExpandAll,
        sortColumn,
        isPercentage,
        order,
        handleTableLinkClick,
    ]);

    const options: any = useMemo(() => {
        let params: any = {
            pagination: false,
        };

        if (tableData.data?.length > 110) {
            params = {
                jumpToPage: true,
                pagination: true,
                rowsPerPage: 75,
                rowsPerPageOptions: [75, 100, 200],
                // tableBodyHeight: height - 58,
            };
        }

        return {
            filter: false,
            pagination: false,
            fixedHeader: true,
            elevation: 5,
            // filterType: 'none',
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
            sort: reportingDataView === ReportingDataView.Weekly,
            // selectableRowsHideCheckboxes: true,
            // filterType: 'none',
            customTableBodyFooterRender: showFaultRate
                ? () => { }
                : function (opts) {
                    const cols = tableData.totals.slice(2) || [];
                    return (
                        <TableFooter className={'x-cls-footer'}>
                            <TableRow className="x-cls-footer-">
                                <TableCell
                                    colSpan={2}
                                    key={'index-00-first'}
                                    className={'x-cls-footer-cell x-cls-footer-label'}
                                >
                                    <span>
                                        {t(messages.faultCountSum, { unit: showFaultRate ? 'Rate' : 'Count' })}
                                    </span>
                                </TableCell>
                                {cols.map((col, i) => {
                                    const faultRate = isPercentage ? col.toFixed(4) : (col * 1000000).toFixed(1);
                                    return (
                                        <TableCell key={`key-footer-${i}`} className={'x-cls-footer-cell'}>
                                            <span>{showFaultRate ? getNumber(faultRate) : getNumber(col) || ''}</span>
                                        </TableCell>
                                    );
                                })}
                                <TableCell key={`key-footer-00-end`} className={'x-cls-footer-cell'}></TableCell>
                            </TableRow>
                        </TableFooter>
                    );
                },
            ...params,
        };
    }, [tableData.data.length, tableData.totals, reportingDataView, t, showFaultRate, isPercentage]);

    // const dateRange: any = { startDate: filters.fromTime, endDate: filters.toTime };

    const startDatePlaceholder = t(messages.datePlaceHolder(reportingDataView.toUpperCase()));
    const endDatePlaceholder = t(messages.datePlaceHolder(reportingDataView.toUpperCase()));

    const choosePicker = (reportingDataView) => {
        switch (reportingDataView) {
            case ReportingDataView.Weekly:
                return FilterNames.dateRange;
            case ReportingDataView.Daily:
                return FilterNames.nineWeek;
            case ReportingDataView.Hourly:
                return FilterNames.singleDate;
            default:
                return FilterNames.dateRange;
        }
    };

    const choosePickerType = (reportingDataView) => {
        switch (reportingDataView) {
            case ReportingDataView.Weekly:
                return FilterType.Date;
            case ReportingDataView.Daily:
                return FilterType.Date;
            case ReportingDataView.Hourly:
                return FilterType.Select;
            default:
                return FilterType.Date;
        }
    };
    // extra widget properties
    const availableFilters: DashboardFilter[] = [
        {
            name: FilterNames.eventType,
            type: FilterType.Select,
            data: {
                options: [
                    'Filters.Fault',
                    'Filters.Warning',
                    'Filters.Componentexchange',
                    'Filters.FirmwareUpdate',
                    'Filters.Info',
                    'Filters.Maintenance',
                ],
            } as SelectFilterData,
        },
        {
            name: FilterNames.faultCode,
            type: FilterType.Select,
            data: { options: [] } as SelectFilterData,
        },
        {
            name: FilterNames.studType,
            type: FilterType.Select,
            data: { options: [] } as SelectFilterData,
        },
        {
            name: FilterNames.station,
            type: FilterType.Select,
            data: {
                options: [],
            } as SelectFilterData,
        },
        {
            name: FilterNames.deviceName,
            type: FilterType.Select,
            data: { options: [] } as SelectFilterData,
        },
        // {
        //     name: FilterNames.studId,
        //     type: FilterType.Select,
        //     hidden: true,
        //     data: { options: Array.from(filterValues[FilterNames.studId] || []) } as SelectFilterData,
        // },
        {
            name: choosePicker(reportingDataView),
            type: choosePickerType(reportingDataView),
            data: {
                fromTime: moment(filters.fromTime),
                toTime: moment(filters.toTime),
                startDatePlaceholder,
                endDatePlaceholder,
                isNineWeekView: false,
                isStartEndWeekAutoSelect: true,
            } as DateFilterData,
        },
    ];

    const crumbs: BreadcrumbLinks = useMemo(() => {
        const retVal = [
            {
                name: ScreenNames.home,
                label: t('ScreenName.Home'),
                href: '/home',
            },
            {
                name: ScreenNames.reportingView,
                label: t('ScreenName.FailureModeAnalysis'),
            },
            {
                name: FilterNames.dateRange,
                label: `DATE RANGE : ${moment(filters.fromTime).format('YYYY-MM-DD')} - ${moment(filters.toTime).format(
                    'YYYY-MM-DD',
                )}`,
            },
        ];

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

    const selectedTheme = useTheme();
    const { palette } = selectedTheme;
    const { mode } = palette;
    const sharedBoxSx = { display: 'flex', alignItems: 'center' };
    const sharedButtonColor = `${mode === 'light' ? palette?.primary?.light : palette?.primary?.dark}`;
    const sharedButtonGroupSx = {
        border: `1px solid ${sharedButtonColor}`,
        borderRadius: '4px',
        color: `${sharedButtonColor} !important`,
        height: '28px',
    };

    const tableBodyHeight = window.innerHeight - 350;

    return (
        <>
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
            <Box sx={{ width: '100%' }}>
                {activeAction === FilterActions.None && (
                    <Box sx={{ flex: 1, overflow: 'auto' }}>
                        <Box sx={{ margin: '11px 0px' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row-reverse',
                                }}
                            >
                                {availableFilters.length > 0 && (
                                    <FilterButton isEdit={false} hanldeFilterPanelOpen={setFilterPanelOpen} />
                                )}
                                <Breadcrumb
                                    availableFilters={availableFilters}
                                    filters={filters}
                                    crumbs={crumbs}
                                    onClick={onBreadcrumbChange}
                                />
                            </Box>
                            <FilterPanel
                                onChange={onFilterChanged}
                                filters={filters}
                                faultCodeDefault="20002"
                                onFilterAction={onFilterAction}
                                status="true"
                            // defaultFaultCode={defaultFaultCode}
                            />
                        </Box>
                        {/* TOOLBAR START */}
                        <Box
                            sx={{
                                height: '70px',
                                margin: '0px 15px',
                                display: 'flex',
                                flexWrap: 'row wrap',
                            }}
                        >
                            <Box
                                sx={{
                                    width: correctionWidth,
                                    background: `${mode === 'light' ? palette?.grey?.[100] : '#243041 '
                                        } 0% 0% no-repeat padding-box`,
                                    opacity: 1,
                                }}
                            >
                                &nbsp;
                            </Box>
                            <Box
                                sx={{
                                    ...sharedBoxSx,
                                    justifyContent: 'flex-end',
                                    backgroundColor: `${mode === 'light' ? palette?.grey?.[200] : '#19232f '}`,
                                    flex: 1,
                                    padding: '0px 20px',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        margin: '0px 10px',
                                        alignItems: 'center',
                                    }}
                                >
                                    <ParentLabel
                                        time={filters.fromTime}
                                        view={reportingDataView}
                                        locale={i18n.language}
                                        onClick={(e, label, view, name) =>
                                            handleTableLinkClick(e, label, view, name, filters.fromTime)
                                        }
                                    />
                                </Box>
                                {/* <Box className="x-cls-spacer"></Box> */}
                                <Stack direction={'row'} spacing={2}>
                                    {showFaultRate && (
                                        <Tooltip
                                            title={`${isPercentage
                                                    ? `${t(messages.unitSwitchTooltip, { unit: 'PPM' })}`
                                                    : `${t(messages.unitSwitchTooltip, { unit: '%' })}`
                                                }`}
                                            placement="top-start"
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={isPercentage}
                                                        onChange={() => setPercentage(!isPercentage)}
                                                        size="small"
                                                    />
                                                }
                                                label={`${isPercentage
                                                        ? `${t(messages.unitSwitchTooltip, { unit: '%' })}`
                                                        : `${t(messages.unitSwitchTooltip, { unit: 'PPM' })}`
                                                    }`}
                                            />
                                        </Tooltip>
                                    )}
                                    <ButtonGroup
                                        sx={{ ...sharedButtonGroupSx }}
                                        variant="contained"
                                        size={'small'}
                                        color="primary"
                                        aria-label="contained primary button group"
                                    >
                                        <Tooltip title="Event Rate" placement="top-start">
                                            <Button
                                                disabled={showFaultRate}
                                                className="fault-rate-btn"
                                                onClick={() => {
                                                    setFautRateVisibility(!showFaultRate);
                                                    setWeeklyExpandAll(false);
                                                }}
                                            >
                                                <i
                                                    style={{
                                                        color: showFaultRate
                                                            ? sharedButtonColor
                                                            : mode === 'light'
                                                                ? palette?.common?.white
                                                                : palette?.common?.black,
                                                    }}
                                                    className="fa fas fa-percent"
                                                    aria-hidden="true"
                                                />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Event Count" placement="top-start">
                                            <Button
                                                disabled={!showFaultRate}
                                                onClick={() => setFautRateVisibility(!showFaultRate)}
                                                className="fault-count-btn"
                                            >
                                                <i
                                                    style={{
                                                        color: !showFaultRate
                                                            ? sharedButtonColor
                                                            : mode === 'light'
                                                                ? palette?.common?.white
                                                                : palette?.common?.black,
                                                    }}
                                                    className="fa fas fa-list-ol"
                                                />
                                            </Button>
                                        </Tooltip>
                                    </ButtonGroup>
                                </Stack>
                                <Box sx={{ ...sharedBoxSx, margin: '0 10px' }}>
                                    <ButtonGroup
                                        sx={{ ...sharedButtonGroupSx }}
                                        variant="contained"
                                        size={'small'}
                                        color="primary"
                                        aria-label="contained primary button group"
                                    >
                                        <Tooltip title={`${t(messages.expandTooltip)}`} placement="top-start">
                                            <Button
                                                disabled={weeklyExpandAll}
                                                onClick={() => {
                                                    setWeeklyExpandAll(!weeklyExpandAll);
                                                }}
                                            >
                                                <FullscreenIcon
                                                    sx={{
                                                        color: weeklyExpandAll
                                                            ? sharedButtonColor
                                                            : mode === 'light'
                                                                ? palette?.common?.white
                                                                : palette?.common?.black,
                                                    }}
                                                />
                                            </Button>
                                        </Tooltip>

                                        <Tooltip title={`${t(messages.collapeTooltip)}`} placement="top-start">
                                            <Button
                                                disabled={!weeklyExpandAll}
                                                onClick={() => {
                                                    setWeeklyExpandAll(!weeklyExpandAll);
                                                    setFautRateVisibility(showFaultRate);
                                                }}
                                            >
                                                <FullscreenExitIcon
                                                    sx={{
                                                        color: !weeklyExpandAll
                                                            ? sharedButtonColor
                                                            : mode === 'light'
                                                                ? palette?.common?.white
                                                                : palette?.common?.black,
                                                    }}
                                                />
                                            </Button>
                                        </Tooltip>
                                    </ButtonGroup>
                                </Box>
                                <Box sx={{ ...sharedBoxSx }}>
                                    {process.env.NODE_ENV === 'development' && (
                                        <ButtonGroup
                                            sx={{ ...sharedButtonGroupSx }}
                                            variant="contained"
                                            size={'small'}
                                            aria-label="contained primary button group"
                                        >
                                            <Tooltip title="Table" placement="top-start">
                                                <Button
                                                    disabled={reportingDataViewType === ReportingDataViewType.Table}
                                                    onClick={() =>
                                                        setReportingDataViewType(ReportingDataViewType.Table)
                                                    }
                                                >
                                                    <i
                                                        style={{
                                                            color:
                                                                reportingDataViewType === ReportingDataViewType.Table
                                                                    ? sharedButtonColor
                                                                    : mode === 'light'
                                                                        ? palette?.common?.white
                                                                        : palette?.common?.black,
                                                        }}
                                                        className="fa fa-table"
                                                        aria-hidden="true"
                                                    />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Graph" placement="top-start">
                                                <Button
                                                    disabled={reportingDataViewType === ReportingDataViewType.Graph}
                                                // onClick={() =>
                                                //     setReportingDataViewType(ReportingDataViewType.Graph)
                                                // }
                                                >
                                                    <i
                                                        style={{
                                                            color:
                                                                reportingDataViewType === ReportingDataViewType.Graph
                                                                    ? sharedButtonColor
                                                                    : mode === 'light'
                                                                        ? palette?.common?.white
                                                                        : palette?.common?.black,
                                                        }}
                                                        className="fa fas fa-chart-line"
                                                    ></i>
                                                </Button>
                                            </Tooltip>
                                        </ButtonGroup>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                        {/* TOOLBAR END */}
                        <Box
                            sx={{
                                position: 'relative',
                                //backgroundColor: 'red',
                                margin: '0px 15px',
                                border: '1px solid silver',
                                overflow: 'auto',
                            }}
                        >
                            {reportingDataViewType === ReportingDataViewType.Table && tableData.data.length > 0 && (
                                <Table
                                    tableBodyHeight={tableBodyHeight}
                                    data={tableData.data}
                                    columns={tableColumns}
                                    options={options}
                                    caption={true}
                                />
                            )}
                            {reportingDataViewType === ReportingDataViewType.Table && tableData.data.length === 0 && (
                                <Box>
                                    {faultRatesIsLoading && <Loader />}
                                    {!faultRatesIsLoading && <Box>{t(messages.noData)}</Box>}
                                </Box>
                            )}
                            {reportingDataViewType === ReportingDataViewType.Graph && tableData.data.length > 0 && (
                                <Box></Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>

            {apiFilters.eventCode !== '' && (
                <div className={`ui-slider ${showRecommendedActionsPopUp ? 'slidein' : 'slideout'}`}>
                    {showRecommendedActionsPopUp && (
                        <SliderPanel
                            open={showRecommendedActionsPopUp}
                            closePopup={() => setShowRecommendedActionsPopUp(false)}
                            selectedFilters={{ ...filters, ...cellSelected, occurredOn }}
                        />
                    )}
                </div>
            )}
        </>
    );
});

export default ReportingView;

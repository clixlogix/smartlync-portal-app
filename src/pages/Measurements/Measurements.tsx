/**
 *
 * Measurements
 *
 */
import Breadcrumb from 'components/Breadcrumb';
import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import {
    DashboardFilter,
    DateFilterData,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { SystemType } from 'constants/staticValues';
import Constant, { API_REQUEST_DATE_FORMAT } from 'constants/index';
import {
    FilterNames,
    Filters,
    LoadingValue,
    ScreenNames,
    AggregateType,
    DeviceNames,
    Stations,
    SidePanelOpenState,
} from 'models';
import moment from 'moment';
import { Page, PageProps } from 'pages';
import { memo, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { selectDeviceNames } from 'services/device/device-name/device-name-selectors';
import { selectStations } from 'services/station/station-selectors';
import {
    selectMeasurementAggregateWidgets,
    selectMeasurementAggregateWidgetIsLoading,
    selectMeasurementAggregateWidgetFiltersValues,
    selectFormattedCycleGapEvents,
} from 'services/measurement-aggregate-widget/measurement-aggregate-widget-selectors';
import { Responsive } from 'react-grid-layout';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectAggregateColumns } from 'services/select-aggregate-column/select-aggregate-column-selectors';
import Button from '@mui/material/Button';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate, useLocalStorage } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import { MeasurementAggregateWidgetProperty } from 'widgets';
import { MeasurementAggregateWidget } from 'widgets/measurementAggregateWidget/Loadable';
import { Grid, Box } from '@mui/material';
import * as _ from 'lodash';
import { messages } from './messages';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    measurementAggregateWidgetActions,
    measurementAggregateWidgetReducer,
    measurementAggregateWidgetKey,
} from 'services/measurement-aggregate-widget/measurement-aggregate-widget-reducer';
import { getAllMeasurementAggregateWidgetsSaga } from 'services/measurement-aggregate-widget/sagas/measurement-aggregate-widget-saga-get-all';
import { ChartRef } from 'components/panels/Chart/Chart';
import { ExtraPanel } from 'widgets/CycleGap/ExtraPanel/ExtraPanel';
import './Measurements.scss';
import { useTheme } from '@mui/material/styles';
import { Chart } from 'components/panels';
import { chartTheme, ThemeModes } from 'styles/theme/themes';
import Loader from 'components/Loader';
import CloseIcon from '@mui/icons-material/Close';
import { Pages } from 'constants/defaultDateConfig';
import get from 'lodash/get';
import { synchronousChart } from 'utils/synchronousChart';

interface MeasurementsProps extends PageProps {}

export const Measurements: Page<MeasurementsProps> = memo((props: MeasurementsProps) => {
    const { plantId } = useSelector(selectBreadcrumbFilters);
    const { t } = useTranslation();

    useInjectReducer({ key: measurementAggregateWidgetKey, reducer: measurementAggregateWidgetReducer });
    useInjectSaga({ key: measurementAggregateWidgetKey, saga: getAllMeasurementAggregateWidgetsSaga });

    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    const aggregateColumns: any = useSelector(selectSelectAggregateColumns);
    const deviceNames: DeviceNames = useSelector(selectDeviceNames);
    const stations: Stations = useSelector(selectStations);

    const measurementAggregateWidgets: any | undefined = useSelector(selectMeasurementAggregateWidgets);
    const formattedCycleGapEvents: any = useSelector(selectFormattedCycleGapEvents);
    const dispatch = useDispatch();

    const measurementAggregateWidgetIsLoading: boolean = useSelector(selectMeasurementAggregateWidgetIsLoading);
    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.Measurements)), []);
    const pageFilters = [
        {
            name: FilterNames.dateRange,
            type: FilterType.Date,
            data: {
                fromTime: moment(START_TIME).clone().startOf('day'),
                toTime: moment(START_TIME).clone().endOf('day'),
                validation: true,
                nos: 3,
                period: 'days',
            } as DateFilterData, // set default value here
        },
        ...(MeasurementAggregateWidgetProperty.defaultFilters || []),
    ];
    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        [FilterNames.systemType]: SystemType.SWS,
        // add your default filters for this page here ...
        [FilterNames.aggregateNeeded]: false,
        [FilterNames.aggregateColumn]: get(aggregateColumns, [0, 'value'], ''),
        [FilterNames.groupBy]: undefined,
        [FilterNames.station]: '',
        // [FilterNames.deviceName]: deviceNames[0],
        [FilterNames.station]: stations[0],
        [FilterNames.carTypeId]: '0',
        [FilterNames.fromTime]: moment(START_TIME).clone().startOf('day'),
        [FilterNames.toTime]: moment(START_TIME).clone().endOf('day'),
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
    });

    const [extraPanelState, setExtraPanelState] = useState<SidePanelOpenState>(SidePanelOpenState.Close);

    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const [availableFiltersFromData] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));

    const selected: any = localStorage.getItem('selectedAggregateColumn');

    const selectedArr: any = {};
    const data = selected && selected.split(',');
    selectedArr['data'] = data;

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const availableFilters = useMemo(() => {
        return [
            ...availableFiltersFromData,
            {
                name: FilterNames.aggregateColumn,
                // label: 'Filters.AggregateColumn',
                type: FilterType.Select,
                isStartcase: true,
                data: { options: [] } as SelectFilterData,
            },
            // TODO: Enable this filter when required.
            // {
            //     name: FilterNames.aggregateType,
            //     label: 'Filters.AggregateType',
            //     type: FilterType.Select,
            //     multiple: false,
            //     disabled: !filters.aggregateNeeded,
            //     data: {
            //         options: [
            //             AggregateType.count,
            //             AggregateType.min,
            //             AggregateType.max,
            //             AggregateType.median,
            //             AggregateType.stddev,
            //         ],
            //     } as SelectFilterData,
            // },
        ];
    }, [availableFiltersFromData /*, filters.aggregateNeeded*/]);

    const onFilterChange = (filter: Filters) => {
        changeFilters(filter);
    };

    const [loadingState, setLoadingState] = useState<LoadingValue>({});
    const updateLoadingState = (key: string, loading: boolean) => {
        loadingState[key] = loading;
        setLoadingState(loadingState);
    };
    const isLoading: boolean = useMemo(() => {
        return [...(Object.values(loadingState) as boolean[])].reduce((acc: boolean, value: boolean) => {
            acc = acc ? acc : value;
            return acc;
        }, false);
    }, [loadingState]);

    const crumbs = useMemo(() => {
        const retVal = [
            {
                name: ScreenNames.home,
                label: t('ScreenName.Home'),
                href: '/home',
            },
            {
                name: ScreenNames.measurement,
                label: t('ScreenName.Measurement'),
            },
            {
                name: FilterNames.singleDate,
                label: `Date : ${filters.fromTime.format(API_REQUEST_DATE_FORMAT)} - ${filters.toTime.format(
                    API_REQUEST_DATE_FORMAT,
                )}`,
            },
        ];
        return retVal;
    }, [filters.fromTime, filters.toTime, t]);

    const onBreadcrumbChange = (crumb: string | Filters) => {
        if (typeof crumb === 'string') {
            // a link was selected to route to page
        }
        // a filter was selected so update filters
        onFilterChange({ ...(crumb as Filters) } as any);
    };

    useEffect(
        () => {
            onFilterChange({
                ...apiFilters,
                ...breadCrumbsDataType,
                [FilterNames.station]: stations[0],
                [FilterNames.deviceName]: deviceNames[0],
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [stations, deviceNames],
    );

    useEffect(() => {
        const filter = _.omitBy(
            {
                [FilterNames.deviceName]: filters.deviceName,
                [FilterNames.langCode]: filters.selectedLanguage,
                [FilterNames.fromTime]: filters.fromTime,
                [FilterNames.toTime]: filters.toTime,
                [FilterNames.systemType]: filters.systemType,
                [FilterNames.station]: filters.station,
                [FilterNames.groupBy]: filters.groupBy,
                [FilterNames.aggregateType]: filters.aggregateType,
                [FilterNames.aggregateColumn]: filters.aggregateColumn,
                // [FilterNames.aggregateWindow]: view,
                [FilterNames.aggregateNeeded]: filters.aggregateNeeded,
                [FilterNames.carTypeId]: filters.carbodyId,
            },
            _.isNil,
        );
        dispatch(measurementAggregateWidgetActions.getAllMeasurementAggregateWidgets(filter));
    }, [
        dispatch,
        filters.deviceName,
        filters.fromTime,
        filters.selectedLanguage,
        filters.station,
        filters.systemType,
        filters.toTime,
        filters.groupBy,
        filters.aggregateType,
        filters.aggregateNeeded,
        filters.carbodyId,
        filters.aggregateColumn,
    ]);

    useEffect(() => {
        const filter = _.omitBy(
            {
                [FilterNames.studId]: filters.studId,
                [FilterNames.outletNo]: filters.outletNo,
                [FilterNames.feederNo]: filters.feederNo,
            },
            _.isNil,
        );
        dispatch(measurementAggregateWidgetActions.localFiltering(filter));
    }, [dispatch, filters.studId, filters.outletNo, filters.feederNo]);

    const onChartClick = (chart: string, event) => {};
    const [refs, setRefs] = useState<ChartRef[]>([]);

    const getRef = useCallback(
        (newRef: ChartRef) => {
            setRefs([...refs, newRef]);
        },
        [refs],
    );

    const renderMeasurementsWidgets = () => {
        return _.map(measurementAggregateWidgets, function (value, key) {
            const paramData = aggregateColumns.find((ele) => ele.value === key) || aggregateColumns[0];
            return (
                <>
                    <Grid item md={12} xs={12}>
                        {measurementAggregateWidgetIsLoading ? (
                            <Loader circle />
                        ) : (
                            <MeasurementAggregateWidget
                                key={`aggregateWidget-${key}`}
                                filters={{ ...apiFilters }}
                                localFilters={localFilters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) => updateLoadingState('MeasurementWidgets', loading)}
                                data={paramData}
                                chartData={value}
                                title={key}
                                getRef={getRef}
                                refs={refs}
                                setExtraPanelState={handleMoreClick}
                                // sidePanelState={extraPanelState}
                                loadData
                                onClick={onChartClick}
                            />
                        )}
                    </Grid>
                </>
            );
        });
    };

    const theme = useTheme();
    const textColor = theme.palette.text.primary;
    const options = {
        chart: {
            type: 'scatter',
            zoomType: 'xy',
        },
        title: {
            text: undefined,
        },
        xAxis: {
            type: 'datetime',
            labels: {
                step: 1,
            },
            scrollbar: {
                enabled: false,
            },
            min: moment(filters.fromTime).valueOf(),
            max: moment(filters.toTime).valueOf(),
            events: {
                afterSetExtremes: synchronousChart(refs),
            },
        },
        tooltip: {
            useHTML: true,
            headerFormat: '<table><tr><th colspan="2">{series.name}</th></tr>',
            pointFormat:
                '<tr><td style="color: {series.color}">Time : </td>' +
                '<td style="text-align: left"><b>{point.time}</b></td></tr>' +
                '<tr><td style="color: {series.color}">CycleGap : </td>' +
                '<td style="text-align: left"><b>{point.gap} minutes</b></td></tr>' +
                '<tr><td style="color: {series.color}">FeederNo : </td>' +
                '<td style="text-align: left"><b>{point.feederNo}</b></td></tr>' +
                '<tr><td style="color: {series.color}">OutletNo : </td>' +
                '<td style="text-align: left"><b>{point.outletNo}</b></td></tr>' +
                '<tr><td style="color: {series.color}">WIP : </td>' +
                '<td style="text-align: left"><b>{point.wip}</b></td></tr>' +
                '<tr><td style="color: {series.color}">StudId : </td>' +
                '<td style="text-align: left"><b>{point.studId}</b></td></tr>',
            footerFormat: '</table>',
        },
        yAxis: [
            {
                gridLineColor: '#424242',
                title: {
                    text: 'Event Type', //t(messages.eventTypeLabel),
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: 'Open Sans',
                        color: textColor,
                    },
                },
                labels: {
                    x: 5,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: textColor,
                    },
                },
                tickmarkPlacement: 'between',
                tickColor: 'transparent',
                categories: [t('Filters.Info'), t('Filters.Fault'), t('Filters.Warning')],
                min: 0,
                max: 2,
                reversed: true,
            },
        ],
        series: [...formattedCycleGapEvents],
        plotOptions: {
            series: {
                cursor: 'pointer',
            },
            scatter: {
                turboThreshold: 100000000,
            },
        },
    };

    const handleMoreClick = (data) => {
        if (data === SidePanelOpenState.Close) {
            setExtraPanelState(SidePanelOpenState.Close);
        } else {
            setExtraPanelState(SidePanelOpenState.Open);
        }
    };

    return (
        <>
            <Helmet>
                <title>{t(messages.measurementsPageTitle)}</title>

                <meta name="description" content="Description of CycleGapTempo" />
            </Helmet>
            <div className="x-cls-loader ">{isLoading && <ProgressBar className={'progress'} variant="buffer" />}</div>

            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={filters}
                    availableFilters={Array.from(availableFilters.values())}
                    defaultFilters={defaultFilters}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                    filterValues={() => {
                        const filterValues = [
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectMeasurementAggregateWidgetFiltersValues),
                        ].reduce((acc, filters) => {
                            acc = { ...acc, ...filters };
                            return acc;
                        }, {} as any);

                        return filterValues;
                    }}
                />
            )}
            <Grid container xs={12} sx={{ width: '100%' }}>
                <Grid item xs={extraPanelState === SidePanelOpenState.Open ? 8 : 12}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '20px',
                                    flex: '1,1',
                                }}
                            >
                                <Breadcrumb crumbs={crumbs} onClick={onBreadcrumbChange} />
                                {availableFilters.length > 0 && (
                                    <FilterButton
                                        isEdit={false}
                                        isLayoutEdit={editPageLayout}
                                        hanldeLayoutEdit={setEditPageLayout}
                                        hanldeFilterPanelOpen={setFilterPanelOpen}
                                    />
                                )}
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                width: extraPanelState === SidePanelOpenState.Close ? '100%' : 'auto',
                                display: 'flex',
                                height: '150px',
                                marginTop: '8px',
                                backgroundColor:
                                    theme.palette.mode === ThemeModes.dark
                                        ? chartTheme.backgroundDark
                                        : chartTheme.backgroundLight,
                            }}
                        >
                            {measurementAggregateWidgetIsLoading ? (
                                <Loader circle />
                            ) : (
                                <Box style={{ width: '100%', height: '150px' }}>
                                    <Chart
                                        chartType={'scatter'}
                                        xChartTitle=""
                                        yChartTitle=""
                                        options={options}
                                        getRef={getRef}
                                    />
                                </Box>
                            )}
                        </Grid>
                        <Grid
                            sx={{
                                height: 'calc(100vh - 355px)',
                                overflowY: 'auto',
                            }}
                            item
                            xs={12}
                        >
                            <Box
                                // className="maximize-widget"
                                key={`key-measurements`}
                                data-grid={{ ...MeasurementAggregateWidgetProperty.layout, static: false }}
                            >
                                <Grid container rowSpacing={5}>
                                    {!_.isEmpty(measurementAggregateWidgets) && renderMeasurementsWidgets()}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                {extraPanelState === SidePanelOpenState.Open && (
                    <Grid
                        item
                        xs={4}
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            paddingTop: '60px',
                        }}
                    >
                        <ExtraPanel extraPanelState={extraPanelState} />

                        <Box>
                            <Button
                                sx={{ marginLeft: 'auto' }}
                                onClick={() => handleMoreClick(SidePanelOpenState.Close)}
                            >
                                <CloseIcon sx={{ cursor: 'pointer' }} />
                            </Button>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </>
    );
});

export default Measurements;

/**
 *
 * MeasurementsSpr
 *
 */
import { useState, memo, useMemo, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Responsive } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import moment from 'moment';
import Box from '@mui/material/Box';

import Breadcrumb from 'components/Breadcrumb';
import {
    DashboardFilter,
    DateFilterData,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { FilterNames, Filters, LoadingValue, ScreenNames, DeviceNames, Stations, SidePanelOpenState } from 'models';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate, useLocalStorage } from 'utils';
import { Page, PageProps } from 'pages';
import { selectSelectAggregateColumns } from 'services/select-aggregate-column/select-aggregate-column-selectors';
import Constant, { API_REQUEST_DATE_FORMAT } from 'constants/index';
import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectDeviceNames } from 'services/device/device-name/device-name-selectors';
import { selectStations } from 'services/station/station-selectors';
import {
    selectMeasurementAggregateWidgetSprs,
    selectMeasurementAggregateWidgetSprFiltersValues,
    selectMeasurementAggregateWidgetSprIsLoading,
    selectFormattedCycleGapEvents,
} from 'services/measurement-aggregate-widget-spr/measurement-aggregate-widget-spr-selectors';
import { useFilters } from 'utils/hooks/use-filters';
import { MeasurementAggregateWidgetSprProperty } from 'widgets';
import { SystemType } from 'constants/staticValues';
import MeasurementAggregateWidgetSpr from 'widgets/MeasurementAggregateWidgetSpr/Loadable';
import * as _ from 'lodash';
import { ExtraPanel } from 'widgets/CycleGapSPR/ExtraPanel/ExtraPanel';
import './MeasurementsSpr.scss';
import CloseIcon from '@mui/icons-material/Close';
import { messages } from './messages';
import { Button, Grid } from '@mui/material';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    measurementAggregateWidgetSprActions,
    measurementAggregateWidgetSprReducer,
    measurementAggregateWidgetSprKey,
} from 'services/measurement-aggregate-widget-spr/measurement-aggregate-widget-spr-reducer';
import { getAllMeasurementAggregateWidgetSprsSaga } from 'services/measurement-aggregate-widget-spr/sagas/measurement-aggregate-widget-spr-saga-get-all';
import { ChartRef } from 'components/panels/Chart/Chart';
import { useTheme } from '@mui/material/styles';
import { Chart } from 'components/panels';
import { chartTheme, ThemeModes } from 'styles/theme/themes';
import Loader from 'components/Loader';
import { Pages } from 'constants/defaultDateConfig';
import get from 'lodash/get';
import { synchronousChart } from 'utils/synchronousChart';

interface MeasurementsSprProps extends PageProps {}

export const MeasurementsSpr: Page<MeasurementsSprProps> = memo((props: MeasurementsSprProps) => {
    const { plantId } = useSelector(selectBreadcrumbFilters);
    const { t } = useTranslation();

    useInjectReducer({ key: measurementAggregateWidgetSprKey, reducer: measurementAggregateWidgetSprReducer });
    useInjectSaga({ key: measurementAggregateWidgetSprKey, saga: getAllMeasurementAggregateWidgetSprsSaga });

    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    const aggregateColumns: any = useSelector(selectSelectAggregateColumns);

    const deviceNames: DeviceNames = useSelector(selectDeviceNames);
    const stations: Stations = useSelector(selectStations);

    const measurementAggregateWidgets: any | undefined = useSelector(selectMeasurementAggregateWidgetSprs);
    const measurementAggregateWidgetIsLoading: boolean = useSelector(selectMeasurementAggregateWidgetSprIsLoading);
    const formattedCycleGapEvents: any = useSelector(selectFormattedCycleGapEvents);

    const dispatch = useDispatch();

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
        ...(MeasurementAggregateWidgetSprProperty.defaultFilters || []),
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

    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const [availableFiltersFromData] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const [extraPanelState, setExtraPanelState] = useState<SidePanelOpenState>(SidePanelOpenState.Close);

    const selected: any = localStorage.getItem('selectedAggregateColumn');

    const selectedArr: any = {};
    const data = selected && selected.split(',');

    selectedArr['data'] = data;

    // const result = aggregateColumns.filter((f) => selectedArr.data && selectedArr.data.find((ele) => f.value === ele));

    const [loadingState, setLoadingState] = useState<LoadingValue>({});
    const updateLoadingState = (key: string, loading: boolean) => {
        loadingState[key] = loading;
        setLoadingState(loadingState);
    };
    const isLoading: boolean = useMemo(() => {
        return [
            ...(Object.values(loadingState) as boolean[]),
            // add your isLoading here
        ].reduce((acc: boolean, value: boolean) => {
            acc = acc ? acc : value;
            return acc;
        }, false);
    }, [
        loadingState,
        // add your other Widget isLoading code here
    ]);

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
        ];
    }, [availableFiltersFromData]);

    const onFilterChange = (filter: Filters) => {
        changeFilters(filter);
    };

    const crumbs = [
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
        let filter = _.omitBy(
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
        dispatch(measurementAggregateWidgetSprActions.getAllMeasurementAggregateWidgetSprs(filter));
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
                [FilterNames.program]: filters.program,
                [FilterNames.outletNo]: filters.outletNo,
            },
            _.isNil,
        );
        dispatch(measurementAggregateWidgetSprActions.localFiltering(filter));
    }, [dispatch, filters.program, filters.outletNo]);

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
                <Grid item md={12} xs={12}>
                    {measurementAggregateWidgetIsLoading ? (
                        <Loader circle />
                    ) : (
                        <MeasurementAggregateWidgetSpr
                            key={`aggregateWidgetSpr-${key}`}
                            filters={{ ...apiFilters }}
                            localFilters={localFilters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('MeasurementWidgets', loading)}
                            data={paramData}
                            chartData={value}
                            title={key}
                            getRef={getRef}
                            refs={refs}
                            loadData
                            setExtraPanelState={handleMoreClick}
                        />
                    )}
                </Grid>
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
                categories: ['Regler', 'Feeder', 'Spindle'],
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
                <title>{t(messages.measurementsSprPageTitle)}</title>

                <meta name="description" content="Description of CycleGapTempo" />
            </Helmet>
            <div className="x-cls-loader ">{isLoading && <ProgressBar className={'progress'} variant="buffer" />}</div>

            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    defaultFilters={defaultFilters}
                    filters={filters}
                    availableFilters={Array.from(availableFilters.values())}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                    filterValues={() => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        return useSelector(selectMeasurementAggregateWidgetSprFiltersValues);
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
                                    <>
                                        <FilterButton
                                            isEdit={false}
                                            isLayoutEdit={editPageLayout}
                                            hanldeLayoutEdit={setEditPageLayout}
                                            hanldeFilterPanelOpen={setFilterPanelOpen}
                                        />
                                    </>
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
                                key={`key-measurements-spr`}
                                data-grid={{ ...MeasurementAggregateWidgetSprProperty.layout, static: false }}
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
                        xs={4}
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            paddingTop: '60px',
                        }}
                    >
                        <Box>
                            <ExtraPanel extraPanelState={extraPanelState} />
                        </Box>
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

export default MeasurementsSpr;

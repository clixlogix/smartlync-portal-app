/**
 *
 * PlantHealthOverviewSpr
 *
 */

import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import { ScreenNames } from 'models';
import { memo, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { getAllTimeZoneSprsSaga } from 'services/time-zone-spr/sagas/time-zone-spr-saga-get-all';
import { timeZoneSprKey, timeZoneSprReducer } from 'services/time-zone-spr/time-zone-spr-reducer';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    PlantAppNavBarSprProperty,
    PlantCycleAveragesWidgetSprProperty,
    PlantCycleCountSprProperty,
    PlantFaultByDurationSprProperty,
    PlantFaultByOccurenceSprProperty,
    PlantFaultFrequencySprProperty,
} from 'widgets';
import PlantAppNavBarSpr from 'widgets/SPR/PlantAppNavBarSPR';
import PlantCycleAveragesWidgetSpr from 'widgets/SPR/PlantCycleAveragesWidgetSPR';
import PlantCycleCountSpr from 'widgets/SPR/PlantCycleCountSPR';
import PlantFaultByDurationSpr from 'widgets/SPR/PlantFaultByDurationSPR';
import PlantFaultByOccurenceSpr from 'widgets/SPR/PlantFaultByOccurenceSPR';
import PlantFaultFrequencySpr from 'widgets/SPR/PlantFaultFrequencySPR';
// import PlantFaultByStudTypeSpr from 'widgets/SPR/PlantFaultByStudTypeSPR';
import { DashboardFilter } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { SystemType } from 'constants/staticValues';
import { CarTypes, FilterNames, Filters, LoadingValue, TimeZoneSpr } from 'models';
import moment from 'moment';
import { Page, PageProps } from 'pages';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { fixedRangeActions, fixedRangeKey, fixedRangeReducer } from 'services/fixed-range/fixed-range-reducer';
import { selectTimeZoneSprs } from 'services/time-zone-spr/time-zone-spr-selectors';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import {
    PlantDeviceByDurationSprProperty,
    PlantFaultByDevicesSprProperty,
    PlantFaultByStudTypeSprProperty,
} from 'widgets';
import PlantDeviceByDurationSpr from 'widgets/SPR/PlantDeviceByDurationSPR';
import PlantFaultByDevicesSpr from 'widgets/SPR/PlantFaultByDevicesSPR';
import { messages } from './messages';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import WeekPicker from 'components/WeekPicker/WeekPicker';
import { Box, Grid, Stack, Typography } from '@mui/material';
import SelectDeviceNameFilterNew from 'components/filters/SelectDeviceNameFilterNew';
import { Pages } from 'constants/defaultDateConfig';

const limit = 10000;

interface PlantHealthOverviewSprProps extends PageProps { }

const pageFilters = [
    ...(PlantCycleAveragesWidgetSprProperty.defaultFilters || []),
    ...(PlantCycleCountSprProperty.defaultFilters || []),
    ...(PlantAppNavBarSprProperty.defaultFilters || []),
    ...(PlantFaultFrequencySprProperty.defaultFilters || []),
    ...(PlantFaultByOccurenceSprProperty.defaultFilters || []),
    ...(PlantFaultByDurationSprProperty.defaultFilters || []),
    ...(PlantFaultByStudTypeSprProperty.defaultFilters || []),
    ...(PlantFaultByDevicesSprProperty.defaultFilters || []),
    ...(PlantDeviceByDurationSprProperty.defaultFilters || []),
];

export const PlantHealthOverviewSpr: Page<PlantHealthOverviewSprProps> = memo((props: PlantHealthOverviewSprProps) => {
    // const [plantId] = useQueryParam<string>(FilterNames.plantId, '1', true);
    const { plantId } = useSelector(selectBreadcrumbFilters);
    const { t /* , i18n */ } = useTranslation();
    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.PlantHealthOverview)), []);
    // TODO: Currently fixed toTime to Week 43 for Demo tenant until changed for rest tenants it would be current date
    const toTime = moment(START_TIME).subtract(1, 'isoWeek').endOf('isoWeek');
    const fromTime = moment(toTime).startOf('isoWeek');

    useInjectReducer({ key: timeZoneSprKey, reducer: timeZoneSprReducer });
    useInjectSaga({ key: timeZoneSprKey, saga: getAllTimeZoneSprsSaga });

    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        [FilterNames.carTypeId]: '0',
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: SystemType.SWS,
        [FilterNames.fromTime]: fromTime,
        [FilterNames.toTime]: toTime,
        // [FilterNames.deviceSubLine]: 0,
    };
    const [timeRange, setTimeRange] = useState<any>({
        fromRange: defaultFilters.fromTime,
        toRange: defaultFilters.toTime,
    });
    const [deviceName, setDeviceName] = useState<any>(null);

    useInjectReducer({ key: fixedRangeKey, reducer: fixedRangeReducer });
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            fixedRangeActions.setAllFixedRanges({
                sinceTime: 6,
                weekRangeNumber: 2,
                dateFormat: '[Week] WW',
                isRangeFormat: false,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
        // listOfLocalFilters,
    });

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };

    const onFilterChange = (filter: Filters) => {
        changeFilters(filter);
    };

    const [toTimeFilter, setToTimeFilter] = useState<any>(defaultFilters.toTime);
    const [fromTimeFilter, setFromTimeFilter] = useState<any>(
        moment(toTimeFilter).clone().subtract(8, 'isoWeek').startOf('isoWeek'),
    );

    const [loadingState, setLoadingState] = useState<LoadingValue>({});
    const updateLoadingState = (key: string, loading: boolean) => {
        loadingState[key] = loading;
        setLoadingState(loadingState);
    };
    const crumbs: BreadcrumbLinks = useMemo(() => {
        const retVal = [
            {
                name: ScreenNames.home,
                label: t('ScreenName.Home'),
                href: '/home',
            },
            {
                name: FilterNames.plantId,
                label: t('ScreenName.PlantOveriew'),
            },
        ];

        return retVal;
    }, [t]);

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
        onFilterChange({ ...(crumb as Filters) });
    };

    const layoutProperties: any = useMemo(
        () => ({
            className: 'layout',
            width: 1200,
            breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
            cols: { lg: 4, md: 2, sm: 1, xs: 1, xxs: 1 },
            autoSize: true,
            // compactType: 'vertical',
            // isBounded: true,
            rowHeight: 150,
            useCSSTransforms: true,
        }),
        [],
    );

    const weekValueSelectedTable = (data: Filters) => {
        const { fromTime, toTime } = data;
        setTimeRange({ fromRange: fromTime, toRange: toTime });
    };
    // Extend Object to extend;
    const bottomFilters = useMemo(
        () => ({
            ...filters,
            fromTime: timeRange?.fromRange,
            toTime: timeRange?.toRange,
            deviceName,
        }),
        [deviceName, filters, timeRange.fromRange, timeRange.toRange],
    );

    const weekValueSelected = (data: Filters) => {
        let { toTime, fromTime } = data;
        fromTime = moment(toTime).subtract(8, 'isoWeek').startOf('isoWeek');
        setToTimeFilter(toTime);
        setFromTimeFilter(fromTime);
    };

    return (
        <>
            <Helmet>
                <title>{t(messages.plantHealthOverviewPageTitle)}</title>
                <meta name="description" content="Description of PlantHealthOverview" />
            </Helmet>
            <Box
                className={'x-cls-plant-health-overview-body x-cls-data-panel-container'}
                sx={{
                    height: 'calc(100vh - 80px)',
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    overflow: 'auto',
                    flexFlow: 'column nowrap',
                    padding: '10px 0px 30px 0px',
                    marginBottom: '20px',
                }}
            >
                <Breadcrumb
                    availableFilters={availableFilters}
                    filters={filters}
                    crumbs={crumbs}
                    onClick={onBreadcrumbChange}
                />

                <Box
                    style={{ height: '100%', width: '100%' }}
                    sx={{
                        overflow: 'auto',
                    }}
                    className="body-wrapper layout"
                    {...layoutProperties}
                >
                    <Box
                        sx={{
                            margin: '20px',
                        }}
                    >
                        <WeekPicker
                            defaultDate={toTime}
                            weekValueSelected={(e: Filters) => weekValueSelected(e)}
                            isNineWeekView={true}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexFlow: 'row wrap',
                            marginBottom: ' 10px',
                        }}
                        key={`key-row-1`}
                        data-grid={{
                            x: 0,
                            y: 0,
                            w: 10,
                            h: 2.0,
                            static: true,
                        }}
                    >
                        <PlantCycleAveragesWidgetSpr
                            filters={{ ...filters, toTime: toTimeFilter, fromTime: fromTimeFilter }}
                        />
                        <PlantCycleCountSpr filters={{ ...filters, toTime: toTimeFilter, fromTime: fromTimeFilter }} />
                    </Box>
                    <Box
                        sx={{
                            flexFlow: 'row wrap',
                        }}
                        key={`key-row-2`}
                        data-grid={{
                            x: 0,
                            y: 2,
                            w: 10,
                            h: 1,
                            static: true,
                        }}
                    >
                        {/* <PlantAppNavBarSpr /> */}

                        <Box>
                            <Box sx={{ paddingTop: '13px' }}>
                                {/* <Typography variant="h6">{t(messages.systemHealthCard)}</Typography> */}
                                <Box
                                    sx={{
                                        margin: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <WeekPicker
                                        defaultDate={toTime}
                                        weekValueSelected={(e: Filters) => weekValueSelectedTable(e)}
                                        isNineWeekView={false}
                                    />
                                    <Box sx={{ width: '300px' }}>
                                        <SelectDeviceNameFilterNew
                                            name={FilterNames.deviceName}
                                            filters={bottomFilters}
                                            multiple={false}
                                            onChange={(value: Filters) => setDeviceName(value.deviceName)}
                                        />
                                    </Box>
                                    <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                            }}
                                        >
                                            <ArrowDownwardIcon sx={{ color: '#149b74' }} />
                                            <ArrowUpwardIcon sx={{ color: '#ff9d00' }} />
                                            <Typography>{t(messages.change)}</Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                            }}
                                        >
                                            <AddIcon sx={{ color: '#ffd20b' }} />
                                            <Typography>{t(messages.new)}</Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                            }}
                                        >
                                            <RemoveIcon sx={{ color: '#0077dd' }} />
                                            <Typography>{t(messages.noChange)}</Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                                <Box
                                    className="stanleyRow cards layout"
                                    sx={{
                                        flexFlow: 'row wrap',
                                        gap: '20px',
                                        justifyContent: 'space-evenly',
                                        height: '355px',
                                        minWidth: '645px',
                                        flexGrow: 1,
                                    }}
                                >
                                    <Grid container item spacing={1}>
                                        <Grid item xs={6}>
                                            <PlantFaultFrequencySpr
                                                filters={bottomFilters}
                                                onFilterChange={onFilterChange}
                                                isLoading={(loading: boolean) =>
                                                    updateLoadingState('PlantFaultFrequencyWidget', loading)
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <PlantFaultByOccurenceSpr
                                                filters={bottomFilters}
                                                onFilterChange={onFilterChange}
                                                isLoading={(loading: boolean) =>
                                                    updateLoadingState('PlantFaultByOccurenceWidget', loading)
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <PlantFaultByDurationSpr
                                                filters={bottomFilters}
                                                onFilterChange={onFilterChange}
                                                isLoading={(loading: boolean) =>
                                                    updateLoadingState('PlantFaultByDurationWidget', loading)
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <PlantFaultByDevicesSpr
                                                filters={bottomFilters}
                                                onFilterChange={onFilterChange}
                                                isLoading={(loading: boolean) =>
                                                    updateLoadingState('PlantFaultByDevicesWidget', loading)
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <PlantDeviceByDurationSpr
                                                filters={bottomFilters}
                                                onFilterChange={onFilterChange}
                                                isLoading={(loading: boolean) =>
                                                    updateLoadingState('PlantDeviceByDurationWidget', loading)
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
});

export default PlantHealthOverviewSpr;

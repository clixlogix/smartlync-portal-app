/**
 *
 * FailureRateTrend
 *
 */
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import {
    DashboardFilter,
    DateFilterData,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { CarTypes, FilterNames, Filters, LoadingValue, ScreenNames, view } from 'models';
import { Page, PageProps } from 'pages';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { withSize } from 'react-sizeme';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate, useLocalStorage } from 'utils';
import { EventRateCycleCount } from 'widgets/EventRate/EventRateCycleCount/Loadable';
import { EventRatePerEvent } from 'widgets/EventRate/EventRatePerEvent/Loadable';
import { messages } from './messages';
// import { EventRateCycleCountProperty, EventRatePerDeviceProperty, EventRatePerEventProperty } from 'widgets';

import { FilterButton } from 'components/FilterButton/FilterButton';
import { ChartRef } from 'components/panels/Chart/Chart';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import Constant, { API_REQUEST_DATE_FORMAT } from 'constants/index';
import { SystemType } from 'constants/staticValues';
import * as _ from 'lodash';
import moment from 'moment';
import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectEventRateCycleCountFilterValues } from 'services/event-rate-cycle-count/event-rate-cycle-count-selectors';
import {
    eventRatePerDeviceActions,
    eventRatePerDeviceKey,
    eventRatePerDeviceReducer,
} from 'services/event-rate-per-device/event-rate-per-device-reducer';
import {
    selectEventRatePerDeviceFilterValues,
    selectEventRatePerDevices,
} from 'services/event-rate-per-device/event-rate-per-device-selectors';
import getAllEventRatePerDevicesSaga from 'services/event-rate-per-device/sagas/event-rate-per-device-saga-get-all';
import { selectEventRatePerEventFilterValues } from 'services/event-rate-per-event/event-rate-per-event-selectors';
import { selectLines } from 'services/line/line-selectors';
import { useFilters } from 'utils/hooks/use-filters';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { EventRatePerDevice } from 'widgets/EventRate/EventRatePerDevice/Loadable';
import { Grid, Box } from '@mui/material';
import { Pages } from 'constants/defaultDateConfig';

interface FailureRateTrendProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const originalLayouts = {
    lg: [
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-event-rate-cycle-count',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 4,
            i: 'key-event-rate-per-event',
        },
    ],
};

const listOfLocalFilters = [FilterNames.week];

export const FailureRateTrend: Page<FailureRateTrendProps> = memo((props: FailureRateTrendProps) => {
    const { t } = useTranslation();
    const { plantId } = useSelector(selectBreadcrumbFilters);
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    const pageFilters = useMemo(() => {
        const START_TIME = moment(getDefaultFilterDate(Pages.FailureRateTrend));
        return [
            {
                name: FilterNames.dateRange,
                type: FilterType.Date,
                label: 'Date',
                data: {
                    fromTime: START_TIME.clone().subtract(9, 'isoWeek').startOf('day'),
                    toTime: START_TIME.clone().endOf('day'),
                    startDatePlaceholder: 'll',
                    endDatePlaceholder: 'll',
                } as DateFilterData,
            },
            {
                name: FilterNames.view,
                type: FilterType.Select,
                label: 'Filters.View',
                data: { options: ['Filters.Weekly', 'Filters.Daily'] } as SelectFilterData,
            },
            {
                name: FilterNames.eventType,
                type: FilterType.Select,
                data: {
                    options: [
                        'Filters.Fault',
                        'Filters.Warning',
                        'Filters.FirmwareUpdate',
                        'Filters.Info',
                        'Filters.Componentexchange',
                        'Filters.Maintenance',
                    ],
                } as SelectFilterData,
            },
            {
                name: FilterNames.week,
                type: FilterType.Select,
                label: 'Filters.WeekLabel',
                placeholder: 'Filters.FilterByWeekPlaceholder',
                data: { options: [] } as SelectFilterData,
            },
            // { name: FilterNames.studType, type: FilterType.Select, data: { options: [] } as SelectFilterData },
            { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
            { name: FilterNames.faultCode, type: FilterType.Select, data: { options: [] } as SelectFilterData },
        ];
    }, []);

    const eventTypes = useMemo(() => {
        return [
            t('Filters.Fault'),
            t('Filters.Warning'),
            t('Filters.Componentexchange'),
            t('Filters.FirmwareUpdate'),
            t('Filters.Info'),
            t('Filters.Maintenance'),
        ];
    }, [t]);

    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        [FilterNames.carTypeId]: '0',
        view: view.Weekly,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: SystemType.SWS,
        [FilterNames.eventType]: eventTypes[0],
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
        listOfLocalFilters,
    });

    useEffect(
        () => {
            const defaultView = apiFilters.view && apiFilters.view !== '' ? apiFilters.view : view.Weekly;
            changeFilters({ ...apiFilters, [FilterNames.eventType]: eventTypes[0], view: defaultView });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [eventTypes, apiFilters.view],
    );

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const [availableFiltersFromData] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.failureRateTrendPage, originalLayouts);
    const lineOptions = useSelector(selectLines);
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };

    const onFilterChange = (filter: Filters) => {
        changeFilters(filter);
    };

    const [loadingState, setLoadingState] = useState<LoadingValue>({});
    const updateLoadingState = (key: string, loading: boolean) => {
        loadingState[key] = loading;
        setLoadingState(loadingState);
    };

    const availableFilters = [
        ...availableFiltersFromData.slice(0, 2),
        {
            name: FilterNames.deviceLine,
            type: FilterType.Select,
            data: { options: lineOptions } as SelectFilterData,
        },
        ...availableFiltersFromData.slice(2),
    ];

    const crumbs: BreadcrumbLinks = useMemo(() => {
        const retVal = [
            {
                name: ScreenNames.failureRateTrends,
                label: t('ScreenName.Home'),
                href: '/home',
            },
            {
                name: ScreenNames.failureRateTrends,
                label: t('ScreenName.FailureRateTrend'),
            },
            {
                name: `dateRange`,
                label: `Date Range: ${filters.fromTime.format(API_REQUEST_DATE_FORMAT)} - ${filters.toTime.format(
                    API_REQUEST_DATE_FORMAT,
                )}`,
            },
        ];

        // if (filters?.[FilterNames.deviceName]) {
        //     retVal.push(filters[FilterNames.deviceName]);
        // }
        return retVal;
    }, [filters.fromTime, filters.toTime, t]);

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

    const eventTypeIndex = useMemo(() => {
        const index = eventTypes.indexOf(apiFilters.eventType);
        return index >= 0 ? index : 0;
    }, [apiFilters.eventType, eventTypes]);

    useInjectReducer({ key: eventRatePerDeviceKey, reducer: eventRatePerDeviceReducer });
    useInjectSaga({ key: eventRatePerDeviceKey, saga: getAllEventRatePerDevicesSaga });

    const eventRatePerDevices: any = useSelector(selectEventRatePerDevices);
    const dispatch = useDispatch();

    const [widgetFilters] = useState<Filters>({
        // ...defaultFilters,
        // add your filters here
        plantId: 1,
        view: view.Weekly,
        ...apiFilters,
    });

    const serviceFilters = useMemo(
        () => ({
            ...widgetFilters,
            ...apiFilters,
            eventType: eventTypeIndex,
            [FilterNames.systemType]: SystemType.SWS,
            [FilterNames.eventCode]: apiFilters.eventCode === '' ? undefined : apiFilters.eventCode,
        }),
        [widgetFilters, apiFilters, eventTypeIndex],
    );

    useEffect(() => {
        const filter = _.omitBy(
            {
                [FilterNames.carType]: serviceFilters.carType,
                [FilterNames.fromTime]: serviceFilters.fromTime,
                [FilterNames.toTime]: serviceFilters.toTime,
                [FilterNames.langCode]: serviceFilters.langCode,
                [FilterNames.plantId]: serviceFilters.plantId,
                [FilterNames.view]: serviceFilters.view,
                [FilterNames.systemType]: serviceFilters.systemType,
                [FilterNames.eventType]: serviceFilters.eventType,
                [FilterNames.eventCode]: serviceFilters.eventCode,
                [FilterNames.deviceLine]: serviceFilters.subLine,
                [FilterNames.studType]: serviceFilters.studType,
                [FilterNames.deviceName]: serviceFilters.deviceName,
            },
            _.isNil,
        );
        dispatch(eventRatePerDeviceActions.getAllEventRatePerDevices(filter));
    }, [
        dispatch,
        serviceFilters.carType,
        serviceFilters.fromTime,
        serviceFilters.toTime,
        serviceFilters.langCode,
        serviceFilters.plantId,
        serviceFilters.view,
        serviceFilters.systemType,
        serviceFilters.eventType,
        serviceFilters.eventCode,
        serviceFilters.subLine,
        serviceFilters.studType,
        serviceFilters.deviceName,
    ]);

    const layoutProperties: any = useMemo(
        () => ({
            // className: 'layout',
            width: 1200,
            breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
            cols: { lg: 4, md: 4, sm: 1, xs: 1, xxs: 1 },
            autoSize: false,
            // compactType: 'vertical',
            // isBounded: true,
            isDraggable: editPageLayout,
            isResizable: editPageLayout,
            rowHeight: 150,
            // margin: 10,
            layouts,
            useCSSTransforms: true,
        }),
        [layouts, editPageLayout],
    );

    const onLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
    };

    const [refs, setRefs] = useState<ChartRef[]>([]);

    const getRef = useCallback(
        (newRef: ChartRef) => {
            setRefs([...refs, newRef]);
        },
        [refs],
    );

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);

    const renderEventPerDeviceWidgets = () => {
        // console.log(eventRatePerDevices, 'keyvalue');
        return _.map(eventRatePerDevices, function (value, key) {
            // console.log(key, value, 'keyvalue');
            return (
                <Grid item md={6} xs={12}>
                    <EventRatePerDevice
                        filters={{ ...apiFilters, eventType: eventTypeIndex }}
                        localFilters={localFilters}
                        onFilterChange={onFilterChange}
                        isLoading={(loading: boolean) => updateLoadingState('EventCountFrequencyWidget', loading)}
                        data={value}
                        title={key}
                        loadData
                    />
                </Grid>
            );
        });
    };
    return (
        <>
            <Helmet>
                <title>{t(messages.failureRateTrendPageTitle)}</title>
                <meta name="description" content="Description of FailureRateTrend" />
            </Helmet>
            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={filters}
                    availableFilters={availableFilters}
                    defaultFilters={defaultFilters}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                    filterValues={() => {
                        const filterValues = [
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectEventRatePerEventFilterValues),
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectEventRatePerDeviceFilterValues),
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectEventRateCycleCountFilterValues),
                        ].reduce((acc, filters) => {
                            acc = { ...acc, ...filters };
                            return acc;
                        }, {} as any);

                        return filterValues;
                    }}
                />
            )}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    overflowY: 'auto',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: ' 10px' }}>
                    <Breadcrumb
                        availableFilters={availableFilters}
                        filters={filters}
                        crumbs={crumbs}
                        onClick={onBreadcrumbChange}
                    />
                    {availableFilters.length > 0 && (
                        <FilterButton
                            isLayoutEdit={editPageLayout}
                            hanldeLayoutEdit={setEditPageLayout}
                            hanldeFilterPanelOpen={setFilterPanelOpen}
                        />
                    )}
                </Box>
                <Box sx={{ maxWidth: '100% !important', width: '98% !important', height: 'fit-content !important' }}>
                    <ResponsiveReactGridLayout
                        onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
                        {...layoutProperties}
                    >
                        <Box
                            // className="x-cls-dashboard-item maximize-widget-width"
                            sx={{ width: '100% !important' }}
                            key={`key-event-rate-cycle-count`}
                            data-grid={{
                                preventCollision: true,
                                x: 0,
                                y: 0,
                                w: 4,
                                h: 3,
                            }}
                        >
                            <EventRateCycleCount
                                // className="x-cls-event-rate-cycle-count-widget "
                                filters={{ ...filters, eventType: eventTypeIndex }}
                                localFilters={localFilters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) => updateLoadingState('EventRateCycleCount', loading)}
                                getRef={getRef}
                                refs={refs}
                            />
                        </Box>
                        <Box
                            // className="x-cls-dashboard-item maximize-widget-width "
                            sx={{ width: '100% !important' }}
                            key={`key-event-rate-per-event`}
                            data-grid={{
                                preventCollision: true,
                                x: 0,
                                y: 3,
                                w: 4,
                                h: 3,
                            }}
                        >
                            <EventRatePerEvent
                                filters={{ ...filters, eventType: eventTypeIndex }}
                                localFilters={localFilters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) =>
                                    updateLoadingState('EventCountFrequencyWidget', loading)
                                }
                                getRef={getRef}
                                refs={refs}
                            />
                        </Box>

                        <Box
                            sx={{ width: '100% !important' }}
                            key={`key-event-rate-per-device-subLines`}
                            data-grid={{
                                preventCollision: true,
                                x: 0,
                                y: 6,
                                w: 4,
                                h: 3,
                            }}
                        >
                            <Grid spacing={2} container>
                                {renderEventPerDeviceWidgets()}
                            </Grid>
                        </Box>
                    </ResponsiveReactGridLayout>
                </Box>
            </Box>
        </>
    );
});

export default FailureRateTrend;

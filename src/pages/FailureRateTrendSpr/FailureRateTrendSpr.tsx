/**
 *
 * FailureRateTrendSpr
 *
 */
import React, { useState, memo, useMemo, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import {
    useLocalStorage,
    buildAvailableFiltersFromData,
    buildFiltersFromData,
    useQueryParam,
    getDefaultFilterDate,
} from 'utils';
import {
    DashboardFilter,
    FilterType,
    SelectFilterData,
    DateFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import { Filters, LoadingValue, FilterNames, CarTypes, view, ScreenNames } from 'models';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { Page, PageProps } from 'pages';
import { messages } from './messages';
import EventRateCycleCountSpr from 'widgets/EventRate/EventRateCycleCountSpr/Loadable';
import EventRatePerDeviceSpr from 'widgets/EventRate/EventRatePerDeviceSpr/Loadable';
import EventRatePerEventSpr from 'widgets/EventRate/EventRatePerEventSpr/Loadable';
// import { EventRatePerDeviceSprProperty,EventRateCycleCountSprProperty, EventRatePerEventSprProperty  } from 'widgets';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectEventRatePerEventSprFiltersValues } from 'services/event-rate-per-event-spr/event-rate-per-event-spr-selectors';
import {
    selectEventRatePerDeviceSprFilterValues,
    selectEventRatePerDeviceSprs,
} from 'services/event-rate-per-device-spr/event-rate-per-device-spr-selectors';
import Constant from 'constants/index';
import moment from 'moment';
import { useFilters } from 'utils/hooks/use-filters';
import { selectLines } from 'services/line/line-selectors';
import { SystemType } from 'constants/staticValues';
import { ChartRef } from 'components/panels/Chart/Chart';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { getAllEventRatePerDeviceSprsSaga } from 'services/event-rate-per-device-spr/sagas';
import { API_REQUEST_DATE_FORMAT } from 'constants/index';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { FilterButton } from 'components/FilterButton/FilterButton';
import * as _ from 'lodash';
import {
    eventRatePerDeviceSprActions,
    eventRatePerDeviceSprKey,
    eventRatePerDeviceSprReducer,
} from 'services/event-rate-per-device-spr/event-rate-per-device-spr-reducer';
import { selectEventRateCycleCountSprFilterValues } from 'services/event-rate-cycle-count-spr/event-rate-cycle-count-spr-selectors';
import { Box, Grid } from '@mui/material';
import { Pages } from 'constants/defaultDateConfig';

interface FailureRateTrendSprProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const originalLayouts = {
    lg: [
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-event-rate-cycle-count-spr',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 4,
            i: 'key-event-rate-per-event-spr',
        },
    ],
};

const listOfLocalFilters = [FilterNames.week];

export const FailureRateTrendSpr: Page<FailureRateTrendSprProps> = memo((props: FailureRateTrendSprProps) => {
    const { t } = useTranslation();
    const [plantId] = useQueryParam<string>('plantId', '1', true);
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

    const dispatch = useDispatch();
    const [availableFiltersFromData] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.failureRateTrendSprPage, originalLayouts);
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

    const eventTypeIndex = useMemo(() => {
        const index = eventTypes.indexOf(apiFilters.eventType);
        return index >= 0 ? index : 0;
    }, [apiFilters.eventType, eventTypes]);

    useInjectReducer({ key: eventRatePerDeviceSprKey, reducer: eventRatePerDeviceSprReducer });
    useInjectSaga({ key: eventRatePerDeviceSprKey, saga: getAllEventRatePerDeviceSprsSaga });

    const eventRatePerDevices: any = useSelector(selectEventRatePerDeviceSprs);

    useEffect(() => {
        const filter = _.omitBy(
            {
                [FilterNames.carType]: filters.carType,
                [FilterNames.fromTime]: filters.fromTime,
                [FilterNames.toTime]: filters.toTime,
                [FilterNames.langCode]: filters.langCode,
                [FilterNames.plantId]: filters.plantId,
                [FilterNames.view]: filters.view,
                [FilterNames.systemType]: filters.systemType,
                [FilterNames.eventType]: filters.eventType,
                [FilterNames.eventCode]: filters.eventCode,
                [FilterNames.deviceLine]: filters.subLine,
                [FilterNames.studType]: filters.studType,
                [FilterNames.deviceName]: filters.deviceName,
            },
            _.isNil,
        );
        dispatch(eventRatePerDeviceSprActions.getAllEventRatePerDeviceSprs(filter));
    }, [
        dispatch,
        filters.carType,
        filters.fromTime,
        filters.toTime,
        filters.langCode,
        filters.plantId,
        filters.view,
        filters.systemType,
        filters.eventType,
        filters.eventCode,
        filters.subLine,
        filters.studType,
        filters.deviceName,
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
        return _.map(eventRatePerDevices, function (value, key) {
            return (
                <Grid item md={6} xs={12}>
                    <EventRatePerDeviceSpr
                        // className={'x-cls-event-count-frequency-widget subline-widget'}
                        // key={`key-event-rate-per-device-${key}`}
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
                <title>{t(messages.failureRateTrendSprPageTitle)}</title>
                <meta name="description" content="Description of FailureRateTrendSpr" />
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
                            useSelector(selectEventRatePerEventSprFiltersValues),
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectEventRatePerDeviceSprFilterValues),
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectEventRateCycleCountSprFilterValues),
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
                            key={`key-event-rate-cycle-count-spr`}
                            data-grid={{
                                preventCollision: true,
                                x: 0,
                                y: 0,
                                w: 4,
                                h: 3,
                            }}
                        >
                            <EventRateCycleCountSpr
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
                            // className="x-cls-dashboard-item maximize-widget-width"
                            sx={{ width: '100% !important' }}
                            key={`key-event-rate-per-event-spr`}
                            data-grid={{
                                preventCollision: true,
                                x: 0,
                                y: 3,
                                w: 4,
                                h: 3,
                            }}
                        >
                            <EventRatePerEventSpr
                                // className="x-cls-event-rate-per-event-widget "
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
                            // className={`x-cls-dashboard-item-subLines maximize-widget-width`}
                            sx={{ width: '100% !important' }}
                            key={`key-event-rate-per-device-subLines-spr`}
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

export default FailureRateTrendSpr;

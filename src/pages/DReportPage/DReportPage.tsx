/**
 *
 * DReportPage
 *
 */
import React, { useState, memo, useMemo, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Responsive } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import {
    dReportWidgetActions,
    dReportWidgetReducer,
    dReportWidgetKey,
} from 'services/dreport-widget/dreport-widget-reducer';
import { selectDReportWidgets, selectDReportWidgetIsLoading } from 'services/dreport-widget/dreport-widget-selectors';

import { getAllDReportWidgetsSaga } from 'services/dreport-widget/sagas/dreport-widget-saga-get-all';

import { useQueryParam, useLocalStorage } from 'utils';
import DReportWidget from 'widgets/DReportWidget/DReportWidget';
import { EventRatePerEventProperty } from 'widgets';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import {
    DashboardFilter,
    FilterType,
    DateFilterData,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { FilterNames, Filters, SidePanelOpenState, LoadingValue, ScreenNames } from 'models';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { Page, PageProps } from 'pages';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { FilterButton } from 'components/FilterButton/FilterButton';
import moment from 'moment';
import { Pages } from 'constants/defaultDateConfig';
import { SystemType } from 'constants/staticValues';
import { useFilters } from 'utils/hooks/use-filters';
import { Grid, Box, Typography } from '@mui/material';
import { messages } from './messages';
import Constant, { API_REQUEST_DATE_FORMAT } from 'constants/index';
import Switch from '@mui/material/Switch';
import map from 'lodash/map';
import Loader from 'components/Loader';
import words from 'lodash/words';
import toLower from 'lodash/toLower';
import Constants from 'constants/index';
import { Tenants } from 'constants/defaultDateConfig';
import { selectStudTypes } from 'services/stud/stud-type/stud-type-selectors';
import isEmpty from 'lodash/isEmpty';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import './DReportPage.scss';

interface DReportPageProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const pageFilters = [...(EventRatePerEventProperty.defaultFilters || [])];

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
const listOfLocalFilters = [];

export const DReportPage: Page<DReportPageProps> = memo((props: DReportPageProps) => {
    useInjectReducer({ key: dReportWidgetKey, reducer: dReportWidgetReducer });

    useInjectSaga({ key: dReportWidgetKey, saga: getAllDReportWidgetsSaga });

    const href = toLower(window.location.href);
    const tenant = words(href)[1] as Tenants;
    const studTypes = useSelector(selectStudTypes);

    const dReportWidgets: any = useSelector(selectDReportWidgets);
    const dReportWidgetIsLoading: boolean = useSelector(selectDReportWidgetIsLoading);

    const { plantId } = useSelector(selectBreadcrumbFilters);
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    const dispatch = useDispatch();

    const { t /* , i18n */ } = useTranslation();

    const pageFilters = useMemo(() => {
        const START_TIME = moment(getDefaultFilterDate(Pages.DReport));
        const fromTime = moment(START_TIME).subtract(1, 'year').startOf('isoWeek');
        const toTime = moment(START_TIME).endOf('isoWeek');
        return [
            {
                name: FilterNames.fixedRangePicker,
                type: FilterType.Date,
                data: {
                    fromTime,
                    toTime,
                    startDatePlaceholder: 'll',
                    endDatePlaceholder: 'll',
                } as DateFilterData,
            },
            {
                name: FilterNames.studType,
                type: FilterType.Select,
                data: { options: [] } as SelectFilterData,
            },
        ];
    }, []);

    const STUDTYPE_DEFAULT = tenant === (Tenants.DEMO || Tenants.V1DAIMLER) ? 'SWB802,SWB807,SWB713' : studTypes[0];
    const EVENTCODE_DEFAULT = '20002,20028,17068';

    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        [FilterNames.carTypeId]: '0',
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: SystemType.SWS,
        [FilterNames.studType]: STUDTYPE_DEFAULT,
        [FilterNames.eventCode]: EVENTCODE_DEFAULT,
        [FilterNames.eventType]: 0,
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
        listOfLocalFilters,
    });

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const [availableFiltersFromData] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.failureRateTrendPage, originalLayouts);

    useEffect(() => {
        dispatch(dReportWidgetActions.getAllDReportWidgets(filters));
    }, [dispatch, filters.fromTime, filters.toTime, filters.systemType, filters.studType]);

    const onFilterChange = (filter: Filters) => {
        changeFilters(filter);
    };
    const onLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
    };

    const [loadingState, setLoadingState] = useState<LoadingValue>({});
    const updateLoadingState = (key: string, loading: boolean) => {
        loadingState[key] = loading;
        setLoadingState(loadingState);
    };
    const weekCategories = useMemo(() => {
        let dates: string[] = [];
        let currentWeek = moment(filters.fromTime);
        while (currentWeek.isBefore(filters.toTime)) {
            dates.push(currentWeek.format('YYYY[W]W'));
            currentWeek.add(1, 'isoWeek');
        }
        return dates;
    }, [filters.fromTime, filters.toTime]);

    const crumbs: BreadcrumbLinks = useMemo(() => {
        const retVal = [
            {
                name: ScreenNames.failureRateTrends,
                label: t('ScreenName.Home'),
                href: '/',
            },
            {
                name: ScreenNames.failureRateTrends,
                label: t('ScreenName.DReport'),
            },
            {
                name: `dateRange`,
                label: `Date Range: ${filters.fromTime.format(API_REQUEST_DATE_FORMAT)} - ${filters.toTime.format(
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
        // onFilterChange({ ...(crumb as Filters) } as any);
    };

    if (filters[FilterNames.deviceName]) {
        crumbs.push(filters[FilterNames.deviceName]);
    }

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

    const renderWidgets = () => {
        return map(dReportWidgets, function (value, studTypeKey) {
            const { weekly, monthly } = value;
            return (
                <>
                    <Grid item md={6} xs={12}>
                        <DReportWidget
                            key={`d-report-weekly`}
                            filters={filters}
                            // localFilters={localFilters}
                            view={'weekly'}
                            series={weekly}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('DReportWidget', loading)}
                            categories={weekCategories}
                            // data={value}
                            title={studTypeKey}
                        // loadData
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DReportWidget
                            key={`d-report-monthly`}
                            filters={filters}
                            // localFilters={localFilters}
                            view={'monthly'}
                            series={monthly}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('DReportWidget', loading)}
                            // data={value}
                            title={studTypeKey}
                        // loadData
                        />
                    </Grid>
                </>
            );
        });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                overflow: 'auto',
            }}
        >
            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={filters}
                    availableFilters={availableFilters}
                    defaultFilters={defaultFilters}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                />
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: ' 10px' }}>
                <Breadcrumb
                    availableFilters={availableFilters}
                    filters={filters}
                    crumbs={crumbs}
                    onClick={onBreadcrumbChange}
                />
                {availableFilters.length > 0 && (
                    <FilterButton
                        isEdit={false}
                        isLayoutEdit={false}
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
                            static: true,
                            x: 0,
                            y: 0,
                            w: 4,
                            h: 3,
                        }}
                    >
                        {dReportWidgetIsLoading ? (
                            <Loader circle />
                        ) : isEmpty(dReportWidgets) ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                }}
                            >
                                <Typography component="div" variant="subtitle2">
                                    {t('General.NoData')}
                                </Typography>
                            </Box>
                        ) : (
                            <Grid spacing={2} container xs={12}>
                                {renderWidgets()}
                            </Grid>
                        )}
                    </Box>
                </ResponsiveReactGridLayout>
            </Box>
        </Box>
    );
});

export default DReportPage;

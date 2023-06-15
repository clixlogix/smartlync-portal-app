/**
 *
 * EluPlatformAnalytics
 *
 */
import React, { useState, memo, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { Responsive } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import { useSelector } from 'react-redux';
import { useLocalStorage, getDefaultFilterDate } from 'utils';
import UploadStatWidget from 'widgets/UploadStat/Loadable';
import UploadChartWidget from 'widgets/UploadChart/Loadable';
import { UploadStatProperty, UploadChartProperty } from 'widgets';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import Constant from 'constants/index';
import { DashboardFilter, FilterType, DateFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { FilterNames, Filters, LoadingValue, ReportingDataView, CarTypes } from 'models';
import { buildAvailableFiltersFromData, buildFiltersFromData } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import { Page, PageProps } from 'pages';
import { messages } from './messages';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import moment from 'moment';
import { Pages } from 'constants/defaultDateConfig';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import './EluPlatformAnalytics.scss';

interface EluPlatformAnalyticsProps extends PageProps {}

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const originalLayouts = {
    lg: [
        {
            w: 6,
            h: 2,
            x: 0,
            y: 0,
            i: 'key-upload-stat-0',
        },
        {
            w: 6,
            h: 2,
            x: 0,
            y: 2,
            i: 'key-upload-chart-1',
        },
        {
            w: 6,
            h: 2,
            x: 0,
            y: 4,
            i: 'key-upload-chart-2',
        },
        {
            w: 3,
            h: 2,
            x: 0,
            y: 6,
            i: 'key-upload-chart-3',
        },
        {
            w: 3,
            h: 2,
            x: 3,
            y: 6,
            i: 'key-upload-chart-4',
        },
        {
            w: 6,
            h: 2,
            x: 0,
            y: 8,
            i: 'key-upload-chart-5',
        },
    ],
};

const listOfLocalFilters = [];

export const EluPlatformAnalytics: Page<EluPlatformAnalyticsProps> = memo((props: EluPlatformAnalyticsProps) => {
    const { t } = useTranslation();
    const pageFilters = useMemo(() => {
        const START_TIME = moment(getDefaultFilterDate(Pages.PlatformAnalytics));
        return [
            {
                name: FilterNames.dateRange,
                type: FilterType.Date,
                data: {
                    [FilterNames.fromTime]: moment(START_TIME).subtract(1, 'year').startOf('isoWeek'),
                    [FilterNames.toTime]: moment(START_TIME).endOf('day'),
                    startDatePlaceholder: 'll',
                    endDatePlaceholder: 'll',
                } as DateFilterData,
            },
            ...(UploadStatProperty.defaultFilters || []),
            ...(UploadChartProperty.defaultFilters || []),
        ];
    }, []);
    const defaultFilters = {
        [FilterNames.plantId]: '',
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: 'SWS',
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
        listOfLocalFilters,
    });

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters };
    }, [apiFilters, localFilters]);

    const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.eluPlatformAnalyticsPage, originalLayouts);
    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);

    const onFilterChange = (filter: Filters) => {
        changeFilters(filter);
    };

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

    const crumbs: BreadcrumbLinks = useMemo(() => {
        const retVal = [
            {
                name: FilterNames.plantId,
                label: t('General.Plant', { [FilterNames.plantId]: filters?.[FilterNames.plantId] }),
            },
            { name: FilterNames.systemType, menu: filters[FilterNames.systemType], options: ['SWS', 'SPR', 'SAT'] },
            {
                name: FilterNames.carTypeId,
                menu: carTypes.find(({ id }) => id === filters[FilterNames.carTypeId])?.name || carTypes[0]?.name,
                options: carTypes.map(({ name = '' }) => name),
                inactive: false,
            },
        ];

        if (filters?.[FilterNames.deviceName]) {
            retVal.push(filters[FilterNames.deviceName]);
        }
        return retVal;
    }, [carTypes, filters, t]);

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
            cols: { lg: 6, md: 6, sm: 1, xs: 1, xxs: 1 },
            autoSize: true,
            // compactType: 'vertical',
            // isBounded: true,
            isDraggable: editPageLayout,
            isResizable: editPageLayout,
            isBounded: false,
            rowHeight: 185,
            // margin: 10,
            layouts,
            useCSSTransforms: true,
            height: '100%',
        }),
        [layouts, editPageLayout],
    );

    const onLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
    };

    return (
        <>
            <Helmet>
                <title>{t(messages.eluPlatformAnalyticsPageTitle)}</title>
                <meta name="description" content="Description of EluPlatformAnalytics" />
            </Helmet>
            <Div className="x-cls-loader ">{isLoading && <ProgressBar className={'progress'} variant="buffer" />}</Div>

            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={{ ...filters }}
                    availableFilters={Array.from(availableFilters.values())}
                    defaultFilters={defaultFilters}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                />
            )}
            <Div className={'x-cls-elu-platform-analytics-body x-cls-data-panel-container'}>
                <Div className={'x-cls-title'}>{t(messages.eluPlatformAnalyticsPageTitle)}</Div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Breadcrumb crumbs={crumbs} onClick={onBreadcrumbChange} />
                    {availableFilters.length > 0 && (
                        <FilterButton
                            isLayoutEdit={editPageLayout}
                            hanldeLayoutEdit={setEditPageLayout}
                            hanldeFilterPanelOpen={setFilterPanelOpen}
                        />
                    )}
                </div>
                <ResponsiveReactGridLayout
                    className="layout"
                    onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
                    {...layoutProperties}
                >
                    <div
                        className="x-cls-dashboard-item  "
                        key={`key-upload-stat-0`}
                        data-grid={{ ...UploadStatProperty.layout, static: false }}
                    >
                        <UploadStatWidget
                            className={'x-cls-upload-stat-widget'}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('UploadStatWidget', loading)}
                        />
                    </div>
                    <div
                        className="x-cls-dashboard-item  "
                        key={`key-upload-chart-1`}
                        data-grid={{ ...UploadChartProperty.layout, static: false }}
                    >
                        <UploadChartWidget
                            className={'x-cls-upload-chart-widget'}
                            title={"ELU's Daily Data Upload"}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            groupingView={ReportingDataView.Daily}
                            isLoading={(loading: boolean) => updateLoadingState('UploadChartWidget', loading)}
                        />
                    </div>

                    <div
                        className="x-cls-dashboard-item  "
                        key={`key-upload-chart-2`}
                        data-grid={{ ...UploadChartProperty.layout, static: false }}
                    >
                        <UploadChartWidget
                            className={'x-cls-upload-chart-widget'}
                            title={"ELU's Weekly Data Upload"}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            groupingView={ReportingDataView.Weekly}
                            isLoading={(loading: boolean) => updateLoadingState('UploadChartWidget', loading)}
                        />
                    </div>
                    <div
                        className="x-cls-dashboard-item  "
                        key={`key-upload-chart-3`}
                        data-grid={{ ...UploadChartProperty.layout, static: false }}
                    >
                        <UploadChartWidget
                            className={'x-cls-upload-chart-widget'}
                            title={"ELU's Monthly Data Upload"}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            groupingView={ReportingDataView.Monthly}
                            isLoading={(loading: boolean) => updateLoadingState('UploadChartWidget', loading)}
                        />
                    </div>
                    <div
                        className="x-cls-dashboard-item  "
                        key={`key-upload-chart-4`}
                        data-grid={{ ...UploadChartProperty.layout, static: false }}
                    >
                        <UploadChartWidget
                            className={'x-cls-upload-chart-widget'}
                            title={"ELU's Annual Data Upload"}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            groupingView={ReportingDataView.Yearly}
                            isLoading={(loading: boolean) => updateLoadingState('UploadChartWidget', loading)}
                        />
                    </div>
                    <div
                        className="x-cls-dashboard-item  "
                        key={`key-upload-chart-5`}
                        data-grid={{ ...UploadChartProperty.layout, static: false }}
                    >
                        <UploadChartWidget
                            className={'x-cls-upload-chart-widget'}
                            title={"ELU's Hourly Data Upload"}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            groupingView={ReportingDataView.Hourly}
                            isLoading={(loading: boolean) => updateLoadingState('UploadChartWidget', loading)}
                        />
                    </div>
                </ResponsiveReactGridLayout>
            </Div>
        </>
    );
});

const Div = styled.div``;

export default EluPlatformAnalytics;

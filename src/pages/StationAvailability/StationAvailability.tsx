/**
 *
 * StationAvailability
 *
 */
import Breadcrumb from 'components/Breadcrumb';
import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { DashboardFilter, DateFilterData, FilterType } from 'components/panels/SideFilterPanel/SideFilterPanel';
import Constant from 'constants/index';
import { FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import moment from 'moment';
import { Page, PageProps } from 'pages';
import { memo, useMemo, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { withSize } from 'react-sizeme';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import styled from 'styled-components/macro';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate, useLocalStorage } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import { SaTableProperty, UptimeDistributionProperty } from 'widgets';
import SaTable from 'widgets/SaTable';
import UptimeDistribution from 'widgets/UptimeDistribution';
import { messages } from './messages';
import { Pages } from 'constants/defaultDateConfig';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import './StationAvailability.scss';

interface StationAvailabilityProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const originalLayouts = {
    lg: [
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-sa-table-0',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 4,
            i: 'key-uptime-distribution-1',
        },
    ],
};

export const StationAvailability: Page<StationAvailabilityProps> = memo((props: StationAvailabilityProps) => {
    // const [plantId] = useQueryParam<string>(FilterNames.plantId, '1', true);
    const { plantId } = useSelector(selectBreadcrumbFilters);
    const { t } = useTranslation();
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const pageFilters = useMemo(() => {
        const START_TIME = moment(getDefaultFilterDate(Pages.StationAvailability));
        return [
            {
                name: FilterNames.dateRange,
                type: FilterType.Date,
                label: 'Date',
                data: {
                    fromTime: moment(START_TIME).subtract(9, 'isoWeek').startOf('day'),
                    toTime: moment(START_TIME).endOf('day'),
                    startDatePlaceholder: 'll',
                    endDatePlaceholder: 'll',
                } as DateFilterData,
            },
            ...(SaTableProperty.defaultFilters || []),
            ...(UptimeDistributionProperty.defaultFilters || []),
        ];
    }, []);

    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: 'SWS',
    };

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.stationAvailabilityPage, originalLayouts);

    const onLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
    };

    const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
    });

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

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

    const crumbs = [
        {
            name: ScreenNames.home,
            label: t('ScreenName.Home'),
            href: '/home',
        },
        {
            name: ScreenNames.stationAvailability,
            label: t('ScreenName.StationAvailability'),
        },
    ];
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
            isDraggable: editPageLayout,
            isResizable: editPageLayout,
            layouts,
            rowHeight: 150,
            useCSSTransforms: true,
        }),
        [layouts, editPageLayout],
    );

    return (
        <>
            <Helmet>
                <title>{t(messages.stationAvailabilityPageTitle)}</title>

                <meta name="description" content="Description of StationAvailability" />
            </Helmet>

            <Div className="x-cls-loader ">{isLoading && <ProgressBar className={'progress'} variant="buffer" />}</Div>

            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={filters}
                    availableFilters={Array.from(availableFilters.values())}
                    defaultFilters={defaultFilters}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                />
            )}
            <Div className={'x-cls-station-availability-body x-cls-data-panel-container'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
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
                    onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
                    {...layoutProperties}
                >
                    <div
                        className="x-cls-dashboard-item  maximize-widget-width"
                        key={`key-sa-table-0`}
                        data-grid={{ ...SaTableProperty.layout, static: false }}
                    >
                        <SaTable
                            className={'x-cls-sa-table-widget'}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('SaTableWidget', loading)}
                        />
                    </div>
                    <div
                        className="x-cls-dashboard-item  maximize-widget-width "
                        key={`key-uptime-distribution-1`}
                        data-grid={{ ...UptimeDistributionProperty.layout, static: false }}
                    >
                        <UptimeDistribution
                            className={'x-cls-uptime-distribution-widget'}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('UptimeDistributionWidget', loading)}
                        />
                    </div>
                </ResponsiveReactGridLayout>
            </Div>
        </>
    );
});

const Div = styled.div``;

export default StationAvailability;

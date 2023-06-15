/**
 *
 * DailyFaultTrends
 *
 */
import Breadcrumb from 'components/Breadcrumb';
import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { DashboardFilter } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import { Page, PageProps } from 'pages';
import { memo, useMemo, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { withSize } from 'react-sizeme';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import styled from 'styled-components/macro';
import { buildAvailableFiltersFromData, buildFiltersFromData } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import { DailyFaultTrendsWidgetProperty } from 'widgets';
import DailyFaultTrendsWidget from 'widgets/DailyFaultTrendsWidget';
import { messages } from './messages';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import './DailyFaultTrends.scss';

interface DailyFaultTrendsProps extends PageProps { }

const GridLayout = withSize()(Responsive);

const pageFilters = [...(DailyFaultTrendsWidgetProperty.defaultFilters || [])];

export const DailyFaultTrends: Page<DailyFaultTrendsProps> = memo((props: DailyFaultTrendsProps) => {
    // const [plantId] = useQueryParam<string>(FilterNames.plantId, '1', true);

    const { plantId } = useSelector(selectBreadcrumbFilters);
    const { t } = useTranslation();
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: 'SWS',
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
    });

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));

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
            name: ScreenNames.dailyFaultTrends,
            label: t('ScreenName.DailyFaultTrends'),
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
            rowHeight: 150,
            useCSSTransforms: true,
        }),
        [],
    );

    return (
        <>
            <Helmet>
                <title>{t(messages.dailyFaultTrendsPageTitle)}</title>

                <meta name="description" content="Description of DailyFaultTrends" />
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
            <Div className={'x-cls-daily-fault-trends-body x-cls-data-panel-container'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Breadcrumb crumbs={crumbs} onClick={onBreadcrumbChange} />
                    {availableFilters.length > 0 && <FilterButton hanldeFilterPanelOpen={setFilterPanelOpen} />}
                </div>
                <Div className="toolbar-section">
                    <Div className="left-section"></Div>

                    <Div className="right-section"></Div>
                </Div>
                <GridLayout style={{ height: '100%' }} className="layout" /* onSize={onSize} */ {...layoutProperties}>
                    <div
                        className="x-cls-dashboard-item maximize-widget "
                        key={`key-daily-fault-trends-widget-0`}
                        data-grid={{ ...DailyFaultTrendsWidgetProperty.layout, static: true }}
                    >
                        <DailyFaultTrendsWidget
                            className={'x-cls-daily-fault-trends-widget-widget'}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('CarBodyDurationWidgetWidget', loading)}
                        />
                    </div>
                </GridLayout>
            </Div>
        </>
    );
});

const Div = styled.div``;

export default DailyFaultTrends;

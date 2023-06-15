/**
 *
 * CarbodyRiskAnalysis
 *
 */

import Breadcrumb from 'components/Breadcrumb';
import { DashboardFilter } from 'components/panels/SideFilterPanel/SideFilterPanel';
import Constant from 'constants/index';
import { FilterNames, Filters /*, SidePanelOpenState */, LoadingValue, ScreenNames } from 'models';
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
import { buildAvailableFiltersFromData, buildFiltersFromData, useLocalStorage, useQueryParam } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import { CarBodyGraphProperty, CarbodyRiskTableProperty } from 'widgets';
import CarBodyGraph from 'widgets/CarBody/CarBodyGraph';
import CarbodyRiskTable from 'widgets/CarbodyRiskTable';
import { messages } from './messages';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import './CarbodyRiskAnalysis.scss';

import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';

interface CarbodyRiskAnalysisProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true, monitorWidth: true })(Responsive);
const pageFilters = [
    ...(CarBodyGraphProperty.defaultFilters || []),
    ...(CarbodyRiskTableProperty.defaultFilters || []),
];

const originalLayouts = {
    lg: [
        {
            w: 4,
            h: 2,
            x: 0,
            y: 0,
            i: 'key-car-body-graph-0',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 2,
            i: 'key-carbody-risk-table-1',
        },
    ],
};

export const CarbodyRiskAnalysis: Page<CarbodyRiskAnalysisProps> = memo((props: CarbodyRiskAnalysisProps) => {
    // const [plantId] = useQueryParam<string>(FilterNames.plantId, '1',true);

    const { plantId } = useSelector(selectBreadcrumbFilters);
    const [projectId] = useQueryParam<string>(FilterNames.projectId, '1', true);
    const { t, i18n } = useTranslation();
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        [FilterNames.projectId]: projectId,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: 'SWS',
        [FilterNames.carbodyId]: '0',
        [FilterNames.studId]: '',
        [FilterNames.view]: 'voltage',
        [FilterNames.weldId]: '',
        [FilterNames.fromTime]: moment(`2021-07-28 04:25:47`),
        [FilterNames.toTime]: moment(`2021-07-28 05:25:47`),
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
    });

    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.carbodyRiskAnalysisPage, originalLayouts);
    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);

    const onLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
    };

    const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    // const onFilterChange = (filter: Filters) => {
    //     const { carBody, studId, ...rest } = filter;
    //     setFilters({ ...filters, ...rest });
    // };

    const onFilterChange = (filter: Filters) => {
        const { carBody, studId, ...rest } = filter;
        changeFilters({ ...filters, ...rest });
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
            name: ScreenNames.carBodyRisk,
            label: t('ScreenName.CarBodyRisk'),
        },
        {
            label: `${moment(filters.fromTime).format('DD-MMM-YYYY hh:mm a')} - ${moment(filters.toTime).format(
                'DD-MMM-YYYY hh:mm a',
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
            rowHeight: 200,
            useCSSTransforms: true,
        }),
        [layouts, editPageLayout],
    );

    return (
        <>
            <Helmet>
                <title>{t(messages.carbodyRiskAnalysisPageTitle)}</title>

                <meta name="description" content="Description of CarbodyRiskAnalysis" />
            </Helmet>
            <Div className="x-cls-loader ">{isLoading && <ProgressBar className={'progress'} variant="buffer" />}</Div>

            <DashboardFilterPanel
                filters={filters}
                availableFilters={Array.from(availableFilters.values())}
                defaultFilters={defaultFilters}
                open={filterPanelOpen}
                setOpen={() => setFilterPanelOpen(false)}
                onFilterChange={onFilterChange}
            />
            <Div className={'x-cls-carbody-risk-analysis-body x-cls-data-panel-container'}>
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
                        className="x-cls-dashboard-item w99 "
                        key={`key-car-body-graph-0`}
                    // data-grid={{ ...CarBodyGraphProperty.layout, static: false }}
                    >
                        <CarBodyGraph
                            className={'x-cls-car-body-graph-widget'}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('CarBodyGraphWidget', loading)}
                        />
                    </div>
                    <div
                        className="x-cls-dashboard-item maximize-widget-width "
                        key={`key-carbody-risk-table-1`}
                    // data-grid={{ ...CarbodyRiskTableProperty.layout, static: false }}
                    >
                        <CarbodyRiskTable
                            className={'x-cls-carbody-risk-table-widget'}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('CarbodyRiskTableWidget', loading)}
                        />
                    </div>
                </ResponsiveReactGridLayout>
            </Div>
        </>
    );
});

const Div = styled.div``;

export default CarbodyRiskAnalysis;

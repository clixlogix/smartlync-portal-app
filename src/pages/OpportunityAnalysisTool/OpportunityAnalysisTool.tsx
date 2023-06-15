/**
 *
 * OpportunityAnalysisTool
 *
 */
import Breadcrumb from 'components/Breadcrumb';
import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { DashboardFilter, DateFilterData, FilterType } from 'components/panels/SideFilterPanel/SideFilterPanel';
import Constant, { API_REQUEST_DATE_FORMAT } from 'constants/index';
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
import { OpportunityAnalysisProperty } from 'widgets';
import OpportunityAnalysis from 'widgets/OpportunityAnalysis';
import { messages } from './messages';
import { Pages } from 'constants/defaultDateConfig';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import './OpportunityAnalysisTool.scss';

interface OpportunityAnalysisToolProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const originalLayouts = {
    lg: [
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-opportunity-analysis-0',
        },
    ],
};

export const OpportunityAnalysisTool: Page<OpportunityAnalysisToolProps> = memo(
    (props: OpportunityAnalysisToolProps) => {
        // const [plantId] = useQueryParam<string>(FilterNames.plantId, '1', true);
        const { plantId } = useSelector(selectBreadcrumbFilters);
        const { t /* , i18n */ } = useTranslation();
        const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

        const pageFilters = useMemo(() => {
            const START_TIME = moment(getDefaultFilterDate(Pages.OpportunityAnalysis));
            return [
                ...(OpportunityAnalysisProperty.defaultFilters || []),
                {
                    name: FilterNames.dateRange,
                    type: FilterType.Date,
                    data: {
                        fromTime: moment(START_TIME).subtract(6, 'month').startOf('day'),
                        toTime: moment(START_TIME).endOf('day'),
                        startDatePlaceholder: 'll',
                        endDatePlaceholder: 'll',
                    } as DateFilterData,
                },
            ];
        }, []);

        const defaultFilters = {
            [FilterNames.plantId]: plantId,
            ...buildFiltersFromData(pageFilters),
            // add your default filters for this page here ...
            [FilterNames.systemType]: 'SWS',
            [FilterNames.carbodyId]: '0',
        };

        const { apiFilters, localFilters, changeFilters } = useFilters({
            defaultFilters: {
                ...defaultFilters,
            },
        });

        const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
        const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
        const [layouts, setLayouts] = useLocalStorage<any>(
            Constant.storageKeys.opportunityAnalysisToolPage,
            originalLayouts,
        );

        const onLayoutChange = (layout, layouts) => {
            setLayouts(layouts);
        };

        const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));

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
                name: ScreenNames.opportunityAnalysis,
                label: t('ScreenName.OpportunityAnalysis'),
            },
            {
                name: `dateRange`,
                label: `Date Range: ${filters.fromTime.format(API_REQUEST_DATE_FORMAT)} - ${filters.toTime.format(
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
                    <title>{t(messages.opportunityAnalysisToolPageTitle)}</title>

                    <meta name="description" content="Description of OpportunityAnalysisTool" />
                </Helmet>
                <Div className="x-cls-loader ">
                    {isLoading && <ProgressBar className={'progress'} variant="buffer" />}
                </Div>
                <DashboardFilterPanel
                    filters={filters}
                    availableFilters={Array.from(availableFilters.values())}
                    defaultFilters={defaultFilters}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                />
                <Div className={'x-cls-opportunity-analysis-tool-body x-cls-data-panel-container'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <Breadcrumb crumbs={crumbs} onClick={onBreadcrumbChange} />

                        {availableFilters.length > 0 && (
                            <FilterButton
                                isEdit={false}
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
                            className="x-cls-dashboard-item maximize-widget "
                            key={`key-opportunity-analysis-0`}
                            data-grid={{ ...OpportunityAnalysisProperty.layout, static: true }}
                        >
                            <OpportunityAnalysis
                                className={'x-cls-opportunity-analysis-widget'}
                                filters={filters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) =>
                                    updateLoadingState('OpportunityAnalysisWidget', loading)
                                }
                            />
                        </div>
                    </ResponsiveReactGridLayout>
                </Div>
            </>
        );
    },
);

const Div = styled.div``;

export default OpportunityAnalysisTool;

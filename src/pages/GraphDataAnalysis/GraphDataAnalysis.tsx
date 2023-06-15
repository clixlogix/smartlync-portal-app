/**
 *
 * GraphDataAnalysis
 *
 */

import Breadcrumb from 'components/Breadcrumb';
import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import { ChartRef } from 'components/panels/Chart/Chart';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { DashboardFilter } from 'components/panels/SideFilterPanel/SideFilterPanel';
import Constant from 'constants/index';
import { FilterNames, Filters, GraphicDatas, LoadingValue, ScreenNames } from 'models';
import { Page, PageProps } from 'pages';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { withSize } from 'react-sizeme';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { graphicDataActions, graphicDataKey, graphicDataReducer } from 'services/graphic-data/graphic-data-reducer';
import { selectGraphicDatas } from 'services/graphic-data/graphic-data-selectors';
import { getAllGraphicDatasSaga } from 'services/graphic-data/sagas/graphic-data-saga-get-all';
import styled from 'styled-components/macro';
import { buildAvailableFiltersFromData, buildFiltersFromData, useLocalStorage } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { TaTableProperty } from 'widgets';
import GraphicData from 'widgets/GraphicData';
import { GraphicDataSeries } from 'widgets/GraphicData/GraphicData';
import VarianceAnalysis from 'widgets/VarianceAnalysis';
import { VarianceSeries } from 'widgets/VarianceAnalysis/VarianceAnalysis';
import { messages } from './messages';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import './GraphDataAnalysis.scss';

interface GraphDataAnalysisProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const pageFilters = [...(TaTableProperty.defaultFilters || [])];

const originalLayouts = {};

export const GraphDataAnalysis: Page<GraphDataAnalysisProps> = memo((props: GraphDataAnalysisProps) => {
    useInjectReducer({ key: graphicDataKey, reducer: graphicDataReducer });

    useInjectSaga({ key: graphicDataKey, saga: getAllGraphicDatasSaga });
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    const { plantId } = useSelector(selectBreadcrumbFilters);

    const { t } = useTranslation();
    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: 'SWS',
        [FilterNames.fromTime]: '2021-09-06T00:00:00+0000', // temporary send only 1 particular day
    };

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.failureRateTrendPage, originalLayouts);

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
    });

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const graphicDatas: GraphicDatas | undefined = useSelector(selectGraphicDatas);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(graphicDataActions.getAllGraphicDatas(apiFilters));
    }, [dispatch, apiFilters]);

    const { lift, voltage, current, variances } = useMemo(() => {
        const formattedData = (graphicDatas || []).reduce(
            (acc, { graphData: { Lift_Position, Voltage, Current }, variance1, variance2, studId, ...rest }) => {
                acc.lift.push({
                    type: 'spline',
                    studId,
                    data: Lift_Position?.GraphicData,
                    pointInterval: Lift_Position?.sample_time / 1000 || 1.2,
                    ...rest,
                });
                acc.voltage.push({
                    type: 'spline',
                    studId,
                    data: Voltage?.GraphicData,
                    pointInterval: Voltage?.sample_time / 1000 || 0.5,
                    ...rest,
                });
                acc.current.push({
                    type: 'spline',
                    studId,
                    data: Current?.GraphicData,
                    pointInterval: Current?.sample_time / 1000 || 0.5,
                    ...rest,
                });
                acc.variances.push({
                    type: 'scatter',
                    name: studId,
                    data: [{ x: +variance1, y: +variance2 }],
                });

                return acc;
            },
            {
                lift: [] as GraphicDataSeries[],
                voltage: [] as GraphicDataSeries[],
                current: [] as GraphicDataSeries[],
                variances: [] as VarianceSeries[],
            },
        );

        return formattedData;
    }, [graphicDatas]);

    const onLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
    };

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
            name: ScreenNames.paretoAnalysis,
            label: t('ScreenName.ParetoAnalysis'),
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
            isDraggable: editPageLayout,
            isResizable: editPageLayout,
            rowHeight: 120,
            layouts,
            useCSSTransforms: true,
        }),
        [layouts, editPageLayout],
    );

    const [refs, setRefs] = useState<ChartRef[]>([]);

    const getRef = useCallback(
        (newRef: ChartRef) => {
            setRefs([...refs, newRef]);
        },
        [refs],
    );

    return (
        <>
            <Helmet>
                <title>{t(messages.graphDataAnalysisPageTitle)}</title>

                <meta name="description" content="Description of GraphDataAnalysis" />
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

            <Div className={'x-cls-graph-data-analysis-body x-cls-data-panel-container'}>
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
                        className="x-cls-dashboard-item maximize-widget-width"
                        key={`1`}
                        data-grid={{ x: 0, y: 0, w: 3, h: 6, static: true }}
                    >
                        <GraphicData
                            current={current}
                            lift={lift}
                            voltage={voltage}
                            refs={refs}
                            getRef={getRef}
                            isLoading={(loading: boolean) => updateLoadingState('GraphicDataWidget', loading)}
                        />
                    </div>
                    <div
                        className="x-cls-dashboard-item maximize-widget-width"
                        key={`2`}
                        data-grid={{ x: 0, y: 0, w: 3, h: 3, static: true }}
                    >
                        <VarianceAnalysis
                            variances={variances}
                            isLoading={(loading: boolean) => updateLoadingState('VarianceAnalysisWidget', loading)}
                        />
                    </div>
                </ResponsiveReactGridLayout>
            </Div>
        </>
    );
});

const Div = styled.div``;

export default GraphDataAnalysis;

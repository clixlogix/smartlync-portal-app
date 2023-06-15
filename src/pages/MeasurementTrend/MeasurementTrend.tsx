/**
 *
 * MeasurementTrend
 *
 */

import Breadcrumb from 'components/Breadcrumb';
import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import { ChartRef } from 'components/panels/Chart/Chart';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import {
    DashboardFilter,
    DateFilterData,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import Constant from 'constants/index';
import { SystemType } from 'constants/staticValues';
import { AggregateType, FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import moment from 'moment';
import { Page, PageProps } from 'pages';
import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import { memo, useCallback, useMemo, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { withSize } from 'react-sizeme';
import 'scss/main.scss';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectDropTimeMeasurementTrendFilterValues } from 'services/drop-time-measurement-trend/drop-time-measurement-trend-selectors';
import { selectLiftingHeightMeasurementTrendFilterValues } from 'services/lifting-height-measurement-trend/lifting-height-measurement-trend-selectors';
import { selectPenetrationMeasurementTrendFilterValues } from 'services/penetration-measurement-trend/penetration-measurement-trend-selectors';
import { selectStudProjectionMeasurementTrendFilterValues } from 'services/stud-projection-measurement-trend/stud-projection-measurement-trend-selectors';
import { selectWeldingTimeMeasurementTrendFilterValues } from 'services/welding-time-measurement-trend/welding-time-measurement-trend-selectors';
import styled from 'styled-components/macro';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate, useLocalStorage } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import {
    DropTimeMeasurementTrendProperty,
    LiftingHeightMeasurementTrendProperty,
    PenetrationMeasurementTrendProperty,
    StudProjectionMeasurementTrendProperty,
    WeldingTimeMeasurementTrendProperty,
} from 'widgets';
import DropTimeMeasurementTrend from 'widgets/DropTimeMeasurementTrend/Loadable';
import LiftingHeightMeasurementTrend from 'widgets/LiftingHeightMeasurementTrend/Loadable';
import PenetrationMeasurementTrend from 'widgets/PenetrationMeasurementTrend/Loadable';
import StudProjectionMeasurementTrend from 'widgets/StudProjectionMeasurementTrend/Loadable';
import WeldingTimeMeasurementTrend from 'widgets/WeldingTimeMeasurementTrend/Loadable';
import './MeasurementTrend.scss';
import { messages } from './messages';
import { Pages } from 'constants/defaultDateConfig';

interface MeasurementTrendProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const originalLayouts = {
    lg: [
        {
            x: 0,
            y: 0,
            w: 4,
            h: 2,
            i: 'key-faultRateMeasurementTrend',
        },
        {
            x: 0,
            y: 2,
            w: 4,
            h: 2,
            i: 'key-wopRateMeasurementTrend',
        },
        {
            x: 0,
            y: 4,
            w: 4,
            h: 2,
            i: 'key-weldingTimeMeasurementTrend',
        },
        {
            x: 0,
            y: 6,
            w: 4,
            h: 2,
            i: 'key-penetrationMeasurementTrend',
        },
        {
            x: 0,
            y: 8,
            w: 4,
            h: 2,
            i: 'key-studProjectionMeasurementTrend',
        },
        {
            x: 0,
            y: 10,
            w: 4,
            h: 2,
            i: 'key-liftingHeightMeasurementTrend',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 4,
            i: 'key-dropTimeMeasurementTrend',
        },
    ],
};

const listOfLocalFilters = [FilterNames.feederNo, FilterNames.outletNo];

export const MeasurementTrend: Page<MeasurementTrendProps> = memo((props: MeasurementTrendProps) => {
    const { t } = useTranslation();
    // const [plantId] = useQueryParam<string>(FilterNames.plantId, '1', true);
    const { plantId } = useSelector(selectBreadcrumbFilters);
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const pageFilters = useMemo(() => {
        const START_TIME = moment(getDefaultFilterDate(Pages.MeasurementTrend));
        return [
            {
                name: FilterNames.dateRange,
                type: FilterType.Date,
                data: {
                    fromTime: moment(START_TIME).subtract(3, 'day').startOf('day'),
                    toTime: moment(START_TIME).endOf('day'),
                    startDatePlaceholder: 'll',
                    endDatePlaceholder: 'll',
                    maxDate: moment(START_TIME),
                    minDate: moment(START_TIME).subtract(1, 'month'),
                } as DateFilterData,
            },
            ...(PenetrationMeasurementTrendProperty.defaultFilters || []),
            ...(LiftingHeightMeasurementTrendProperty.defaultFilters || []),
            ...(StudProjectionMeasurementTrendProperty.defaultFilters || []),
            ...(WeldingTimeMeasurementTrendProperty.defaultFilters || []),
            ...(DropTimeMeasurementTrendProperty.defaultFilters || []),
        ];
    }, []);

    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        [FilterNames.eventType]: 'Fault',
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: SystemType.SWS,
        [FilterNames.aggregateNeeded]: true,
        [FilterNames.groupBy]: undefined,
        [FilterNames.station]: 'Z8.3_020',
        [FilterNames.carTypeId]: '0',
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
        listOfLocalFilters,
    });
    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const [availableFiltersFromData] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.measurementTrendPage, originalLayouts);

    // const availableFilters = [...availableFiltersFromData];

    const onFilterChange = (filter: Filters) => {
        changeFilters(filter);
    };

    const [loadingState, setLoadingState] = useState<LoadingValue>({});
    const updateLoadingState = (key: string, loading: boolean) => {
        loadingState[key] = loading;
        setLoadingState(loadingState);
    };

    const availableFilters = useMemo(() => {
        return [
            ...availableFiltersFromData,
            {
                name: FilterNames.aggregateType,
                label: 'Filters.AggregateType',
                type: FilterType.Select,
                multiple: false,
                disabled: filters.aggregateNeeded === true ? false : true,
                data: {
                    options: [
                        AggregateType.count,
                        AggregateType.min,
                        AggregateType.max,
                        AggregateType.median,
                        AggregateType.stddev,
                    ],
                } as SelectFilterData,
            },
        ];
    }, [availableFiltersFromData, filters.aggregateNeeded]);

    const isLoading: boolean = useMemo(() => {
        return [
            ...Object.values(loadingState),
            // add your isLoading here
        ].reduce((acc: boolean, value: boolean) => {
            acc = acc ? acc : value;
            return acc;
        }, false);
    }, [
        loadingState,
        // add your other Widget isLoading code here
        // measurementTrendIsLoading,
    ]);

    const onLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
    };

    const crumbs = [
        {
            name: ScreenNames.home,
            label: t('ScreenName.Home'),
            href: '/home',
        },
        {
            name: ScreenNames.measurementTrends,
            label: t('ScreenName.MeasurementTrends'),
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
            cols: { lg: 4, md: 4, sm: 1, xs: 1, xxs: 1 },
            autoSize: true,
            isDraggable: editPageLayout,
            isResizable: editPageLayout,
            rowHeight: 150,
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
                <title>{t(messages.measurementTrendPageTitle)}</title>
                <meta name="description" content="Description of MeasurementTrend" />
            </Helmet>
            <Div className="x-cls-loader ">{isLoading && <ProgressBar className={'progress'} variant="buffer" />}</Div>

            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={{ ...apiFilters, ...localFilters }}
                    availableFilters={availableFilters}
                    defaultFilters={defaultFilters}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                    filterValues={() => {
                        const filterValues = [
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectWeldingTimeMeasurementTrendFilterValues),
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectPenetrationMeasurementTrendFilterValues),
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectStudProjectionMeasurementTrendFilterValues),
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectLiftingHeightMeasurementTrendFilterValues),
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectDropTimeMeasurementTrendFilterValues),
                        ].reduce((acc, filters) => {
                            acc = { ...acc, ...filters };
                            return acc;
                        }, {} as any);

                        return filterValues;
                    }}
                />
            )}
            <Div className={'x-cls-measurement-trend-body x-cls-data-panel-container'}>
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
                    {/* <Div
                            className="x-cls-faultRateMeasurementTrend maximize-widget-width"
                            key={`key-faultRateMeasurementTrend`}
                            data-grid={{
                                preventCollision: true,
                                // ...PenetrationProperty.layout,
                                x: 0,
                                y: 0,
                                w: 4,
                                h: 2,
                            }}
                        >
                            <FaultRateMeasurementTrendWidget
                                className="x-cls-ta-analysis-table"
                                localFilters={localFilters}
                                filters={filters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) =>
                                    updateLoadingState('FaultRateMeasurementTrendWidget', loading)
                                }
                            />
                        </Div> */}
                    {/* <Div
                            className="x-cls-wopRateMeasurementTrend maximize-widget-width"
                            key={`key-wopRateMeasurementTrend`}
                            data-grid={{
                                preventCollision: true,
                                // ...EventCodeFrequencyProperty.layout,
                                x: 0,
                                y: 2,
                                w: 4,
                                h: 2,
                            }}
                        >
                            <WopRateMeasurementTrend
                                className="x-cls-ta-analysis-table"
                                localFilters={localFilters}
                                filters={filters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) => updateLoadingState('WopRateMeasurementTrend', loading)}
                            />
                        </Div> */}
                    <Div
                        className="x-cls-WeldingTimeMeasurementTrend maximize-widget-width"
                        key={`key-weldingTimeMeasurementTrend`}
                        data-grid={{
                            preventCollision: true,
                            // ...EventCodeFrequencyProperty.layout,
                            x: 0,
                            y: 4,
                            w: 4,
                            h: 2,
                        }}
                    >
                        <WeldingTimeMeasurementTrend
                            className="x-cls-ta-analysis-table"
                            localFilters={localFilters}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) =>
                                updateLoadingState('WeldingTime measurement Trend', loading)
                            }
                            getRef={getRef}
                            refs={refs}
                        />
                    </Div>
                    <Div
                        className="x-cls-penetrationMeasurementTrend maximize-widget-width"
                        key={`key-penetrationMeasurementTrend`}
                        data-grid={{
                            preventCollision: true,
                            // ...EventCodeFrequencyProperty.layout,
                            x: 0,
                            y: 6,
                            w: 4,
                            h: 2,
                        }}
                    >
                        <PenetrationMeasurementTrend
                            className="x-cls-ta-analysis-table"
                            localFilters={localFilters}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('PenetrationMeasurementTrend', loading)}
                            getRef={getRef}
                            refs={refs}
                        />
                    </Div>
                    <Div
                        className="x-cls-studProjectionMeasurementTrend maximize-widget-width"
                        key={`key-studProjectionMeasurementTrend`}
                        data-grid={{
                            preventCollision: true,
                            // ...EventCodeFrequencyProperty.layout,
                            x: 0,
                            y: 8,
                            w: 4,
                            h: 2,
                        }}
                    >
                        <StudProjectionMeasurementTrend
                            className="x-cls-ta-analysis-table"
                            localFilters={localFilters}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) =>
                                updateLoadingState('LiftingHeightMeasurementTrend', loading)
                            }
                            getRef={getRef}
                            refs={refs}
                        />
                    </Div>
                    <Div
                        className="x-cls-liftingHeightMeasurementTrend maximize-widget-width"
                        key={`key-liftingHeightMeasurementTrend`}
                        data-grid={{
                            preventCollision: true,
                            // ...EventCodeFrequencyProperty.layout,
                            x: 0,
                            y: 10,
                            w: 4,
                            h: 2,
                        }}
                    >
                        <LiftingHeightMeasurementTrend
                            className="x-cls-ta-analysis-table"
                            localFilters={localFilters}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) =>
                                updateLoadingState('LiftingHeightMeasurementTrend', loading)
                            }
                            getRef={getRef}
                            refs={refs}
                        />
                    </Div>
                    <Div
                        className="x-cls-dropTimeMeasurementTrend maximize-widget-width"
                        key={`key-dropTimeMeasurementTrend`}
                        data-grid={{
                            preventCollision: true,
                            // ...EventCodeFrequencyProperty.layout,
                            x: 0,
                            y: 12,
                            w: 4,
                            h: 2,
                        }}
                    >
                        <DropTimeMeasurementTrend
                            className="x-cls-ta-analysis-table"
                            localFilters={apiFilters}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('DropTimeMeasurementTrend', loading)}
                            getRef={getRef}
                            refs={refs}
                        />
                    </Div>
                </ResponsiveReactGridLayout>
            </Div>
        </>
    );
});

const Div = styled.div``;

export default MeasurementTrend;

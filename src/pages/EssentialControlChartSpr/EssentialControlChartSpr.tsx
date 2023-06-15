/**
 *
 * EssentialControlChart
 *
 */
import React, { useState, memo, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Responsive } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import { useLocalStorage } from 'utils';
import { useSelector } from 'react-redux';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import Constant from 'constants/index';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import {
    DashboardFilter,
    FilterType,
    SelectFilterData,
    DateFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { Filters, LoadingValue, FilterNames, CarTypes, ScreenNames } from 'models';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { Page, PageProps } from 'pages';

import { messages } from './messages';
import { LiftSpr } from 'widgets/SPR/LiftSpr/Loadable';
import { PenetrationSpr } from 'widgets/SPR/PenetrationSpr/Loadable';
import { Voltage } from 'widgets/ControlCharts/Voltage/Loadable';
import { WeldTimeSpr } from 'widgets/SPR/WeldTimeSpr/Loadable';
import { selectLiftFilterValues } from 'services/lift/lift-selectors';
import { selectPenetrationFilterValues } from 'services/penetration/penetration-selectors';
import { selectVoltageFilterValues } from 'services/voltage/voltage-selectors';
import { selectWeldFilterValues } from 'services/weld-time/weld-time-selectors';
import { LiftProperty, PenetrationProperty, VoltageProperty, WeldTimeProperty } from 'widgets';
import { SystemType } from 'constants/staticValues';
import { ChartRef } from 'components/panels/Chart/Chart';
import { selectLines } from 'services/line/line-selectors';
import { useFilters } from 'utils/hooks/use-filters';
import { useQueryParam } from 'utils';
import moment from 'moment';
import { Pages } from 'constants/defaultDateConfig';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import './EssentialControlChartSpr.scss';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { FilterButton } from 'components/FilterButton/FilterButton';

interface EssentialControlChartSprProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const originalLayouts = {
    lg: [
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-control-chart-lift',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 4,
            i: 'key-control-chart-penetration',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 4,
            i: 'key-control-chart-voltage',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 4,
            i: 'key-control-chart-weldtime',
        },
    ],
};

const listOfLocalFilters = [FilterNames.week];

export const EssentialControlChartSpr: Page<EssentialControlChartSprProps> = memo(
    (props: EssentialControlChartSprProps) => {
        const { t } = useTranslation();
        const [plantId] = useQueryParam<string>('plantId', '1', true);
        const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

        const pageFilters = useMemo(() => {
            const START_TIME = moment(getDefaultFilterDate(Pages.EssentialControls));
            return [
                {
                    name: FilterNames.dateRange,
                    type: FilterType.Date,
                    data: {
                        fromTime: moment(START_TIME).subtract(9, 'isoWeek').startOf('day'),
                        toTime: moment(START_TIME).endOf('day'),
                        startDatePlaceholder: 'll',
                        endDatePlaceholder: 'll',
                    } as DateFilterData,
                },
                ...(LiftProperty.defaultFilters || []),
                ...(PenetrationProperty.defaultFilters || []),
                ...(VoltageProperty.defaultFilters || []),
                ...(WeldTimeProperty.defaultFilters || []),
            ];
        }, []);

        const defaultFilters = {
            [FilterNames.plantId]: plantId,
            ...buildFiltersFromData(pageFilters),
            // add your default filters for this page here ...
            [FilterNames.systemType]: SystemType.SWS,
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
        const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };
        const [layouts, setLayouts] = useLocalStorage<any>(
            Constant.storageKeys.essentialControlChartPage,
            originalLayouts,
        );
        const lineOptions = useSelector(selectLines);

        const availableFilters = [
            ...availableFiltersFromData,
            {
                name: FilterNames.deviceLine,
                type: FilterType.Select,
                data: { options: lineOptions || [] } as SelectFilterData,
            },
        ];

        const onFilterChange = (filter: Filters) => {
            changeFilters(filter);
        };

        const [loadingState, setLoadingState] = useState<LoadingValue>({});
        const updateLoadingState = (key: string, loading: boolean) => {
            loadingState[key] = loading;
            setLoadingState(loadingState);
        };

        // const isLoading: boolean = useMemo(() => {
        //     return [
        //         ...Object.values(loadingState),
        //         // add your isLoading here
        //     ].reduce((acc: boolean, value: boolean) => {
        //         acc = acc ? acc : value;
        //         return acc;
        //     }, false);
        // }, [
        //     loadingState,
        //     // add your other Widget isLoading code here
        // ]);

        const crumbs: BreadcrumbLinks = useMemo(() => {
            const retVal = [
                {
                    name: ScreenNames.home,
                    label: t('ScreenName.Home'),
                    href: '/home',
                },
                {
                    name: ScreenNames.essentialControlCharts,
                    label: t('ScreenName.EssentialControlCharts'),
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

        const onChartClick = (chart: string, event) => { };

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
                    <title>{t(messages.essentialControlChartPageTitle)}</title>
                    <meta name="description" content="Description of EssentialControlChart" />
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
                                useSelector(selectLiftFilterValues),
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useSelector(selectPenetrationFilterValues),
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useSelector(selectVoltageFilterValues),
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useSelector(selectWeldFilterValues),
                            ].reduce((acc, filters) => {
                                acc = { ...acc, ...filters };
                                return acc;
                            }, {} as any);

                            return filterValues;
                        }}
                    />
                )}
                <div className="x-cls-essential-control-chart-spr-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
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
                    </div>

                    <ResponsiveReactGridLayout
                        onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
                        {...layoutProperties}
                    >
                        <div
                            className="maximize-widget-width"
                            key={`key-control-chart-penetration`}
                            data-grid={{
                                preventCollision: true,
                                // ...PenetrationProperty.layout,
                                x: 0,
                                y: 2,
                                w: 2,
                                h: 2,
                            }}
                        >
                            <PenetrationSpr
                                filters={filters}
                                localFilters={localFilters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) => updateLoadingState('Penetration', loading)}
                                onClick={(event) => onChartClick('Penetration', event)}
                                getRef={getRef}
                                refs={refs}
                            />
                        </div>
                        <div
                            className="maximize-widget-width"
                            key={`key-control-chart-lift`}
                            data-grid={{
                                preventCollision: true,
                                // ...LiftProperty.layout,
                                x: 0,
                                y: 0,
                                w: 2,
                                h: 2,
                            }}
                        >
                            <LiftSpr
                                filters={filters}
                                localFilters={localFilters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) => updateLoadingState('Lift', loading)}
                                onClick={(event) => onChartClick('Lift', event)}
                                getRef={getRef}
                                refs={refs}
                            />
                        </div>
                        <div
                            className="maximize-widget-width"
                            key={`key-control-chart-voltage`}
                            data-grid={{
                                preventCollision: true,
                                // ...VoltageProperty.layout,
                                x: 0,
                                y: 4,
                                w: 2,
                                h: 2,
                            }}
                        >
                            <Voltage
                                filters={filters}
                                localFilters={localFilters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) => updateLoadingState('Voltage', loading)}
                                onClick={(event) => onChartClick('Voltage', event)}
                                getRef={getRef}
                                refs={refs}
                            />
                        </div>
                        <div
                            className="maximize-widget-width"
                            key={`key-control-chart-weldtime`}
                            data-grid={{
                                preventCollision: true,
                                // ...WeldTimeProperty.layout,
                                x: 0,
                                y: 6,
                                w: 2,
                                h: 2,
                            }}
                        >
                            <WeldTimeSpr
                                filters={filters}
                                localFilters={localFilters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) => updateLoadingState('WeldTime', loading)}
                                onClick={(event) => onChartClick('WeldTime', event)}
                                getRef={getRef}
                                refs={refs}
                            />
                        </div>
                    </ResponsiveReactGridLayout>
                </div>
            </>
        );
    },
);

export default EssentialControlChartSpr;

/**
 *
 * CycleMeasurementCombo
 *
 */
import Breadcrumb from 'components/Breadcrumb';
import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import { ChartRef } from 'components/panels/Chart/Chart';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { DashboardFilter, DateFilterData, FilterType } from 'components/panels/SideFilterPanel/SideFilterPanel';
import Constant from 'constants/index';
import { SystemType } from 'constants/staticValues';
import { CarTypes, FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
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
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import styled from 'styled-components/macro';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate, useLocalStorage } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import {
    CycleGapProperty,
    DropTimeMeasurementTrendProperty,
    FaultRateMeasurementTrendProperty,
    LiftingHeightMeasurementTrendProperty,
    PenetrationMeasurementTrendProperty,
    StudProjectionMeasurementTrendProperty,
    WeldingTimeMeasurementTrendProperty,
    WopRateMeasurementTrendProperty,
} from 'widgets';
import CycleGap from 'widgets/CycleGap';
import DropTimeMeasurementTrend from 'widgets/DropTimeMeasurementTrend';
import LiftingHeightMeasurementTrend from 'widgets/LiftingHeightMeasurementTrend';
import PenetrationMeasurementTrend from 'widgets/PenetrationMeasurementTrend';
import StudProjectionMeasurementTrend from 'widgets/StudProjectionMeasurementTrend';
import WeldingTimeMeasurementTrend from 'widgets/WeldingTimeMeasurementTrend';
import './CycleMeasurementCombo.scss';
import { messages } from './messages';
import { Pages } from 'constants/defaultDateConfig';

interface CycleMeasurementComboProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const originalLayouts = {
    lg: [
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-fault-rate-measurement-trend-0',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-wop-rate-measurement-trend-1',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-welding-time-measurement-trend-2',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-penetration-measurement-trend-3',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-stud-projection-measurement-trend-4',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-lifting-height-measurement-trend-5',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-drop-time-measurement-trend-6',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-cycle-gap-7',
        },
    ],
};

const listOfLocalFilters = [];

export const CycleMeasurementCombo: Page<CycleMeasurementComboProps> = memo((props: CycleMeasurementComboProps) => {
    //useInjectReducer({ key: rulesPanelKey, reducer: rulesPanelReducer });
    // const [plantId] = useQueryParam<string>(FilterNames.plantId, '1', true);

    const { plantId } = useSelector(selectBreadcrumbFilters);

    // const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };

    const pageFilters = useMemo(() => {
        const START_TIME = moment(getDefaultFilterDate(Pages.CycleMeasurementCombo));
        return [
            {
                name: FilterNames.singleDate,
                type: FilterType.Select,
                data: {
                    fromTime: moment(START_TIME).subtract(1, 'day').startOf('day'),
                    toTime: moment(START_TIME).endOf('day'),
                } as DateFilterData,
            },
            ...(FaultRateMeasurementTrendProperty.defaultFilters || []),
            ...(WopRateMeasurementTrendProperty.defaultFilters || []),
            ...(WeldingTimeMeasurementTrendProperty.defaultFilters || []),
            ...(PenetrationMeasurementTrendProperty.defaultFilters || []),
            ...(StudProjectionMeasurementTrendProperty.defaultFilters || []),
            ...(LiftingHeightMeasurementTrendProperty.defaultFilters || []),
            ...(DropTimeMeasurementTrendProperty.defaultFilters || []),
            ...(CycleGapProperty.defaultFilters || []),
        ];
    }, []);

    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...\
        [FilterNames.carTypeId]: '0',
        [FilterNames.systemType]: SystemType.SWS,
    };

    // const { apiFilters, localFilters, changeFilters } = useFilters({
    //     defaultFilters: {
    //         ...defaultFilters,
    //     },
    //     // listOfLocalFilters,
    // });

    const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);

    const { localFilters, apiFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
        listOfLocalFilters,
    });

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.cycleMeasurementComboPage, originalLayouts);

    const onLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
    };

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
            name: ScreenNames.cycleMeasurementCombo,
            label: t('ScreenName.CycleMeasurementCombo'),
        },
    ];
    const onBreadcrumbChange = (crumb: string | Filters) => {
        if (typeof crumb === 'string') {
            // a link was selected to route to page
        }
        if (crumb[FilterNames.carTypeId]) {
            const carId = carTypes.find(({ name }) => name === crumb[FilterNames.carTypeId])?.id;

            if (carId) {
                crumb[FilterNames.carTypeId] = carId;
            }
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
                <title>{t(messages.cycleMeasurementComboPageTitle)}</title>

                <meta name="description" content="Description of CycleMeasurementCombo" />
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
            <Div className={'x-cls-cycle-measurement-combo-body x-cls-data-panel-container'}>
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
                    {/* <div
                            className="x-cls-faultRateMeasurementTrend  maximize-widget-width"
                            key={`key-fault-rate-measurement-trend-0`}
                            data-grid={{ ...FaultRateMeasurementTrendProperty.layout, static: false }}
                        >
                            <FaultRateMeasurementTrend
                                className={'x-cls-fault-rate-measurement-trend-widget'}
                                filters={filters}
                                localFilters={localFilters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) =>
                                    updateLoadingState('FaultRateMeasurementTrendWidget', loading)
                                }
                            />
                        </div> */}
                    {/* <div
                            className="x-cls-wopRateMeasurementTrend maximize-widget-width"
                            key={`key-wop-rate-measurement-trend-1`}
                            data-grid={{ ...WopRateMeasurementTrendProperty.layout, static: false }}
                        >
                            <WopRateMeasurementTrend
                                className={'x-cls-wop-rate-measurement-trend-widget'}
                                filters={filters}
                                localFilters={localFilters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) =>
                                    updateLoadingState('WopRateMeasurementTrendWidget', loading)
                                }
                            />
                        </div> */}
                    <div
                        className="x-cls-WeldingTimeMeasurementTrend maximize-widget-width"
                        key={`key-welding-time-measurement-trend-2`}
                        data-grid={{ ...WeldingTimeMeasurementTrendProperty.layout, static: false }}
                    >
                        <WeldingTimeMeasurementTrend
                            className="x-cls-WeldingTimeMeasurementTrend maximize-widget-width"
                            filters={filters}
                            localFilters={localFilters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) =>
                                updateLoadingState('WeldingTimeMeasurementTrendWidget', loading)
                            }
                            getRef={getRef}
                            refs={refs}
                        />
                    </div>
                    <div
                        className="x-cls-penetrationMeasurementTrend maximize-widget-width"
                        key={`key-penetration-measurement-trend-3`}
                        data-grid={{ ...PenetrationMeasurementTrendProperty.layout, static: false }}
                    >
                        <PenetrationMeasurementTrend
                            className={'x-cls-penetration-measurement-trend-widget'}
                            filters={filters}
                            localFilters={localFilters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) =>
                                updateLoadingState('PenetrationMeasurementTrendWidget', loading)
                            }
                            getRef={getRef}
                            refs={refs}
                        />
                    </div>
                    <div
                        className="x-cls-studProjectionMeasurementTrend maximize-widget-width"
                        key={`key-stud-projection-measurement-trend-4`}
                        data-grid={{ ...StudProjectionMeasurementTrendProperty.layout, static: false }}
                    >
                        <StudProjectionMeasurementTrend
                            className={'x-cls-stud-projection-measurement-trend-widget'}
                            filters={filters}
                            localFilters={localFilters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) =>
                                updateLoadingState('StudProjectionMeasurementTrendWidget', loading)
                            }
                            getRef={getRef}
                            refs={refs}
                        />
                    </div>
                    <div
                        className="x-cls-liftingHeightMeasurementTrend maximize-widget-width"
                        key={`key-lifting-height-measurement-trend-5`}
                        data-grid={{ ...LiftingHeightMeasurementTrendProperty.layout, static: false }}
                    >
                        <LiftingHeightMeasurementTrend
                            className={'x-cls-lifting-height-measurement-trend-widget'}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            localFilters={localFilters}
                            isLoading={(loading: boolean) =>
                                updateLoadingState('LiftingHeightMeasurementTrendWidget', loading)
                            }
                            getRef={getRef}
                            refs={refs}
                        />
                    </div>
                    <div
                        className="x-cls-dropTimeMeasurementTrend maximize-widget-width"
                        key={`key-drop-time-measurement-trend-6`}
                        data-grid={{ ...DropTimeMeasurementTrendProperty.layout, static: false }}
                    >
                        <DropTimeMeasurementTrend
                            className={'x-cls-drop-time-measurement-trend-widget'}
                            filters={filters}
                            localFilters={localFilters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) =>
                                updateLoadingState('DropTimeMeasurementTrendWidget', loading)
                            }
                            getRef={getRef}
                            refs={refs}
                        />
                    </div>
                    <div
                        className="x-cls-cyclegap maximize-widget-width"
                        key={`key-cycle-gap-7`}
                        data-grid={{ ...CycleGapProperty.layout, static: false }}
                    >
                        <CycleGap
                            className={'x-cls-cycle-gap-widget'}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('CycleGapWidget', loading)}
                        />
                    </div>
                </ResponsiveReactGridLayout>
            </Div>
        </>
    );
});

const Div = styled.div``;

export default CycleMeasurementCombo;

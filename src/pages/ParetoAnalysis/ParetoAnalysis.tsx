/**
 *
 * ParetoAnalysis
 *
 */
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import {
    DashboardFilter,
    DateFilterData,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { CarTypes, FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import { memo, useMemo, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { withSize } from 'react-sizeme';
import { useLocalStorage } from 'utils';
// import { DurationOfFaultsProperty, EventCodeFrequencyProperty } from 'widgets';
// import { EventDescFrequencyWidgetProperty } from 'widgets';

import Constant, { API_REQUEST_DATE_FORMAT } from 'constants/index';
import { SystemType } from 'constants/staticValues';
import moment from 'moment';
import { Page, PageProps } from 'pages';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import {
    eventDescFrequencyKey,
    eventDescFrequencyReducer,
} from 'services/event-desc-frequency/event-desc-frequency-reducer';
import { selectEventDescFrequencyFilterValues } from 'services/event-desc-frequency/event-desc-frequency-selectors';
import { selectLines } from 'services/line/line-selectors';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import { useInjectReducer } from 'utils/redux-injectors';
import DurationOfFaults from 'widgets/EventFrequency/DurationOfFaults';
import { EventCodeFrequency } from 'widgets/EventFrequency/EventCodeFrequency/Loadable';
import { EventDescFrequency } from 'widgets/EventFrequency/EventDescFrequency/Loadable';
import { messages } from './messages';
import { Pages } from 'constants/defaultDateConfig';

import { FilterButton } from 'components/FilterButton/FilterButton';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import './ParetoAnalysis.scss';

interface ParetoAnalysisProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const originalLayouts = {
    lg: [
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-duration-of-faults-4',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 4,
            i: 'key-event-code-frequency-2',
        },
        {
            w: 4,
            h: 3,
            x: 2,
            y: 6,
            i: 'key-event-frequency-description-3',
        },
    ],
};
const listOfLocalFilters = [];

export const ParetoAnalysis: Page<ParetoAnalysisProps> = memo((props: ParetoAnalysisProps) => {
    useInjectReducer({ key: eventDescFrequencyKey, reducer: eventDescFrequencyReducer });

    const { t } = useTranslation();
    const { plantId } = useSelector(selectBreadcrumbFilters);

    const pageFilters = useMemo(() => {
        const START_TIME = moment(getDefaultFilterDate(Pages.Pareto));
        return [
            {
                name: FilterNames.eventType,
                type: FilterType.Select,
                data: {
                    options: [
                        'Filters.Fault',
                        'Filters.Warning',
                        'Filters.FirmwareUpdate',
                        'Filters.Info',
                        'Filters.Componentexchange',
                        'Filters.Maintenance',
                    ],
                } as SelectFilterData,
            },
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
            { name: FilterNames.studType, type: FilterType.Select, data: { options: [] } as SelectFilterData },
            {
                name: FilterNames.deviceName,
                type: FilterType.Select,
                data: { options: [] } as SelectFilterData,
            },
        ];
    }, []);

    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    const defaultFilters = {
        [FilterNames.carTypeId]: '0',
        [FilterNames.plantId]: plantId,
        [FilterNames.eventType]: t('Filters.Fault'),
        [FilterNames.eventTypeCode]: 0,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: SystemType.SWS,
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
    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.paretoAnalysisPage, originalLayouts);
    const lineOptions = useSelector(selectLines);
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };

    const availableFilters = [
        ...availableFiltersFromData,
        {
            name: FilterNames.deviceLine,
            type: FilterType.Select,
            data: { options: lineOptions } as SelectFilterData,
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

    const crumbs: BreadcrumbLinks = useMemo(() => {
        const retVal = [
            {
                name: ScreenNames.home,
                label: t('ScreenName.Home'),
                href: '/home',
            },
            {
                name: ScreenNames.paretoAnalysis,
                label: t('ScreenName.ParetoAnalysis'),
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
            isDraggable: editPageLayout,
            isResizable: editPageLayout,
            rowHeight: 150,
            layouts,
            useCSSTransforms: true,
        }),
        [layouts, editPageLayout],
    );

    const onLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
    };

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    return (
        <>
            <Helmet>
                <title>{t(messages.paretoAnalysisPageTitle)}</title>
                <meta name="description" content="Description of ParetoAnalysis" />
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
                            useSelector(selectEventDescFrequencyFilterValues),
                        ].reduce((acc, filters) => {
                            acc = { ...acc, ...filters };
                            return acc;
                        }, {} as any);

                        return filterValues;
                    }}
                />
            )}
            <div className="x-cls-pareto-analysis-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Breadcrumb
                        // filters={{ ...apiFilters, ...localFilters }}
                        // availableFilters={availableFilters}
                        crumbs={crumbs}
                        onClick={onBreadcrumbChange}
                        filterValues={() => {
                            const filterValues = [
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useSelector(selectEventDescFrequencyFilterValues),
                            ].reduce((acc, filters) => {
                                acc = { ...acc, ...filters };
                                return acc;
                            }, {} as any);

                            return filterValues;
                        }}
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
                        className="maximize-pareto-widget-width"
                        key={`key-duration-of-faults-4`}
                        data-grid={{
                            preventCollision: true,
                            x: 0,
                            y: 0,
                            w: 4,
                            h: 3,
                        }}
                    >
                        <DurationOfFaults
                            className="DurationOfFaults"
                            filters={filters}
                            localFilters={localFilters}
                            isLoading={(loading: boolean) => updateLoadingState('DurationOfFaultsWidget', loading)}
                        />
                    </div>
                    <div
                        className="maximize-pareto-widget-width"
                        key={`key-event-code-frequency-2`}
                        data-grid={{
                            preventCollision: true,
                            x: 0,
                            y: 3,
                            w: 4,
                            h: 3,
                        }}
                    >
                        <EventCodeFrequency
                            isLoading={(loading: boolean) => updateLoadingState('EventCodeFrequencyWidget', loading)}
                        />
                    </div>
                    <div
                        className="maximize-pareto-widget-width"
                        key={`key-event-frequency-description-3`}
                        data-grid={{
                            preventCollision: true,
                            x: 0,
                            y: 9,
                            w: 4,
                            h: 3,
                        }}
                    >
                        <EventDescFrequency
                            className="EventDescFrequency"
                            filters={filters}
                            localFilters={localFilters}
                        />
                    </div>
                </ResponsiveReactGridLayout>
            </div>
        </>
    );
});

export default ParetoAnalysis;

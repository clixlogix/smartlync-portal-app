import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import {
    DashboardFilter,
    DateFilterData,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import Constant from 'constants/index';
import { SystemType } from 'constants/staticValues';
import { CarTypes, FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import moment from 'moment';
import { Page, PageProps } from 'pages';
import { memo, useMemo, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { withSize } from 'react-sizeme';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { selectEventCountDailyFrequencySprFilterValues } from 'services/event-count-daily-spr-frequency/event-count-daily-spr-frequency-selectors';
import { selectEventCountFrequencyWidgetSprFilterValues } from 'services/event-count-frequency-spr-widget/event-count-frequency-spr-widget-selectors';
import { FilterButton } from 'components/FilterButton/FilterButton';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';

import { API_REQUEST_DATE_FORMAT } from 'constants/index';
import { selectLines } from 'services/line/line-selectors';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate, useLocalStorage } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import { EventCountDailyFrequencySprProperty, EventCountFrequencyWidgetSprProperty } from 'widgets';
import { EventCountDailyFrequencySpr } from 'widgets/EventCount/EventCountDailyFrequencySpr/Loadable';
import { EventCountFrequencyWidgetSpr } from 'widgets/EventCount/EventCountFrequencyWidgetSpr/Loadable';
import { messages } from './messages';
import { Pages } from 'constants/defaultDateConfig';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import './FaultCountTrendSpr.scss';
import ProgressBar from 'components/LinearProgress/LinearProgress';

interface FaultCountTrendSprProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const originalLayouts = {
    lg: [
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-event-code-frequency-2',
        },
        {
            w: 4,
            h: 3,
            x: 0,
            y: 4,
            i: 'key-event-frequency-description-3',
        },
    ],
};

const listOfLocalFilters = [FilterNames.week];
export const FaultCountTrendSpr: Page<FaultCountTrendSprProps> = memo((props: FaultCountTrendSprProps) => {
    const { t } = useTranslation();
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const pageFilters = useMemo(() => {
        const START_TIME = moment(getDefaultFilterDate(Pages.FaultCountTrend));
        return [
            {
                name: FilterNames.eventType,
                type: FilterType.Select,
                data: {
                    options: ['Filters.Fault', 'Filters.Warning'],
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
                } as DateFilterData, // set default value here
            },
            ...(EventCountFrequencyWidgetSprProperty.defaultFilters || []),
            ...(EventCountDailyFrequencySprProperty.defaultFilters || []),
        ];
    }, []);

    const defaultFilters = {
        [FilterNames.plantId]: '',
        [FilterNames.eventType]: t('Filters.Fault'),
        [FilterNames.eventTypeCode]: 0,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: SystemType.SWS,
        [FilterNames.carTypeId]: '0',
    };
    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
            [FilterNames.eventCode]: '',
        },
        listOfLocalFilters,
    });
    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const [availableFiltersFromData] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.faultCountTrendPage, originalLayouts);
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
    ]);

    const crumbs: BreadcrumbLinks = useMemo(() => {
        const retVal = [
            {
                name: ScreenNames.faultCountTrend,
                label: t('ScreenName.Home'),
                href: '/home',
            },
            {
                name: ScreenNames.faultCountTrend,
                label: t('ScreenName.FaultCountTrend'),
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

    return (
        <>
            <Helmet>
                <title>{t(messages.faultCountTrendSprPageTitle)}</title>

                <meta name="description" content="Description of FaultCountTrendSpr" />
            </Helmet>
            <div className="x-cls-loader ">{isLoading && <ProgressBar className={'progress'} variant="buffer" />}</div>
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
                            useSelector(selectEventCountDailyFrequencySprFilterValues),
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectEventCountFrequencyWidgetSprFilterValues),
                        ].reduce((acc, filters) => {
                            acc = { ...acc, ...filters };
                            return acc;
                        }, {} as any);

                        return filterValues;
                    }}
                />
            )}
            <div className="x-cls-fault-count-trend-body-spr">
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
                        key={`key-event-code-frequency-2`}
                        data-grid={{
                            preventCollision: true,
                            // ...EventCountFrequencyWidgetProperty.layout,
                            x: 0,
                            y: 3,
                            w: 4,
                            h: 3,
                        }}
                    >
                        <EventCountFrequencyWidgetSpr
                            filters={filters}
                            localFilters={localFilters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('EventCountFrequencyWidget', loading)}
                        />
                    </div>
                    <div
                        className="maximize-widget-width"
                        key={`key-event-frequency-description-3`}
                        data-grid={{
                            // ...EventCountDailyFrequencyProperty.layout,
                            x: 0,
                            y: 0,
                            w: 4,
                            h: 3,
                            preventCollision: true,
                        }}
                    >
                        <EventCountDailyFrequencySpr
                            filters={filters}
                            localFilters={localFilters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('EventCountDailyFrequency', loading)}
                        />
                    </div>
                </ResponsiveReactGridLayout>
            </div>
        </>
    );
});

export default FaultCountTrendSpr;

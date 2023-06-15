/**
 *
 * CycleGapTempo
 *
 */

import Breadcrumb from 'components/Breadcrumb';
import { DashboardFilter, DateFilterData, FilterType } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import { Page, PageProps } from 'pages';
import { memo, useMemo, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import { buildAvailableFiltersFromData, buildFiltersFromData, useLocalStorage, getDefaultFilterDate } from 'utils';
import { CycleGapProperty } from 'widgets';
import CycleGap from 'widgets/CycleGap';
import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import Constant, { API_REQUEST_DATE_FORMAT } from 'constants/index';
import { Pages } from 'constants/defaultDateConfig';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectCycleGapsTempoFilterValues } from 'services/cycle-gap/cycle-gap-selectors';
import { messages } from './messages';

import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import './CycleGapTempo.scss';

interface CycleGapTempoProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);
const originalLayouts = {
    lg: [
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-cycle-gap-0',
        },
    ],
};

export const CycleGapTempo: Page<CycleGapTempoProps> = memo((props: CycleGapTempoProps) => {
    const { plantId } = useSelector(selectBreadcrumbFilters);
    const { t } = useTranslation();

    const pageFilters = useMemo(() => {
        const START_TIME = moment(getDefaultFilterDate(Pages.CycleGapTempo));
        return [
            {
                name: FilterNames.dateRange,
                type: FilterType.Date,
                data: {
                    fromTime: moment(START_TIME).clone().startOf('day'),
                    toTime: moment(START_TIME).clone().endOf('day'),
                    validation: true,
                    nos: 3,
                    period: 'days',
                } as DateFilterData, // set default value here
            },
            ...(CycleGapProperty.defaultFilters || []),
        ];
    }, []);

    const [filters, setFilters] = useState<Filters>({
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: 'SWS',
    });
    const defaultFilters = {
        ...buildFiltersFromData(pageFilters),
    };
    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.cycleGapTempoPage, originalLayouts);

    const onLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
    };

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));

    const onFilterChange = (filter: Filters) => {
        setFilters({ ...filters, ...filter });
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
            name: ScreenNames.cycleGap,
            label: t('ScreenName.CycleGap'),
        },
        // { name: FilterNames.systemType, menu: filters[FilterNames.systemType], options: ['SWS', 'SPR', 'SAT'] },
        {
            name: FilterNames.singleDate,
            label: `Date : ${filters.fromTime.format(API_REQUEST_DATE_FORMAT)} - ${filters.toTime.format(
                API_REQUEST_DATE_FORMAT,
            )}`,
        },
    ];

    const onBreadcrumbChange = (crumb: string | Filters) => {
        if (typeof crumb === 'string') {
            // a link was selected to route to page
        }
        onFilterChange({ ...(crumb as Filters) } as any);
    };

    // if (filters[FilterNames.deviceName]) {
    //     crumbs.push(filters[FilterNames.deviceName]);
    // }

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
                <title>{t(messages.cycleGapTempoPageTitle)}</title>
                <meta name="description" content="Description of CycleGapTempo" />
            </Helmet>
            {isLoading && <ProgressBar variant="buffer" />}

            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={filters}
                    defaultFilters={defaultFilters}
                    availableFilters={Array.from(availableFilters.values())}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                    filterValues={() => {
                        const filterValues = [
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectCycleGapsTempoFilterValues),
                        ].reduce((acc, filters) => {
                            acc = { ...acc, ...filters };
                            return acc;
                        }, {} as any);

                        return filterValues;
                    }}
                />
            )}
            <div className="x-cls-cycle-gap-tempo-body">
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
                        className="maximize-widget"
                        key={`key-cycle-gap-0`}
                        data-grid={{ ...CycleGapProperty.layout, static: false }}
                    >
                        <CycleGap
                            className="x-cls-cycle-gap-widget"
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('CycleGapWidget', loading)}
                        />
                    </div>
                </ResponsiveReactGridLayout>
            </div>
        </>
    );
});

export default CycleGapTempo;

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
import { CycleGapProperty, CycleGapSprProperty } from 'widgets';
import CycleGapSPR from 'widgets/CycleGapSPR';
import { Pages } from 'constants/defaultDateConfig';

import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import Constant, { API_REQUEST_DATE_FORMAT } from 'constants/index';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectCycleGapsSprTempoFilterValues } from 'services/cycle-gap-spr/cycle-gap-spr-selectors';
import { messages } from './messages';

import './CyclegapTempoSprCopy.scss';

import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';

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

export const CycleGapTempoSpr: Page<CycleGapTempoProps> = memo((props: CycleGapTempoProps) => {
    // const [plantId] = useQueryParam<string>(FilterNames.plantId, '1',true);

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
            ...(CycleGapSprProperty.defaultFilters || []),
        ];
    }, []);

    const [sprFilters, setSprFilters] = useState<Filters>({
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        [FilterNames.systemType]: 'SPR',
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
    const [availableSPRFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));

    const onSprFilterChange = (filter: Filters) => {
        setSprFilters({ ...sprFilters, ...filter });
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
            name: ScreenNames.cycleGapSPR,
            label: t('ScreenName.CycleGapSPR'),
        },
        {
            name: FilterNames.singleDate,
            label: `Date : ${sprFilters.fromTime.format(API_REQUEST_DATE_FORMAT)} - ${sprFilters.toTime.format(
                API_REQUEST_DATE_FORMAT,
            )}`,
        },
    ];
    const onBreadcrumbChange = (crumb: string | Filters) => {
        if (typeof crumb === 'string') {
            // a link was selected to route to page
        }
        // a filter was selected so update filters
        onSprFilterChange({ ...(crumb as Filters) } as any);
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
            layouts,
            rowHeight: 150,
            useCSSTransforms: true,
        }),
        [layouts, editPageLayout],
    );

    return (
        <>
            <Helmet>
                <title>{t(messages.cyclegapTempoSprPageTitle)}</title>

                <meta name="description" content="Description of CycleGapTempo" />
            </Helmet>
            {isLoading && <ProgressBar className={'progress'} variant="buffer" />}
            <DashboardFilterPanel
                filters={sprFilters}
                availableFilters={Array.from(availableSPRFilters.values())}
                defaultFilters={defaultFilters}
                open={filterPanelOpen}
                setOpen={() => setFilterPanelOpen(false)}
                onFilterChange={onSprFilterChange}
                filterValues={() => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    return useSelector(selectCycleGapsSprTempoFilterValues);
                }}
            />
            <div className="x-cls-cycle-gap-tempo-spr-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Breadcrumb crumbs={crumbs} onClick={onBreadcrumbChange} />
                    {availableSPRFilters.length > 0 && (
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
                        <CycleGapSPR
                            className="x-cls-cycle-gap-widget"
                            filters={sprFilters}
                            onFilterChange={onSprFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('CycleGapWidget', loading)}
                        />
                    </div>
                </ResponsiveReactGridLayout>
            </div>
        </>
    );
});

export default CycleGapTempoSpr;

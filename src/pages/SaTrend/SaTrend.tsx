/**
 *
 * SaTrend
 *
 */
import Breadcrumb from 'components/Breadcrumb';
import { DashboardFilter, FilterType, SelectFilterData, DateFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import Constant from 'constants/index';
import { FilterNames, Filters, LoadingValue, ScreenNames, CarTypes } from 'models';
import { Page, PageProps } from 'pages';
import { memo, useMemo, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { withSize } from 'react-sizeme';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import styled from 'styled-components/macro';
import { buildAvailableFiltersFromData, buildFiltersFromData, useLocalStorage, getDefaultFilterDate } from 'utils';
import StationAvailabilityTrend, { StationAvailabilityTrendProperty } from 'widgets/StationAvailabilityTrend';
import { messages } from './messages';
// import Switch from '@mui/material/Switch';
import { FilterButton } from 'components/FilterButton/FilterButton';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import { useFilters } from 'utils/hooks/use-filters';
import { Box } from '@mui/material';
import { SystemType } from 'constants/staticValues';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { selectLines } from 'services/line/line-selectors';
import { Pages } from 'constants/defaultDateConfig';
import moment from 'moment';
import './SaTrend.scss';

interface SaTrendProps extends PageProps { }

const ResponsiveReactGridLayout = withSize({ monitorHeight: true })(Responsive);

const originalLayouts = {
    lg: [
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-sa-trend-0',
        },
    ],
};

const listOfLocalFilters = [];

export const SaTrend: Page<SaTrendProps> = memo((props: SaTrendProps) => {
    const { plantId } = useSelector(selectBreadcrumbFilters);
    const { t /* , i18n */ } = useTranslation();
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.StationAvailability)), []);

    const pageFilters = [
        {
            name: FilterNames.dateRange,
            type: FilterType.Date,
            data: {
                fromTime: START_TIME.clone().subtract(14, 'isoWeek').startOf('isoWeek'),
                toTime: START_TIME.clone().endOf('isoWeek'),
                isNineWeekView: false,
                isStartEndWeekAutoSelect: true,
                startText: 'From',
                endText: 'To',
                inputFormat: '[W]W YYYY',
            } as DateFilterData,
        },
        ...(StationAvailabilityTrendProperty.defaultFilters || []),
    ];

    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: SystemType.SWS,
        [FilterNames.view]: 'nineweeks',
        [FilterNames.groupBy]: 'station',
        [FilterNames.carTypeId]: '0',
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
        listOfLocalFilters,
    });

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const [availableFiltersFromData] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const lineOptions = useSelector(selectLines);
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };
    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.saTrendPage, originalLayouts);

    const onLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
    };

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

    const availableFilters = useMemo(() => {
        return [
            ...availableFiltersFromData.slice(0, 2),
            {
                name: FilterNames.deviceLine,
                type: FilterType.Select,
                data: { options: lineOptions } as SelectFilterData,
            },
            ...availableFiltersFromData.slice(2),
            {
                name: FilterNames.systemFaults,
                label: 'Filters.SystemFaults',
                type: FilterType.Select,
                multiple: false,
                disabled: filters.groupBy === 'outlet' ? false : true,
                data: { options: ['Include', 'Exclude'] } as SelectFilterData,
            },
        ];
    }, [availableFiltersFromData, filters.groupBy, lineOptions]);

    const crumbs = [
        {
            name: ScreenNames.home,
            label: t('ScreenName.Home'),
            href: '/home',
        },
        {
            name: 'TA Over Time',
            label: 'TA Over Time',
        },
    ];
    const onBreadcrumbChange = (crumb: string | Filters) => {
        if (typeof crumb === 'string') {
            // a link was selected to route to page
        }
        // a filter was selected so update filters
        // onFilterChange({ ...(crumb as Filters) } as any);
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
                <title>{t(messages.saTrendPageTitle)}</title>

                <meta name="description" content="Description of SaTrend" />
            </Helmet>

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
            <Box sx={{ position: 'absolute', right: '10px', top: '100px' }}>
                {availableFilters.length > 0 && <FilterButton hanldeFilterPanelOpen={setFilterPanelOpen} />}
            </Box>
            <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', paddingTop: '10px' }}>
                <Breadcrumb crumbs={crumbs} onClick={onBreadcrumbChange} />
                <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', paddingTop: '10px' }}>
                    <StationAvailabilityTrend
                        filters={filters}
                        onFilterChange={onFilterChange}
                        isLoading={(loading: boolean) => updateLoadingState('StationAvailabilityTrend', loading)}
                    />
                </Box>
            </Box>
        </>
    );
});

const Div = styled.div``;

export default SaTrend;

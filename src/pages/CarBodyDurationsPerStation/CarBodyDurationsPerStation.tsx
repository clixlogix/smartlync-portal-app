/**
 *
 * CarBodyDurationsPerStation
 *
 */

import { memo, useMemo, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector /*, useDispatch */ } from 'react-redux';
import { withSize } from 'react-sizeme';
import styled from 'styled-components/macro';

import Breadcrumb from 'components/Breadcrumb';
import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import {
    DashboardFilter,
    DateFilterData,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import { Page, PageProps } from 'pages';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectStations } from 'services/station/station-selectors';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import { useInjectReducer } from 'utils/redux-injectors';
import { CarBodyDurationWidgetProperty } from 'widgets';
import CarBodyDurationWidget from 'widgets/CarBodyDurationWidget';
import { messages } from './messages';
import { Pages } from 'constants/defaultDateConfig';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import './CarBodyDurationsPerStation.scss';

// import { RulesPanel } from 'components/panels/RulesPanel/RulesPanel';
import moment from 'moment';
import { /* rulesPanelActions,*/ rulesPanelKey, rulesPanelReducer } from 'services/rules-panel/rules-panel-reducer';

interface CarBodyDurationsPerStationProps extends PageProps { }

const GridLayout = withSize()(Responsive);

export const CarBodyDurationsPerStation: Page<CarBodyDurationsPerStationProps> = memo(
    (props: CarBodyDurationsPerStationProps) => {
        useInjectReducer({ key: rulesPanelKey, reducer: rulesPanelReducer });
        //const [plantId] = useQueryParam<string>(FilterNames.plantId, '1', true);

        const { plantId } = useSelector(selectBreadcrumbFilters);
        const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

        const pageFilters = useMemo(() => {
            const START_TIME = moment(getDefaultFilterDate(Pages.CarBodyDuration));
            return [
                {
                    name: FilterNames.dateRange,
                    type: FilterType.Date,
                    data: {
                        fromTime: moment(START_TIME).subtract(1, 'day').startOf('day'),
                        toTime: moment(START_TIME).endOf('day'),
                        startDatePlaceholder: 'll',
                        endDatePlaceholder: 'll',
                    } as DateFilterData,
                },
            ];
        }, []);

        const { t /* , i18n */ } = useTranslation();
        const defaultFilters = {
            [FilterNames.plantId]: plantId,
            [FilterNames.carTypeId]: '0',
            ...buildFiltersFromData(pageFilters),
            // add your default filters for this page here ...
            [FilterNames.systemType]: 'SWS',
        };

        const { apiFilters, localFilters, changeFilters } = useFilters({
            defaultFilters: {
                ...defaultFilters,
            },
        });

        let [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
        const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
        const stationOptions = useSelector(selectStations);

        availableFilters = [
            ...availableFilters,
            {
                name: FilterNames.stationName,
                type: FilterType.Select,
                data: { options: stationOptions } as SelectFilterData,
            },
        ];

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
                name: ScreenNames.catbodyDurationPerStation,
                label: t('ScreenName.CarbodyDurationPerStation'),
            },
        ];
        const onBreadcrumbChange = (crumb: string | Filters) => {
            if (typeof crumb === 'string') {
                // a link was selected to route to page
            }
            // a filter was selected so update filters
            onFilterChange({ ...(crumb as Filters) } as any);
        };

        if (filters[FilterNames.stationName]) {
            crumbs.push(filters[FilterNames.stationName]);
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
                rowHeight: 150,
                useCSSTransforms: true,
            }),
            [],
        );

        // const toggleDrawer = (open: boolean) => {
        //     dispatch(rulesPanelActions.openRulesPanel(open));
        // };

        return (
            <>
                <Helmet>
                    <title>{t(messages.carBodyDurationsPerStationPageTitle)}</title>

                    <meta name="description" content="Description of CarBodyDurationsPerStation" />
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

                <Div className={'x-cls-car-body-durations-per-station-body x-cls-data-panel-container'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <Breadcrumb crumbs={crumbs} onClick={onBreadcrumbChange} />
                        {availableFilters.length > 0 && <FilterButton hanldeFilterPanelOpen={setFilterPanelOpen} />}
                    </div>
                    <GridLayout
                        style={{ height: '100%' }}
                        className="layout"
                        /* onSize={onSize} */ {...layoutProperties}
                    >
                        <div
                            className="x-cls-dashboard-item maximize-widget"
                            key={`key-car-body-duration-widget-0`}
                            data-grid={{ ...CarBodyDurationWidgetProperty.layout, static: true }}
                        >
                            <CarBodyDurationWidget
                                className={'x-cls-car-body-duration-widget-widget'}
                                filters={filters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) =>
                                    updateLoadingState('CarBodyDurationWidgetWidget', loading)
                                }
                            />
                        </div>
                    </GridLayout>
                </Div>
                {/* <RulesPanel
                toggleDrawer={toggleDrawer}
                keys={Object.keys(s[0] || {})}
                data={s || []}
                onApply={(rules) => dispatch(sActions.filtersByRules(rules))}
            /> */}
            </>
        );
    },
);

const Div = styled.div``;

export default CarBodyDurationsPerStation;

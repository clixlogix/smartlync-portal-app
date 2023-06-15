/**
 *
 * MaintainanceAction
 *
 */
import React, { useState, memo, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { Responsive } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import { useSelector } from 'react-redux';
import { MaintainanceActionTable } from 'widgets/MaintainanceActionTable/Loadable';
import {
    DashboardFilter,
    FilterType,
    SelectFilterData,
    DateFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { MaintainanceActionTableProperty } from 'widgets';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { FilterNames, Filters, LoadingValue, CarTypes, ScreenNames } from 'models';

import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { Page, PageProps } from 'pages';
import { SystemType } from 'constants/staticValues';
import { useFilters } from 'utils/hooks/use-filters';
import { messages } from './messages';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { FilterButton } from 'components/FilterButton/FilterButton';
import moment from 'moment';
import { Pages } from 'constants/defaultDateConfig';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import './MaintainanceAction.scss';

interface MaintainanceActionProps extends PageProps { }

const GridLayout = withSize()(Responsive);

const listOfLocalFilters = [FilterNames.deviceName];
export const MaintainanceAction: Page<MaintainanceActionProps> = memo((props: MaintainanceActionProps) => {
    const { t } = useTranslation();
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const pageFilters = useMemo(() => {
        const START_TIME = moment(getDefaultFilterDate(Pages.MaintainanceAction));
        return [
            {
                name: FilterNames.dateRange,
                type: FilterType.Date,
                label: 'Date',
                data: {
                    fromTime: moment(START_TIME).subtract(9, 'isoWeek').startOf('day'),
                    toTime: moment(START_TIME).endOf('day'),
                    startDatePlaceholder: 'll',
                    endDatePlaceholder: 'll',
                } as DateFilterData,
            },
            ...(MaintainanceActionTableProperty.defaultFilters || []),
        ];
    }, []);

    const defaultFilters = {
        [FilterNames.plantId]: '',
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
    // const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const [availableFiltersFromData] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));

    const availableFilters = [
        ...availableFiltersFromData,
        {
            name: FilterNames.stationName,
            type: FilterType.Select,
            data: { options: [] } as SelectFilterData,
        },
    ];

    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };

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
                name: ScreenNames.maintainanceAction,
                label: t('ScreenName.MaintainanceAction'),
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
            rowHeight: 150,
            width: 1500,
            breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
            cols: { lg: 1, md: 2, sm: 1, xs: 1, xxs: 1 },
            autoSize: true,
            compactType: 'horizontal',
            isBounded: false,
            onLayoutChange: (layout, b) => { },
            height: '100%',
        }),
        [],
    );

    return (
        <>
            <Helmet>
                <title>{t(messages.maintainanceActionPageTitle)}</title>
                <meta name="description" content="Description of MaintainanceAction" />
            </Helmet>

            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={{ ...apiFilters, ...localFilters }}
                    availableFilters={Array.from(availableFilters.values())}
                    defaultFilters={defaultFilters}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                    filterValues={() => {
                        const filterValues = [
                            // add useSelector for each widget that uses the filters to get their own data
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                        ].reduce((acc, filters) => {
                            // @ts-ignore
                            return { ...acc, ...filters };
                        }, {} as any);

                        return filterValues;
                    }}
                />
            )}

            <Div className={'x-cls-maintainance-action-body x-cls-data-panel-container'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Breadcrumb crumbs={crumbs} onClick={onBreadcrumbChange} />
                    {availableFilters.length > 0 && <FilterButton hanldeFilterPanelOpen={setFilterPanelOpen} />}
                </div>
                <Div className="toolbar-section">
                    <Div className="left-section"></Div>
                    <Div className="right-section"></Div>
                </Div>
                <span>Daily report: Project BR223/297</span>
                <GridLayout style={{ height: '100%' }} className="layout" {...layoutProperties}>
                    <div
                        className="x-cls-dashboard-item maximize-widget"
                        key={`key-process-log-0`}
                        data-grid={{ ...MaintainanceActionTableProperty.layout, static: false }}
                    >
                        <MaintainanceActionTable
                            className={'x-cls-maintainanceAction-widget'}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) =>
                                updateLoadingState('MaintainanceActionTableWidget', loading)
                            }
                        />
                    </div>
                </GridLayout>
            </Div>
        </>
    );
});

const Div = styled.div``;

export default MaintainanceAction;

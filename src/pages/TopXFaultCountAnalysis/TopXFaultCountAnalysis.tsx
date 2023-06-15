/**
 *
 * TopXFaultCountAnalysis
 *
 */

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import { FilterButton } from 'components/FilterButton/FilterButton';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { DashboardFilter, DateFilterData, FilterType } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { API_REQUEST_DATE_FORMAT } from 'constants/index';
import { SystemType } from 'constants/staticValues';
import { CarTypes, FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import moment from 'moment';
import { Page, PageProps } from 'pages';
import React, { memo, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { buildAvailableFiltersFromData } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import { FaultsPerDeviceHistogramProperty, TopFaultCountProperty } from 'widgets';
import { FaultsPerDeviceHistogramWidget } from 'widgets/FaultsPerDeviceHistogram/FaultsPerDeviceHistogram';
import { TopFaultCount } from 'widgets/TopFaultCount/Loadable';
import { messages } from './messages';
import { buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { Box } from '@mui/material';
import { Pages } from 'constants/defaultDateConfig';

interface TopXFaultCountAnalysisProps extends PageProps { }

const listOfLocalFilters = [];

export const TopXFaultCountAnalysis: Page<TopXFaultCountAnalysisProps> = memo((props: TopXFaultCountAnalysisProps) => {
    const { t } = useTranslation();
    // const [plantId] = useQueryParam<string>('plantId', '1', true);
    const { plantId } = useSelector(selectBreadcrumbFilters);
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    const pageFilters = useMemo(() => {
        const START_TIME = moment(getDefaultFilterDate(Pages.FaultsPerDevice));
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
            ...(TopFaultCountProperty.defaultFilters || []),
            ...(FaultsPerDeviceHistogramProperty.defaultFilters || []),
        ];
    }, []);
    const defaultFilters = {
        [FilterNames.eventType]: t('Filters.Fault'),
        [FilterNames.plantId]: plantId,
        [FilterNames.systemType]: SystemType.SWS,
        ...buildFiltersFromData(pageFilters),
        [FilterNames.carTypeId]: '0',
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
        listOfLocalFilters,
    });

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const onFilterChange = (filter: Filters) => {
        changeFilters(filter);
    };

    const [loadingState, setLoadingState] = useState<LoadingValue>({});
    const [toggleSwitch, setToggleSwitch] = useState<boolean>(true);
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
                name: ScreenNames.faultsPerDevice,
                label: t('ScreenName.FaultsPerDevice'),
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

    const label = { inputProps: { 'aria-label': 'Switch to Stacked Histogram' } };

    const onChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToggleSwitch(event.target.checked);
    };

    const topFaultCountTableComponent = () => {
        return (
            <Box
                sx={{
                    height: '100%',
                    width: '100%',
                    marginTop: '20px',
                }}
            >
                <TopFaultCount
                    filters={filters}
                    localFilters={localFilters}
                    onFilterChange={onFilterChange}
                    isLoading={(loading: boolean) => updateLoadingState('TopFaultCount', loading)}
                />
            </Box>
        );
    };

    const topFaultCountGraphComponent = () => {
        return (
            <Box sx={{ height: '100%', width: '100%', display: 'flex', flexFlow: 'column nowrap', flex: 1 }}>
                <FaultsPerDeviceHistogramWidget
                    onFilterChange={onFilterChange}
                    filters={filters}
                    localFilters={localFilters}
                    isLoading={(loading: boolean) =>
                        updateLoadingState('TopFaFaultsPerDeviceHistogramWidgetultCount', loading)
                    }
                />
            </Box>
        );
    };

    return (
        <>
            <Helmet>
                <title>{t(messages.topXFaultCountAnalysisPageTitle)}</title>
                <meta name="description" content="Description of TopXFaultCountAnalysis" />
            </Helmet>
            <DashboardFilterPanel
                filters={filters}
                availableFilters={Array.from(availableFilters.values())}
                defaultFilters={defaultFilters}
                onFilterChange={onFilterChange}
                open={filterPanelOpen}
                setOpen={() => setFilterPanelOpen(false)}
            />

            <Box sx={{ height: '100%', width: '100%', display: 'flex', flexFlow: 'column nowrap', flex: 1 }}>
                <Box style={{ display: 'flex', marginTop: '10px' }}>
                    <Breadcrumb
                        availableFilters={availableFilters}
                        filters={filters}
                        crumbs={crumbs}
                        onClick={onBreadcrumbChange}
                    />

                    <FormControlLabel
                        sx={{ alignItems: 'center', flex: 1, justifyContent: 'end', display: 'flex' }}
                        control={<Switch {...label} checked={toggleSwitch} onChange={onChangeSwitch} />}
                        label="stacked histogram"
                    />
                    {availableFilters.length > 0 && <FilterButton hanldeFilterPanelOpen={setFilterPanelOpen} />}
                </Box>

                <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
                    {!toggleSwitch ? topFaultCountTableComponent() : topFaultCountGraphComponent()}
                </Box>
            </Box>
        </>
    );
});

export default TopXFaultCountAnalysis;

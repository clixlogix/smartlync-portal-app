/**
 *
 * MtbfAnalysis
 *
 */

import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import {
    DashboardFilter,
    FilterType,
    SelectFilterData,
    DateFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { CarTypes, FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import { Page, PageProps } from 'pages';
import { API_REQUEST_DATE_FORMAT } from 'constants/index';
import { memo, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { selectLines } from 'services/line/line-selectors';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { MeanTimeBetweenFailureTableAnalysisProperty } from 'widgets';
import MeanTimeBetweenFailureAnalysisWidget from 'widgets/MeanTimeBetweenFailureTableAnalysis/Loadable';
import { Box } from '@mui/material';
import { FilterButton } from 'components/FilterButton/FilterButton';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { SystemType } from 'constants/staticValues';
import { useSelector } from 'react-redux';
import { useFilters } from 'utils/hooks/use-filters';
import moment from 'moment';
import { Pages } from 'constants/defaultDateConfig';
// import { selectFixedRanges } from 'services/fixed-range/fixed-range-selectors';
import { messages } from './messages';

interface MtbfAnalysisProps extends PageProps { }
const listOfLocalFilters = [];

export const MtbfAnalysis: Page<MtbfAnalysisProps> = memo((props: MtbfAnalysisProps) => {
    const { t } = useTranslation();
    // const [plantId] = useQueryParam<string>('plantId', '1', true);
    const { plantId } = useSelector(selectBreadcrumbFilters);

    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.MTBF)), []);
    const fromTime = moment(START_TIME).subtract(8, 'isoWeek').startOf('isoWeek');
    const toTime = moment(START_TIME).endOf('isoWeek');

    const pageFilters = useMemo(() => {
        return [
            {
                name: FilterNames.nineWeek,
                type: FilterType.Date,
                data: {
                    fromTime,
                    toTime,
                    startDatePlaceholder: 'll',
                    endDatePlaceholder: 'll',
                } as DateFilterData,
            },
            ...(MeanTimeBetweenFailureTableAnalysisProperty.defaultFilters || []),
        ];
    }, [fromTime, toTime]);

    const defaultFilters = {
        [FilterNames.toTime]: toTime,
        [FilterNames.fromTime]: fromTime,
        [FilterNames.plantId]: plantId,
        // add your default filters for this page here ...
        ...buildFiltersFromData(pageFilters),
        [FilterNames.systemType]: SystemType.SWS,
        [FilterNames.carTypeId]: '0',
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
    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
    const lineOptions = useSelector(selectLines);
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };

    const onFilterChange = (filter: Filters) => {
        changeFilters(filter);
    };

    const [loadingState, setLoadingState] = useState<LoadingValue>({});
    const updateLoadingState = (key: string, loading: boolean) => {
        loadingState[key] = loading;
        setLoadingState(loadingState);
    };

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

    const crumbs: BreadcrumbLinks = useMemo(() => {
        const retVal = [
            {
                name: ScreenNames.home,
                label: t('ScreenName.Home'),
                href: '/home',
            },
            {
                name: ScreenNames.mtbfAnalysis,
                label: t('ScreenName.MtbfAnalysis'),
            },
            {
                name: FilterNames.singleDate,
                label: `Date : ${filters.fromTime.format(API_REQUEST_DATE_FORMAT)} - ${filters.toTime.format(
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

    return (
        <>
            <Helmet>
                <title>{t(messages.mtbfAnalysisPageTitle)}</title>
                <meta name="description" content="Description of MtbfAnalysis" />
            </Helmet>
            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={filters}
                    availableFilters={availableFilters}
                    defaultFilters={defaultFilters}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                />
            )}
            <Box sx={{ position: 'absolute', right: '10px', top: '50px' }}>
                {availableFilters.length > 0 && <FilterButton hanldeFilterPanelOpen={setFilterPanelOpen} />}
            </Box>
            <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', paddingTop: '10px' }}>
                <Breadcrumb crumbs={crumbs} onClick={onBreadcrumbChange} />
                <MeanTimeBetweenFailureAnalysisWidget
                    filters={filters}
                    onFilterChange={onFilterChange}
                    isLoading={(loading: boolean) => updateLoadingState('MtbfTable', loading)}
                />
            </Box>
        </>
    );
});

export default MtbfAnalysis;

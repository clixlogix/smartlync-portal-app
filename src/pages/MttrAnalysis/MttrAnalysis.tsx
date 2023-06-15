/**
 *
 * MttrAnalysis
 *
 */
import { useState, memo, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
    DashboardFilter,
    FilterType,
    SelectFilterData,
    DateFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { API_REQUEST_DATE_FORMAT } from 'constants/index';
import { useSelector } from 'react-redux';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import moment from 'moment';

import { useFilters } from 'utils/hooks/use-filters';
import { Page, PageProps } from 'pages';
import { MttrTable, MttrTableProperty } from 'widgets/MttrTable';
import { selectLines } from 'services/line/line-selectors';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { FilterButton } from 'components/FilterButton/FilterButton';
import { initialValues, SystemType } from 'constants/staticValues';
import { Box } from '@mui/material';
import { CarTypes, FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import { Pages } from 'constants/defaultDateConfig';
import { selectFixedRanges } from 'services/fixed-range/fixed-range-selectors';
import { messages } from './messages';

interface MttrAnalysisProps extends PageProps { }
const listOfLocalFilters = [];

export const MttrAnalysis: Page<MttrAnalysisProps> = memo((props: MttrAnalysisProps) => {
    const { t, i18n } = useTranslation();
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
            ...(MttrTableProperty.defaultFilters || []),
        ];
    }, []);

    const defaultFilters: Filters = {
        [FilterNames.toTime]: toTime,
        [FilterNames.fromTime]: fromTime,
        [FilterNames.plantId]: initialValues.default.plantID,
        [FilterNames.systemType]: SystemType.SWS,
        ...buildFiltersFromData(pageFilters),
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
            [FilterNames.langCode]: i18n.language,
            [FilterNames.carTypeId]: '0',
            [FilterNames.groupBy]: 'outlet',
        },
        listOfLocalFilters,
    });
    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const [availableFiltersFromData] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
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
                name: ScreenNames.mttrAnalysis,
                label: t('ScreenName.MttrAnalysis'),
            },
            {
                name: FilterNames.singleDate,
                label: `Date : ${filters.fromTime.format(API_REQUEST_DATE_FORMAT)} - ${filters.toTime.format(
                    API_REQUEST_DATE_FORMAT,
                )}`,
            },
        ];
        return retVal;
    }, [t, filters.fromTime, filters.toTime]);

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
                <title>{t(messages.mttrAnalysisPageTitle)}</title>
                <meta name="description" content="Description of MttrAnalysis" />
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
                <MttrTable
                    filters={filters}
                    onFilterChange={onFilterChange}
                    isLoading={(loading: boolean) => updateLoadingState('MttrTable', loading)}
                />
            </Box>
        </>
    );
});

export default MttrAnalysis;

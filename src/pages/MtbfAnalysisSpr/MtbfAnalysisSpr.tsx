/**
 *
 * MtbfAnalysisSpr
 *
 */

import HomeIcon from '@mui/icons-material/Home';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import {
    DashboardFilter,
    FilterType,
    SelectFilterData,
    DateFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { API_REQUEST_DATE_FORMAT } from 'constants/index';
import { CarTypes, FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import { Page, PageProps } from 'pages';
import { memo, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { selectLines } from 'services/line/line-selectors';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { MeanTimeBetweenFailureTableAnalysisSprProperty } from 'widgets';
import MeanTimeBetweenFailureTableAnalysisSpr from 'widgets/MeanTimeBetweenFailureTableAnalysisSpr/Loadable';

import { FilterButton } from 'components/FilterButton/FilterButton';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { SystemType } from 'constants/staticValues';
import { useSelector } from 'react-redux';
import { useFilters } from 'utils/hooks/use-filters';
import { messages } from './messages';
import moment from 'moment';
import { Box } from '@mui/material';
import { Pages } from 'constants/defaultDateConfig';
import { selectFixedRanges } from 'services/fixed-range/fixed-range-selectors';

interface MtbfAnalysisSprProps extends PageProps { }
const listOfLocalFilters = [];

export const MtbfAnalysisSpr: Page<MtbfAnalysisSprProps> = memo((props: MtbfAnalysisSprProps) => {
    const { t } = useTranslation();
    const { plantId } = useSelector(selectBreadcrumbFilters);
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.MTBF)), []);
    // const initialFromWeek = moment(START_TIME).subtract(8, 'isoWeek').startOf('isoWeek').format('YYYYWW');

    const fromTime = moment(START_TIME).subtract(8, 'isoWeek').startOf('isoWeek');
    const toTime = moment(START_TIME).endOf('isoWeek');

    const pageFilters = [
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
        ...(MeanTimeBetweenFailureTableAnalysisSprProperty.defaultFilters || []),
    ];

    const defaultFilters = {
        [FilterNames.toTime]: toTime,
        [FilterNames.fromTime]: fromTime,
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: SystemType.SPR,
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
            [FilterNames.groupBy]: 'outlet',
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
                icon: <HomeIcon />,
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
                <title>{t(messages.mtbfAnalysisSprPageTitle)}</title>
                <meta name="description" content="Description of MtbfAnalysis" />
            </Helmet>
            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={filters}
                    availableFilters={availableFilters}
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
                <MeanTimeBetweenFailureTableAnalysisSpr
                    filters={filters}
                    onFilterChange={onFilterChange}
                    isLoading={(loading: boolean) => updateLoadingState('MtbfTable', loading)}
                />
            </Box>
        </>
    );
});

export default MtbfAnalysisSpr;

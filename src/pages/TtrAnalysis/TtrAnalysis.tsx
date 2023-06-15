import React, { useState, memo, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { TtrTableProperty } from 'widgets';
import { Page, PageProps } from 'pages';
import { TtrTable } from 'widgets/TtrTable/Loadable';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import {
    DashboardFilter,
    FilterType,
    SelectFilterData,
    DateFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { CarTypes, FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { messages } from './messages';
import moment from 'moment';
import { Pages } from 'constants/defaultDateConfig';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { initialValues, SystemType } from 'constants/staticValues';
import { useSelector } from 'react-redux';
import { selectLines } from 'services/line/line-selectors';
import { useFilters } from 'utils/hooks/use-filters';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { FilterButton } from 'components/FilterButton/FilterButton';
import { Box } from '@mui/material';

interface TtrAnalysisProps extends PageProps { }

const listOfLocalFilters = [];

export const TtrAnalysis: Page<TtrAnalysisProps> = memo((props: TtrAnalysisProps) => {
    const { t, i18n } = useTranslation();
    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.TTR)), []);
    const { plantId } = useSelector(selectBreadcrumbFilters);
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const fromTime = moment(START_TIME).subtract(8, 'isoWeek').startOf('isoWeek');
    const toTime = moment(START_TIME).endOf('day');

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
            ...(TtrTableProperty.defaultFilters || []),
        ];
    }, []);

    const defaultFilters: Filters = {
        [FilterNames.plantId]: plantId,
        [FilterNames.toTime]: toTime,
        [FilterNames.fromTime]: fromTime,
        [FilterNames.systemType]: SystemType.SWS,
        ...buildFiltersFromData(pageFilters),
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
            [FilterNames.langCode]: i18n.language,
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

    const crumbs: BreadcrumbLinks = useMemo(() => {
        const retVal = [
            {
                name: ScreenNames.home,
                label: t('ScreenName.Home'),
                href: '/home',
            },
            {
                name: ScreenNames.ttrAnalysis,
                label: t('ScreenName.TtrAnalysis'),
            },
            // { name: FilterNames.weekRange, label: `Week Range: ${filters.weekRange}` },
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

    // if (filters[FilterNames.deviceName]) {
    //     crumbs.push(filters[FilterNames.deviceName]);
    // }

    return (
        <>
            <Helmet>
                <title>{t(messages.ttrAnalysisPageTitle)}</title>

                <meta name="description" content="Description of TtrAnalysis" />
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
                <TtrTable
                    filters={filters}
                    onFilterChange={onFilterChange}
                    isLoading={(loading: boolean) => updateLoadingState('TtrTableWidget', loading)}
                />
            </Box>
        </>
    );
});

export default TtrAnalysis;

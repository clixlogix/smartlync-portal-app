/**
 *
 * TtrAnalysisSpr
 *
 */

import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import { DashboardFilter, FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { CarTypes, FilterNames, Filters, LoadingValue } from 'models';
import { Page, PageProps } from 'pages';
import { memo, useMemo, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import styled from 'styled-components/macro';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { MttrTableSprProperty, TtrTableSprProperty } from 'widgets';
import { TtrTableSpr } from 'widgets/TtrTableSpr/Loadable';
import { messages } from './messages';

import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { initialValues, SystemType } from 'constants/staticValues';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { selectLines } from 'services/line/line-selectors';
import { useFilters } from 'utils/hooks/use-filters';
import { Pages } from 'constants/defaultDateConfig';
import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import './TtrAnalysisSpr.scss';

interface TtrAnalysisSprProps extends PageProps {}

const GridLayout = withSize()(Responsive);

const listOfLocalFilters = [];

export const TtrAnalysisSpr: Page<TtrAnalysisSprProps> = memo((props: TtrAnalysisSprProps) => {
    const { t, i18n } = useTranslation();

    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.TTR)), []);
    const pageFilters = [
        {
            name: FilterNames.weekRange,
            type: FilterType.Select,
            label: 'Week Range',
            data: {
                sinceTime: 6,
                weekRangeNumber: 9,
                dateFormat: 'MM/DD/YYYY([W]WW)',
                dateNow: START_TIME,
                options: [],
            } as SelectFilterData,
        },
        ...(TtrTableSprProperty.defaultFilters || []),
    ];

    const defaultFilters: Filters = useMemo(
        () => ({
            [FilterNames.plantId]: initialValues.default.plantID,
            [FilterNames.fromTime]: moment().subtract(9, 'isoWeek').startOf('isoWeek'),
            [FilterNames.toTime]: moment(),
            [FilterNames.systemType]: SystemType.SWS,
            ...buildFiltersFromData(pageFilters),
        }),
        [],
    );

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
            [FilterNames.langCode]: i18n.language,
        },
        listOfLocalFilters,
    });

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters };
    }, [apiFilters, localFilters]);

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
                name: FilterNames.plantId,
                label: t('General.Plant', { [FilterNames.plantId]: filters?.[FilterNames.plantId] }),
            },
            { name: FilterNames.systemType, menu: filters[FilterNames.systemType], options: ['SWS', 'SPR', 'SAT'] },
            {
                name: FilterNames.carTypeId,
                menu: carTypes.find(({ id }) => id === filters[FilterNames.carTypeId])?.name || carTypes[0]?.name,
                options: carTypes.map(({ name = '' }) => name),
                inactive: false,
            },
            { name: FilterNames.weekRange, label: `Week Range: ${filters.weekRange}` },
        ];
        return retVal;
    }, [carTypes, filters, t]);

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
            onLayoutChange: (layout, b) => {},
            height: '100%',
        }),
        [],
    );

    return (
        <>
            <Helmet>
                <title>{t(messages.ttrAnalysisSprPageTitle)}</title>

                <meta name="description" content="Description of TtrAnalysisSpr" />
            </Helmet>
            <Div className="x-cls-loader ">{isLoading && <ProgressBar className={'progress'} variant="buffer" />}</Div>
            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={filters}
                    availableFilters={availableFilters}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                />
            )}
            <Div className="control-buttons">
                {availableFilters.length > 0 && <FilterButton hanldeFilterPanelOpen={setFilterPanelOpen} />}
            </Div>
            <Div className={'x-cls-ttr-analysis-body x-cls-data-panel-container'}>
                <Breadcrumb crumbs={crumbs} onClick={onBreadcrumbChange} />

                <GridLayout style={{ height: '100%' }} className="layout" {...layoutProperties}>
                    <div
                        className="x-cls-dashboard-item maximize-widget-width maximize-widget-height"
                        key={`key-mttr-table-0`}
                        data-grid={{ ...MttrTableSprProperty.layout, static: false }}
                    >
                        <TtrTableSpr
                            className={'x-cls-mttr-table-widget'}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            isLoading={(loading: boolean) => updateLoadingState('TtrTableWidget', loading)}
                        />
                    </div>
                </GridLayout>
            </Div>
        </>
    );
});

const Div = styled.div``;

export default TtrAnalysisSpr;

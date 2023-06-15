/**
 *
 * CarBodyAnalysis
 *
 */
import React, { useState, memo, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { Responsive } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import { DashboardFilter } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { Filters, LoadingValue, FilterNames, CarTypes } from 'models';
import { buildAvailableFiltersFromData, buildFiltersFromData } from 'utils';
import { Page, PageProps } from 'pages';
import { messages } from './messages';
import { CarBodyGraph } from 'widgets/CarBody/CarBodyGraph';
import { CarbodyRiskTable } from 'widgets/CarbodyRiskTable';
import { CarBodyGraphProperty, CarbodyRiskTableProperty } from 'widgets';
import { useSelector } from 'react-redux';
import { useFilters } from 'utils/hooks/use-filters';
import { selectCarBodyGraphFilterValues } from 'services/car-body-graph/car-body-graph-selectors';
import { SystemType } from 'constants/staticValues';
import 'scss/main.scss';
import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import './CarBodyAnalysis.scss';
import { PageLayout } from 'components/PageLayout/PageLayout';

interface CarBodyAnalysisProps extends PageProps {}

const GridLayout = withSize()(Responsive);

const pageFilters = [...(CarBodyGraphProperty.defaultFilters || [])];

const listOfLocalFilters = [];

export const CarBodyAnalysis: Page<CarBodyAnalysisProps> = memo((props: CarBodyAnalysisProps) => {
    const { t } = useTranslation();
    const defaultFilters = {
        [FilterNames.plantId]: '',
        [FilterNames.carTypeId]: 0,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: SystemType.SWS,
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
        listOfLocalFilters,
    });

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters };
    }, [apiFilters, localFilters]);

    const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };

    const onFilterChange = (filter: Filters) => {
        changeFilters(filter);
    };

    const [loadingState, setLoadingState] = useState<LoadingValue>({});
    const updateLoadingState = (key: string, loading: boolean) => {
        loadingState[key] = loading;
        setLoadingState(loadingState);
    };
    // const isLoading: boolean = useMemo(() => {
    //     return [
    //         ...Object.values(loadingState),
    //         // add your isLoading here
    //     ].reduce((acc: boolean, value: boolean) => {
    //         acc = acc ? acc : value;
    //         return acc;
    //     }, false);
    // }, [
    //     loadingState,
    //     // add your other Widget isLoading code here
    // ]);

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
        ];

        // if (filters?.[FilterNames.deviceName]) {
        //     retVal.push(filters[FilterNames.deviceName]);
        // }
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
            width: 1200,
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
                <title>{t(messages.carBodyAnalysisPageTitle)}</title>
                <meta name="description" content="Description of CarBodyAnalysis" />
            </Helmet>
            <PageLayout
                filters={filters}
                availableFilters={availableFilters}
                onFilterChange={onFilterChange}
                filterValues={() => {
                    const filterValues = [
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useSelector(selectCarBodyGraphFilterValues),
                    ].reduce((acc, filters) => {
                        acc = { ...acc, ...filters };
                        return acc;
                    }, {} as any);

                    return filterValues;
                }}
            >
                <Div className={'x-cls-car-body-analysis-body x-cls-data-panel-container'}>
                    <Div className="toolbar-section">
                        <Breadcrumb
                            availableFilters={availableFilters}
                            filters={filters}
                            crumbs={crumbs}
                            onClick={onBreadcrumbChange}
                            filterValues={() => {
                                const filterValues = [
                                    // eslint-disable-next-line react-hooks/rules-of-hooks
                                    useSelector(selectCarBodyGraphFilterValues),
                                ].reduce((acc, filters) => {
                                    acc = { ...acc, ...filters };
                                    return acc;
                                }, {} as any);

                                return filterValues;
                            }}
                        />
                    </Div>
                    <GridLayout
                        style={{ height: '100%' }}
                        className="layout"
                        // onSize={onSize}
                        {...layoutProperties}
                    >
                        <Div
                            className="x-cls-dashboard-item  maximize-widget-width"
                            key={`key-car-body-graph`}
                            data-grid={{
                                ...CarBodyGraphProperty.layout,
                                x: 0,
                                y: 0,
                                w: 3,
                                h: 3,
                                static: true,
                            }}
                        >
                            <CarBodyGraph
                                className="x-cls-carbody-graph-widget"
                                filters={filters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) => updateLoadingState('CarBodyGraph', loading)}
                            />
                        </Div>

                        <Div
                            className="x-cls-dashboard-item    maximize-widget-width"
                            key={`key-car-body-risk-table`}
                            data-grid={{
                                ...CarbodyRiskTableProperty.layout,
                                x: 0,
                                y: 3,
                                w: 2,
                                h: 4,
                                static: true,
                            }}
                        >
                            <CarbodyRiskTable
                                className="x-cls-carbody-risk-table-widget"
                                filters={filters}
                                onFilterChange={onFilterChange}
                                isLoading={(loading: boolean) => updateLoadingState('CarbodyRiskTable', loading)}
                            />
                        </Div>
                    </GridLayout>
                </Div>
            </PageLayout>
        </>
    );
});

const Div = styled.div``;

export default CarBodyAnalysis;

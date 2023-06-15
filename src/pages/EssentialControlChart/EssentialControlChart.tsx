/**
 *
 * EssentialControlChart
 *
 */

import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import { ChartRef } from 'components/panels/Chart/Chart';
import { DashboardFilter, DateFilterData, FilterType } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { API_REQUEST_DATE_FORMAT } from 'constants/index';
import { SystemType } from 'constants/staticValues';
import { CarTypes, FilterNames, Filters, LoadingValue, ScreenNames } from 'models';
import moment from 'moment';
import { Page, PageProps } from 'pages';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import {
    selectEssentialControlWidgetss,
    selectEssentialControlWidgetsIsLoading,
    selectEssentialControlWidgetsFiltersValues,
} from 'services/essential-control-widgets/essential-control-widgets-selectors';

import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import { EssentialControlWidgets } from 'widgets';
import { EssentialControlWidgetsProperty } from 'widgets';
import {
    essentialControlWidgetsActions,
    essentialControlWidgetsReducer,
    essentialControlWidgetsKey,
} from 'services/essential-control-widgets/essential-control-widgets-reducer';
import { getAllEssentialControlWidgetssSaga } from 'services/essential-control-widgets/sagas/essential-control-widgets-saga-get-all';

import { messages } from './messages';
import { Pages } from 'constants/defaultDateConfig';
import * as _ from 'lodash';
import { FilterButton } from 'components/FilterButton/FilterButton';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import './EssentialControlChart.scss';
import { Box, Grid } from '@mui/material';
import Loader from 'components/Loader';

interface EssentialControlChartProps extends PageProps { }

export const EssentialControlChart: Page<EssentialControlChartProps> = memo((props: EssentialControlChartProps) => {
    const { t } = useTranslation();

    useInjectReducer({ key: essentialControlWidgetsKey, reducer: essentialControlWidgetsReducer });
    useInjectSaga({ key: essentialControlWidgetsKey, saga: getAllEssentialControlWidgetssSaga });
    const { plantId } = useSelector(selectBreadcrumbFilters);

    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const essentialControlChartsWidgets: any | undefined = useSelector(selectEssentialControlWidgetss);

    const essentialControlChartsCard = [
        { value: 'liftHeight', unit: 'mm', title: 'Lift' },
        { value: 'penetration', unit: 'mm', title: 'Penetration' },
        { value: 'voltage', unit: 'v', title: 'Voltage' },
        { value: 'weldTime', unit: 'ms', title: 'Welding Time' },
    ];
    const essentialControlWidgetsIsLoading: boolean = useSelector(selectEssentialControlWidgetsIsLoading);

    const dispatch = useDispatch();
    const START_TIME = moment(getDefaultFilterDate(Pages.EssentialControls));
    const pageFilters = useMemo(() => {
        return [
            {
                name: FilterNames.dateRange,
                type: FilterType.Date,
                data: {
                    fromTime: moment(START_TIME).startOf('day'),
                    toTime: moment(START_TIME).endOf('day'),
                    startDatePlaceholder: 'll',
                    endDatePlaceholder: 'll',
                } as DateFilterData,
            },
            ...(EssentialControlWidgetsProperty.defaultFilters || []),
        ];
    }, [START_TIME]);

    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: SystemType.SWS,
        [FilterNames.carTypeId]: '0',
        [FilterNames.fromTime]: moment(START_TIME).clone().startOf('day'),
        [FilterNames.toTime]: moment(START_TIME).clone().endOf('day'),
        field: essentialControlChartsCard.map((data) => data.value),
    };

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
        },
    });

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);

    const [availableFiltersFromData] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };
    const availableFilters = [...availableFiltersFromData];

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
                name: ScreenNames.home,
                label: t('ScreenName.Home'),
                href: '/home',
            },
            {
                name: ScreenNames.essentialControlCharts,
                label: t('ScreenName.EssentialControlCharts'),
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

    useEffect(() => {
        onFilterChange({
            ...apiFilters,
            ...breadCrumbsDataType,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const filter = _.omitBy(
            {
                [FilterNames.deviceName]: filters.deviceName,
                [FilterNames.langCode]: filters.selectedLanguage,
                [FilterNames.fromTime]: filters.fromTime,
                [FilterNames.toTime]: filters.toTime,
                [FilterNames.systemType]: filters.systemType,
                [FilterNames.field]: filters.field,
                [FilterNames.studId]: filters.studId,
                [FilterNames.outletNo]: filters.outletNo,
                [FilterNames.feederNo]: filters.feederNo,
            },
            _.isNil,
        );
        dispatch(essentialControlWidgetsActions.getAllEssentialControlWidgetss(filter));
    }, [
        dispatch,
        filters.deviceName,
        filters.fromTime,
        filters.selectedLanguage,
        filters.station,
        filters.systemType,
        filters.toTime,
        filters.field,
        filters.studId,
        filters.outletNo,
        filters.feederNo,
    ]);

    const renderEssentialControlChartWidgets = () => {
        return _.map(essentialControlChartsWidgets, function (value, key) {
            const paramData =
                essentialControlChartsCard.find((ele) => ele.value === key) || essentialControlChartsCard[0];
            return (
                <>
                    <Grid item md={12} xs={12}>
                        {essentialControlWidgetsIsLoading ? (
                            <Loader circle />
                        ) : (
                            <EssentialControlWidgets
                                key={`essentialWidget-${key}`}
                                filters={filters}
                                localFilters={localFilters}
                                onFilterChange={onFilterChange}
                                data={paramData}
                                chartData={value}
                                title={key.toString()}
                                isLoading={(loading: boolean) => updateLoadingState('Voltage', loading)}
                                onClick={(event) => onChartClick('Voltage', event)}
                                getRef={getRef}
                                refs={refs}
                            />
                        )}
                    </Grid>
                </>
            );
        });
    };

    const onChartClick = (chart: string, event) => { };

    const [refs, setRefs] = useState<ChartRef[]>([]);

    const getRef = useCallback(
        (newRef: ChartRef) => {
            setRefs([...refs, newRef]);
        },
        [refs],
    );
    console.log(
        '%cEssentialControlChart.tsx line:257 isEmpty(essentialControlChartsWidgets)',
        'color: #007acc;',
        essentialControlChartsWidgets.length,
    );

    return (
        <>
            <Helmet>
                <title>{t(messages.essentialControlChartPageTitle)}</title>
                <meta name="description" content="Description of EssentialControlChart" />
            </Helmet>
            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={filters}
                    availableFilters={Array.from(availableFilters.values())}
                    defaultFilters={defaultFilters}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                    filterValues={() => {
                        const filterValues = [
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useSelector(selectEssentialControlWidgetsFiltersValues),
                        ].reduce((acc, filters) => {
                            acc = { ...acc, ...filters };
                            return acc;
                        }, {} as any);

                        return filterValues;
                    }}
                />
            )}
            <Grid container xs={12} sx={{ width: '100%' }}>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '20px',
                            flex: '1,1',
                        }}
                    >
                        <Breadcrumb crumbs={crumbs} onClick={onBreadcrumbChange} />
                        {availableFilters.length > 0 && (
                            <FilterButton
                                isEdit={false}
                                isLayoutEdit={editPageLayout}
                                hanldeLayoutEdit={setEditPageLayout}
                                hanldeFilterPanelOpen={setFilterPanelOpen}
                            />
                        )}
                    </Box>
                </Grid>
                {essentialControlWidgetsIsLoading ? (
                    <Loader circle />
                ) : Object.keys(essentialControlChartsWidgets).length > 0 ? (
                    <Grid
                        sx={{
                            marginTop: '20px',
                            marginBottom: '20px',
                            height: 'calc(100vh - 200px)',
                            overflowY: 'auto',
                        }}
                        item
                        xs={12}
                    >
                        <Box
                            key={`key-measurements`}
                            data-grid={{ ...EssentialControlWidgetsProperty.layout, static: false }}
                        >
                            <Grid container rowSpacing={5}>
                                {!_.isEmpty(essentialControlChartsWidgets) && renderEssentialControlChartWidgets()}
                            </Grid>
                        </Box>
                    </Grid>
                ) : (
                    <Grid sx={{ display: 'flex', justifyContent: 'center' }} item xs={12}>
                        {t(messages.noData)}
                    </Grid>
                )}
            </Grid>
        </>
    );
});

export default EssentialControlChart;

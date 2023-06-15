/**
 *
 * ProcessLogViewSpr
 *
 */
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import { memo, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
// import { ProcessLog as ProcessLogWidget } from 'widgets/ProcessLog/Loadable';
import { useTheme } from '@mui/material/styles';
import { FilterButton } from 'components/FilterButton/FilterButton';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import { DashboardFilter, DateFilterData, FilterType } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { CarTypes, FilterNames, Filters, LoadingValue, ScreenNames, SidePanelOpenState } from 'models';
import { Page, PageProps } from 'pages';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { selectOperationItemFilterValues } from 'services/process-operation/process-operation-selectors';
import { buildAvailableFiltersFromData, buildFiltersFromData, getDefaultFilterDate } from 'utils';
import { ProcessLogSprProperty } from 'widgets/ProcessLogSpr';
import { ProcessLogSpr as ProcessLogWidget } from 'widgets/ProcessLogSpr/Loadable';
import { StationAnomalyProperty } from 'widgets/StationAnomaly';
import { StationAnomaly } from 'widgets/StationAnomaly/Loadable';
import { messages } from './messages';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';

import { Box } from '@mui/material';
import { API_REQUEST_DATE_FORMAT } from 'constants/index';
import moment from 'moment';
import { Resizable } from 're-resizable';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
//import { ExtraDataSpr } from 'widgets/StationAnomaly/ExtraDataSpr/ExtraDataSpr';
import './ProcessLogViewSpr.scss';
import { useFilters } from 'utils/hooks/use-filters';
import { Pages } from 'constants/defaultDateConfig';

enum ActivityState {
    RealTime = 'active',
    Range = 'date-range',
}

interface ProcessLogViewSprProps extends PageProps { }

const listOfLocalFilters = [];

export const ProcessLogViewSpr: Page<ProcessLogViewSprProps> = memo((props: ProcessLogViewSprProps) => {
    const { t } = useTranslation();
    const { plantId } = useSelector(selectBreadcrumbFilters);

    const pageFilters = useMemo(() => {
        const START_TIME = moment(getDefaultFilterDate(Pages.DiagnosticLog));
        return [
            {
                name: FilterNames.fromTime,
                type: FilterType.Select,
                data: {
                    fromTime: moment(START_TIME),
                    toTime: moment(START_TIME).add(1, 'hours'),
                } as DateFilterData,
            },
            ...(StationAnomalyProperty.defaultFilters || []),
            ...(ProcessLogSprProperty.defaultFilters || []),
        ];
    }, []);

    const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));
    // const [filterPanelState] = useState<SidePanelOpenState>(SidePanelOpenState.Open);
    const [activityState, setActivityState] = useState<ActivityState>(ActivityState.Range);
    const [stationInfoPanelState, setStationInfoPanelState] = useState<SidePanelOpenState>(SidePanelOpenState.Open);
    const [extraPanelState, setExtraPanelState] = useState<SidePanelOpenState>(SidePanelOpenState.Close);
    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };
    const [dimension, setDimension] = useState({ width: 400, display: 'block' });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const onRowClick = async (rowData: string[], rowMeta: { dataIndex: number; rowIndex: number }) => {
        setSelectedIndex(rowMeta.dataIndex);
    };
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const defaultFilters = {
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        [FilterNames.systemType]: 'SPR',
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

    const {
        palette,
        palette: { mode },
    } = useTheme();
    useEffect(() => {
        setSelectedIndex(0);
    }, [activityState]);
    const handleExtraPanelState = (value: SidePanelOpenState) => {
        setExtraPanelState(value);
    };

    const onFilterChange = (filter: Filters) => {
        changeFilters(filter);
    };

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
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

    const crumbs: BreadcrumbLinks = useMemo(() => {
        const retVal = [
            {
                name: ScreenNames.home,
                label: t('ScreenName.Home'),
                href: '/home',
            }, // { name: FilterNames.systemType, menu: filters[FilterNames.systemType], options: ['SWS', 'SPR', 'SAT'] },
            {
                name: ScreenNames.diagnosticView,
                label: t('ScreenName.DiagnosticView'),
            },
        ];
        if (activityState === ActivityState.RealTime && retVal[2]) {
            retVal.pop();
        }
        if (activityState === ActivityState.Range) {
            retVal.push({
                name: ScreenNames.dateRange,
                label: `Date Range: ${filters.fromTime.format(API_REQUEST_DATE_FORMAT)} - ${filters.toTime.format(
                    API_REQUEST_DATE_FORMAT,
                )}`,
            });
        }

        return retVal;
    }, [t, activityState, filters.fromTime, filters.toTime]);

    const onBreadcrumbChange = (crumb: string | Filters) => {
        if (typeof crumb === 'string') {
            return;
        }

        if (crumb[FilterNames.carTypeId]) {
            const carId = carTypes.find(({ name }) => name === crumb[FilterNames.carTypeId])?.id;

            if (carId) {
                crumb[FilterNames.carTypeId] = carId;
            }
        }
        onFilterChange({ ...(crumb as Filters) });
    };

    const startDatePlaceholder = t(messages.processLogViewDateFilterBarBtn);

    const openGraphSlideer = (activity: ActivityState) => {
        setDimension({ width: 400, display: 'block' });
        setActivityState(activity);
        setStationInfoPanelState(SidePanelOpenState.Open);
    };

    const closeGraphSlider = (activity: SidePanelOpenState) => {
        setDimension({ width: 400, display: 'none' });
        setActivityState(ActivityState.Range);
        setStationInfoPanelState(activity);
    };

    const handleDimension = (e, direction, ref, d) => {
        let width = dimension.width + d.width;
        width = parseInt(width);
        const halfWindow = window.innerWidth / 2;
        if (width > halfWindow) width = halfWindow;
        setDimension({
            width,
            display: 'block',
        });
    };

    return (
        <>
            <Helmet>
                <title>{t(messages.processLogViewSprPageTitle)}</title>
                <meta name="description" content="Description of ProcessLogView" />
            </Helmet>

            <DashboardFilterPanel
                filters={filters}
                availableFilters={Array.from(availableFilters.values())}
                defaultFilters={defaultFilters}
                open={filterPanelOpen}
                onFilterChange={onFilterChange}
                disabled={isLoading}
                setOpen={() => setFilterPanelOpen(false)}
                filterValues={() => {
                    const filterValues = [
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useSelector(selectOperationItemFilterValues),
                    ].reduce((acc, filters) => {
                        acc = { ...acc, ...filters };
                        return acc;
                    }, {} as any);

                    return filterValues;
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: dimension.display === 'block' ? `calc(100% - ${dimension.width}px)` : '100%',
                        overflowY: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            margin: '12px 0px',
                            width: '100%',
                            maxWidth: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box>
                            <Breadcrumb
                                availableFilters={availableFilters}
                                filters={filters}
                                crumbs={crumbs}
                                onClick={onBreadcrumbChange}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginLeft: '10px',
                            }}
                        >
                            <Button
                                sx={{ borderRadius: '100px', minWidth: 'fit-content' }}
                                variant="outlined"
                                onClick={() => openGraphSlideer(ActivityState.RealTime)}
                            >
                                <BlurOnOutlinedIcon />
                                &nbsp; &nbsp; Real Time &nbsp;
                            </Button>
                            <Button
                                sx={{ borderRadius: '100px', marginLeft: '13px', minWidth: 'fit-content' }}
                                variant="outlined"
                                onClick={() => openGraphSlideer(ActivityState.Range)}
                            >
                                {startDatePlaceholder}
                            </Button>
                            {availableFilters.length > 0 && (
                                <Box sx={{ marginLeft: '10px' }}>
                                    <FilterButton hanldeFilterPanelOpen={setFilterPanelOpen} />
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <ProcessLogWidget
                        type={activityState}
                        filters={filters}
                        onFilterChange={onFilterChange}
                        activityState={activityState}
                        isLoading={(loading: boolean) => updateLoadingState('ProcessLogWidget', loading)}
                        onRowClick={onRowClick}
                    />
                </Box>

                <Box
                    sx={{
                        height: 'calc(100vh - 60px)',
                        overflowY: 'auto',
                        backgroundColor: mode === 'light' ? palette?.grey[200] : palette?.common?.black,
                        overflowX: 'hidden',
                    }}
                >
                    <Resizable
                        size={{ width: dimension.width, height: 'auto' }}
                        style={{
                            display: dimension.display,
                            paddingRight: '15px',
                        }}
                        onResizeStop={handleDimension}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>
                            <CloseIcon
                                sx={{ marginLeft: 'auto' }}
                                onClick={() => closeGraphSlider(SidePanelOpenState.Close)}
                            />
                            <StationAnomaly
                                filters={filters}
                                // openState={stationInfoPanelState}
                                isLoading={(loading: boolean) => updateLoadingState('StationAnomalyWidget', loading)}
                                extraPanelState={extraPanelState}
                                handleExtraPanelState={handleExtraPanelState}
                                width={dimension.width - 20}
                                selectedIndex={selectedIndex}
                                activityState={activityState}
                                dataType="SPR"
                                type={activityState}
                            />
                        </Box>
                    </Resizable>
                </Box>
            </Box>
        </>
    );
});

export default ProcessLogViewSpr;

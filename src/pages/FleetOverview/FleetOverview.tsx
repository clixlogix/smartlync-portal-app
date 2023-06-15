/**
 *
 * FleetOverview
 *
 */
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Breadcrumb, { BreadcrumbLinks } from 'components/Breadcrumb';
import { DeviceInfoCard } from 'components/cards';
import { DeviceExpand } from 'components/cards/DeviceExpand';
import { FilterButton } from 'components/FilterButton/FilterButton';
import ProgressBar from 'components/LinearProgress/LinearProgress';
import Loader from 'components/Loader';
import DashboardFilterPanel from 'components/panels/DashboardFilterPanelNew/Loadable';
import {
    DashboardFilter,
    DateFilterData,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import Constants, { API_REQUEST_DATE_FORMAT } from 'constants/index';
import { SystemType } from 'constants/staticValues';
import { FilterNames, Filters, ScreenNames, SystemOverview, SystemOverviews } from 'models';
import moment from 'moment';
import { Page, PageProps } from 'pages';
import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import 'scss/main.scss';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectLines } from 'services/line/line-selectors';
import { rulesPanelKey, rulesPanelReducer } from 'services/rules-panel/rules-panel-reducer';
import {
    systemOverviewsActions,
    systemOverviewsKey,
    systemOverviewsReducer,
} from 'services/system-overview/system-overview-reducer';
import { systemOverviewsSaga } from 'services/system-overview/system-overview-saga';
import {
    selectOperationItemFilterValues,
    selectSystemOverviews,
    selectSystemOverviewsIsLoading,
} from 'services/system-overview/system-overview-selectors';
import styled from 'styled-components/macro';
import {
    buildAvailableFiltersFromData,
    buildFiltersFromData,
    getDefaultFilterDate,
    useLocalStorage,
    useQueryParam,
} from 'utils';
import { useFilters } from 'utils/hooks/use-filters';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { DevicesFaultReportProperty } from 'widgets';
import './FleetOverview.scss';
import { messages } from './messages';
import { Typography } from '@mui/material';
import { Pages } from 'constants/defaultDateConfig';

interface FleetOverviewProps extends PageProps { }
interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
};

const listOfLocalFilters = [];

export const FleetOverview: Page<FleetOverviewProps> = memo((props: FleetOverviewProps) => {
    useInjectReducer({ key: systemOverviewsKey, reducer: systemOverviewsReducer });
    useInjectSaga({ key: systemOverviewsKey, saga: systemOverviewsSaga });
    useInjectReducer({ key: rulesPanelKey, reducer: rulesPanelReducer });

    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.FleetOverview)), []);
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
                    isNineWeekView: true,
                } as DateFilterData,
            },
            ...(DevicesFaultReportProperty.defaultFilters || []),
        ];
    }, []);

    const defaultFilters = {
        // [FilterNames.fromTime]: fromTime,
        // [FilterNames.toTime]: toTime,
        [FilterNames.systemType]: SystemType.SWS,
        [FilterNames.week]: 15, //Hard coded week number //Need to remove this once we have data in local to previous week
        [FilterNames.deviceName]: '',
        [FilterNames.eventCode]: '',
        [FilterNames.station]: '',
        [FilterNames.deviceSubLine]: 0,
        ...buildFiltersFromData(pageFilters),
    };

    const [faultCode] = useQueryParam<string>('faultCode', defaultFilters.eventCode);
    // const [plantId] = useQueryParam<string>(FilterNames.plantId, '1', true);

    const { plantId } = useSelector(selectBreadcrumbFilters);

    const { t, i18n } = useTranslation();
    // const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };
    const lineOptions = useSelector(selectLines);
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const { apiFilters, localFilters, changeFilters } = useFilters({
        defaultFilters: {
            ...defaultFilters,
            [FilterNames.plantId]: plantId,
            [FilterNames.systemType]: SystemType.SWS,
            langCode: [i18n.language],
            [FilterNames.eventCode]: faultCode,
        },
        listOfLocalFilters,
    });

    const filters = useMemo(() => {
        return { ...apiFilters, ...localFilters, ...breadCrumbsDataType };
    }, [apiFilters, localFilters, breadCrumbsDataType]);
    const systemOverviews: SystemOverviews = useSelector(selectSystemOverviews);

    const systemOverviewsIsLoading = useSelector(selectSystemOverviewsIsLoading);
    const dispatch = useDispatch();

    const [availableFiltersFromData] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));

    const availableFilters = [
        ...availableFiltersFromData,
        {
            name: FilterNames.deviceLine,
            type: FilterType.Select,
            data: { options: lineOptions } as SelectFilterData,
        },
    ];
    const [zoomedDevices, setZoomedDevices] = useLocalStorage<SystemOverviews>(
        Constants.storageKeys.fleetOverviewZoomed,
        [],
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [pageTitle, setPageTitle] = useState<string>(t(messages.fleetOverviewTitle));

    const onFilterChange = (filter: Filters) => {
        changeFilters(filter);
    };

    useEffect(() => {
        dispatch(systemOverviewsActions.systemOverviews({ ...filters, ...breadCrumbsDataType }));
    }, [dispatch, filters, breadCrumbsDataType]);

    const [currentTab, setCurrentTab] = React.useState(0);

    const crumbs: BreadcrumbLinks = useMemo(() => {
        const fromTime = filters.fromTime.startOf('isoWeek').format(API_REQUEST_DATE_FORMAT);
        const toTime = filters.toTime.endOf('isoWeek').format(API_REQUEST_DATE_FORMAT);
        const retVal = [
            {
                name: ScreenNames.home,
                label: t('ScreenName.Home'),
                href: '/home',
            },
            {
                name: ScreenNames.reportingView,
                label: t('ScreenName.FleetOverview'),
            },
            {
                name: `dateRange`,
                label: `Date Range: ${fromTime}  - ${toTime}`,
            },
        ];

        return retVal;
    }, [filters.fromTime, filters.toTime, t]);

    const displayRows = useMemo(() => {
        if (currentTab === 0) {
            return (systemOverviews || []).filter((row) => !row.hidden);
        }
        if (currentTab === 1) {
            return (systemOverviews || []).filter((row) => !row.hidden && row.pinned);
        }

        return [];
    }, [currentTab, systemOverviews]);

    const onBreadcrumbChange = (crumb: string | Filters) => {
        if (typeof crumb === 'string') {
            // a link was selected to route to page
        }
        // a filter was selected so update filters
        onFilterChange({ ...(crumb as Filters) } as any);
    };

    const onHandlePinClick = (deviceName: FilterNames, isPinned: boolean) => {
        isPinned
            ? dispatch(systemOverviewsActions.unPinSystemOverviews(deviceName))
            : dispatch(systemOverviewsActions.pinSystemOverviews(deviceName));
    };

    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);

    const onHandleExpandChange = (card: SystemOverview, remove: boolean = false) => {
        if (remove) {
            const newZoomedDevices: SystemOverviews = zoomedDevices?.filter((k) => k.deviceName !== card.deviceName);
            setZoomedDevices(newZoomedDevices);
            setPageTitle(t(messages.fleetOverviewTitle));
            onFilterChange({ deviceName: '' });
        } else {
            const haveName = zoomedDevices.some((k) => k?.deviceName === card.deviceName);

            if (!haveName) {
                const newZoomedDevices: SystemOverviews = [...zoomedDevices, card];
                setCurrentTab(1 + newZoomedDevices.length);
                setZoomedDevices(newZoomedDevices);
            }
        }
    };

    const renderCardBoard = (cards: any[]) => {
        return (
            <Div className="stanleyRow system-cards" style={{ color: 'white' }}>
                {cards.map(
                    (card, index) =>
                        !card.hidden && (
                            <DeviceInfoCard
                                key={`key-overview-card-${index}`}
                                data={card}
                                className={'x-cls-overview-card'}
                                onHandlePinClick={(deviceName: FilterNames) =>
                                    onHandlePinClick(deviceName, card.pinned)
                                }
                                onExpand={(e) => onHandleExpandChange(card, false)}
                            />
                        ),
                )}
            </Div>
        );
    };

    const renderNoData = () => {
        return <Typography>{t(messages.noData)}</Typography>;
    };

    const deviceTabButton = (props: any, deviceName: string) => {
        return (
            <Div className={'x-device-tab-btn-wrapper'}>
                <button {...props} />
                <button
                    className={'x-delete-btn'}
                    onClick={() => onHandleExpandChange({ deviceName: deviceName }, true)}
                >
                    <CancelIcon
                        onClick={() => {
                            setCurrentTab(0);
                            setPageTitle(t(messages.fleetOverviewTitle));
                        }}
                    />
                </button>
            </Div>
        );
    };

    const handleChange = (event, newValue) => {
        if (newValue === 0) {
            setPageTitle(t(messages.fleetOverviewTitle));
            setCurrentTab(newValue);
        } else {
            setCurrentTab(newValue);
        }
    };

    const renderZoomedDevices = () => {
        return zoomedDevices.map((device, index) => (
            <TabPanel value={currentTab} index={2 + index} key={`zoomed-devices-label-key-${2 + index}`}>
                <Div className={'x-cls-system-overviews-wrapper'}>
                    <DeviceExpand cardInfo={device} filters={filters} />
                </Div>
            </TabPanel>
        ));
    };

    const renderTabBodyContent = () => {
        return zoomedDevices.map(({ deviceName }, index) => (
            <Tab
                label={deviceName}
                key={`zoomed-devices-label-key-${index}-01223`}
                component={(e) => deviceTabButton(e, deviceName)}
            />
        ));
    };

    return (
        <>
            <Helmet>
                <title>{t(messages.fleetOverviewPageTitle)}</title>

                <meta name="description" content="Description of FleetOverview" />
            </Helmet>
            <Div className="x-cls-loader ">
                {systemOverviewsIsLoading && <ProgressBar className={'progress'} variant="buffer" />}
            </Div>
            {availableFilters.length > 0 && (
                <DashboardFilterPanel
                    filters={{ ...filters }}
                    availableFilters={availableFilters}
                    defaultFilters={defaultFilters}
                    open={filterPanelOpen}
                    setOpen={() => setFilterPanelOpen(false)}
                    onFilterChange={onFilterChange}
                />
            )}
            <div className="x-cls-fleet-overview-body">
                <Div className={'x-cls-data-panel-container stanleyCol'}>
                    <Div className={'title-wrapper-fleet-overview'}>
                        {/* <PageTitle label={pageTitle} /> */}
                        <Breadcrumb
                            className="x-cls-fleet-overview-body "
                            availableFilters={availableFilters}
                            filters={filters}
                            crumbs={crumbs}
                            onClick={onBreadcrumbChange}
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
                        {availableFilters.length > 0 && (
                            <FilterButton isEdit={false} hanldeFilterPanelOpen={setFilterPanelOpen} />
                        )}
                    </Div>

                    <Div className=" x-cls-page-system-overview">
                        <div className="tab-container">
                            <Tabs
                                value={currentTab}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs"
                            >
                                <Tab label={t(messages.allDevices)} />
                                <Tab label={t(messages.pinnedDevices)} />
                                {renderTabBodyContent()}
                            </Tabs>
                            <div className="tab-body x-cls-tabs">
                                <TabPanel value={currentTab} index={0} key={`fleet-zoomed-devices-label-key-${0}`}>
                                    {systemOverviewsIsLoading ? (
                                        <Loader circle />
                                    ) : (
                                        <Div className={'x-cls-system-overviews-wrapper'}>
                                            {displayRows.length > 0 ? renderCardBoard(displayRows) : renderNoData()}
                                        </Div>
                                    )}
                                </TabPanel>
                                <TabPanel
                                    value={currentTab}
                                    index={1}
                                    key={`fleet-ovefview-zoomed-devices-label-key-${1}`}
                                >
                                    {systemOverviewsIsLoading ? (
                                        <Loader circle />
                                    ) : (
                                        <Div className={'x-cls-system-overviews-wrapper-2'}>
                                            {displayRows.length > 0 ? renderCardBoard(displayRows) : renderNoData()}
                                        </Div>
                                    )}
                                </TabPanel>
                                {renderZoomedDevices()}
                            </div>
                        </div>
                    </Div>
                </Div>
            </div>
        </>
    );
});

const Div = styled.div``;

export default FleetOverview;

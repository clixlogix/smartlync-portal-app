/**
 *
 * StationAvailabilityTrend
 *
 */
import React, { useState, memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    stationAvailabilityTrendActions,
    stationAvailabilityTrendReducer,
    stationAvailabilityTrendKey,
} from 'services/station-availability-trend/station-availability-trend-reducer';
import {
    selectStationAvailabilityTrends,
    selectStationAvailabilityTrendIsLoading,
} from 'services/station-availability-trend/station-availability-trend-selectors';

import { getAllStationAvailabilityTrendsSaga } from 'services/station-availability-trend/sagas/station-availability-trend-saga-get-all';
import {
    // DashboardFilter,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { Filters, StationAvailabilityTrends, FilterNames, HeadType } from 'models';
// import {
//     DashboardFilter,
//     DateFilterData,
//     FilterType,
//     SelectFilterData,
// } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import moment from 'moment';
import { selectFixedRanges } from 'services/fixed-range/fixed-range-selectors';
import replace from 'lodash/replace';
import upperFirst from 'lodash/upperFirst';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import { messages } from './messages';
import { Pages } from 'constants/defaultDateConfig';
import { getDefaultFilterDate } from 'utils';
import { useTheme } from '@mui/material';
import { chartTheme, ThemeModes } from 'styles/theme/themes';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import Loader from 'components/Loader';

import 'scss/main.scss';
import './StationAvailabilityTrend.scss';
import { Chart } from 'components';

interface StationAvailabilityTrendProps extends WidgetProps {
    onFilterChange?(filter: Filters);
}

export const StationAvailabilityTrendWidget: Widget<StationAvailabilityTrendProps> = memo(
    (props: StationAvailabilityTrendProps) => {
        const { className = '', filters = {}, onFilterChange = () => { } } = props;
        useInjectReducer({ key: stationAvailabilityTrendKey, reducer: stationAvailabilityTrendReducer });

        useInjectSaga({ key: stationAvailabilityTrendKey, saga: getAllStationAvailabilityTrendsSaga });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { t, i18n } = useTranslation();

        const stationAvailabilityTrends: any = useSelector(selectStationAvailabilityTrends);
        const stationAvailabilityTrendIsLoading: boolean = useSelector(selectStationAvailabilityTrendIsLoading);
        const dispatch = useDispatch();
        const newOptions: any = useSelector(selectFixedRanges);
        const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.TA)), []);
        const initialFromWeek = moment(START_TIME).clone().subtract(9, 'isoWeek').startOf('isoWeek').format('YYYYWW');

        const theme = useTheme();
        const themePalette = theme.palette;
        const themeMode: 'light' | 'dark' = themePalette.mode;

        if (props.isLoading) {
            props.isLoading(stationAvailabilityTrendIsLoading);
        }

        const [widgetFilters] = useState<Filters>({
            fromTime: moment(START_TIME).subtract(9, 'isoWeek').startOf('isoWeek'),
            toTime: moment(START_TIME).subtract(1, 'isoWeek').endOf('isoWeek'),
            [FilterNames.carTypeId]: '0',
            // add your filters here
            ...filters,
            [FilterNames.weekRange]: newOptions[initialFromWeek],
            [FilterNames.groupBy]: 'station',
            [FilterNames.view]: 'nienweeks',
        });

        const serviceFilters = useMemo(
            () => ({
                [FilterNames.langCode]: i18n.language,
                ...widgetFilters,
                ...filters,
                view: filters.view === '' ? widgetFilters.view : filters.view,
                weekRange: filters.weekRange === '' ? widgetFilters.weekRange : filters.weekRange,
                groupBy: filters.groupBy === '' ? widgetFilters.groupBy : filters.groupBy,
            }),
            [widgetFilters, filters, i18n.language],
        );

        useEffect(
            () => {
                onFilterChange({
                    ...serviceFilters,
                    [FilterNames.weekRange]: serviceFilters.weekRange || newOptions[initialFromWeek],
                    [FilterNames.groupBy]: serviceFilters.groupBy || 'station',
                    [FilterNames.view]: serviceFilters.view || 'nineweeks',
                    [FilterNames.systemFaults]:
                        serviceFilters.groupBy === 'station' ? serviceFilters.systemFaults : undefined,
                });
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [serviceFilters.view, serviceFilters.groupBy, serviceFilters.weekRange, newOptions],
        );

        useEffect(() => {
            const filter = omitBy(
                {
                    [FilterNames.carType]: serviceFilters.carType,
                    [FilterNames.fromTime]: serviceFilters.fromTime,
                    [FilterNames.toTime]: serviceFilters.toTime,
                    [FilterNames.langCode]: serviceFilters.langCode,
                    [FilterNames.plantId]: serviceFilters.plantId,
                    [FilterNames.systemType]: serviceFilters.systemType,
                    [FilterNames.deviceLine]: serviceFilters.subLine,
                    [FilterNames.weekRange]: serviceFilters.weekRange,
                    [FilterNames.groupBy]: serviceFilters.groupBy,
                    [FilterNames.systemFaults]: serviceFilters.systemFaults,
                    [FilterNames.deviceName]: serviceFilters.deviceName,
                    [FilterNames.station]: serviceFilters.station,
                    [FilterNames.view]: serviceFilters.view,
                    [FilterNames.headType]:
                        HeadType[serviceFilters.headType] === 'All'
                            ? '1,2'
                            : HeadType[serviceFilters.headType] || undefined,
                },
                isNil,
            );
            dispatch(stationAvailabilityTrendActions.getAllStationAvailabilityTrends(filter));
        }, [
            dispatch,
            serviceFilters.carType,
            serviceFilters.fromTime,
            serviceFilters.toTime,
            serviceFilters.langCode,
            serviceFilters.plantId,
            serviceFilters.systemType,
            serviceFilters.subLine,
            serviceFilters.weekRange,
            serviceFilters.headType,
            serviceFilters.groupBy,
            serviceFilters.systemFaults,
            serviceFilters.deviceName,
            serviceFilters.station,
            serviceFilters.view,
        ]);

        const options = {
            chart: {
                type: 'spline',
                zoomType: 'xy',
            },
            credits: {
                enabled: false,
            },
            title: {
                text: ``,
            },
            legend: {
                enabled: true,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                itemStyle: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'Open Sans',
                    color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                },
                itemHoverStyle: {
                    color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                },
            },
            xAxis: {
                type: 'category',
                title: {
                    text: t(messages.xAxis),
                },
                scrollbar: {
                    enabled: true,
                },
                labels: {
                    autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    },
                },
            },
            yAxis: {
                title: {
                    text: serviceFilters.view === 'nineweeks' ? t(messages.yAxis) : `Weeks`,
                },
            },
            tooltip: {
                useHTML: true,
                headerFormat: '',
                pointFormat: `<b>${t(messages.station)}: {series.name}</b><br/><b>${t(
                    messages.yAxis,
                )}: {point.y}</b><br/>`,
            },
            series: stationAvailabilityTrends,
        };

        return (
            <Div className={` ${className} x-cls-station-availability-trend-widget`}>
                {stationAvailabilityTrendIsLoading ? (
                    <Loader circle />
                ) : (
                    <HighchartsReact highcharts={Highcharts} options={options} immutable={true} />
                )}
            </Div>
        );
    },
);

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    {
        name: FilterNames.groupBy,
        label: 'Filters.GroupBy',
        type: FilterType.Select,
        multiple: false,
        data: { options: ['subline', 'station', 'deviceName', 'outlet', 'head_type'] } as SelectFilterData,
    },
    {
        name: FilterNames.view,
        label: 'Filters.View',
        type: FilterType.Select,
        multiple: false,
        data: { options: ['nineweeks', 'weekly'] } as SelectFilterData,
    },
    {
        name: FilterNames.station,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    {
        name: FilterNames.headType,
        type: FilterType.Select,
        label: 'Filters.HeadType',
        data: { options: [...(Array.from(Object.keys(HeadType)) as any)] } as SelectFilterData,
    },
];
export const StationAvailabilityTrendProperty = Object.assign(
    {},
    {
        defaultFilters: defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 0,
            w: 2,
            h: 3,
            minW: 1,
            minH: 1,
        },
    },
);

export default StationAvailabilityTrendWidget;

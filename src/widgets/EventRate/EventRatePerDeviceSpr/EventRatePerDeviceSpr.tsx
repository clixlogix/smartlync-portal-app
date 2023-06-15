/**
 *
 * EventRatePerDeviceSpr
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Chart } from 'components/panels';
import {
    eventRatePerDeviceSprActions,
    eventRatePerDeviceSprReducer,
    eventRatePerDeviceSprKey,
} from 'services/event-rate-per-device-spr/event-rate-per-device-spr-reducer';

import {
    // selectEventRatePerDeviceSprs,
    selectEventRatePerDeviceSprIsLoading,
} from 'services/event-rate-per-device-spr/event-rate-per-device-spr-selectors';

import { getAllEventRatePerDeviceSprsSaga } from 'services/event-rate-per-device-spr/sagas/event-rate-per-device-spr-saga-get-all';
import { Filters, FilterNames, view } from 'models';
import { WidgetProps, Widget } from 'widgets';
import * as _ from 'lodash';
import { messages } from './messages';

import 'scss/main.scss';
import './EventRatePerDeviceSpr.scss';

interface EventRatePerDeviceSprProps extends WidgetProps {
    data?: any;
    title?: string;
    loadData?: boolean;
    localFilters: Filters;
}

export const EventRatePerDeviceSpr: Widget<EventRatePerDeviceSprProps> = memo((props: EventRatePerDeviceSprProps) => {
    const {
        className = '',
        filters = {},
        localFilters = {},
        /*setAvailableFilters,*/ loadData,
        data = [],
        title,
    } = props;

    useInjectReducer({ key: eventRatePerDeviceSprKey, reducer: eventRatePerDeviceSprReducer });
    useInjectSaga({ key: eventRatePerDeviceSprKey, saga: getAllEventRatePerDeviceSprsSaga });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t, i18n } = useTranslation();

    // const eventRatePerDeviceSprs: EventRatePerDeviceSprs | undefined = useSelector(selectEventRatePerDeviceSprs);
    const eventRatePerDeviceSprIsLoading: boolean = useSelector(selectEventRatePerDeviceSprIsLoading);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(eventRatePerDeviceSprIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        // ...defaultFilters,
        // add your filters here
        plantId: 1,
        view: view.Weekly,
        ...filters,
    });

    const serviceFilters = useMemo(
        () => ({
            [FilterNames.langCode]: i18n.language,
            ...widgetFilters,
            ...filters,
            [FilterNames.eventCode]: filters.eventCode === '' ? undefined : filters.eventCode,
        }),
        [widgetFilters, filters, i18n.language],
    );

    useEffect(() => {
        const filter = _.omitBy(
            {
                [FilterNames.carType]: serviceFilters.carType,
                [FilterNames.fromTime]: serviceFilters.fromTime,
                [FilterNames.toTime]: serviceFilters.toTime,
                [FilterNames.langCode]: serviceFilters.langCode,
                [FilterNames.plantId]: serviceFilters.plantId,
                [FilterNames.view]: serviceFilters.view,
                [FilterNames.systemType]: serviceFilters.systemType,
                [FilterNames.eventType]: serviceFilters.eventType,
                [FilterNames.eventCode]: serviceFilters.eventCode,
                [FilterNames.deviceLine]: serviceFilters.subLine,
                [FilterNames.studType]: serviceFilters.studType,
                [FilterNames.deviceName]: serviceFilters.deviceName,
            },
            _.isNil,
        );
        !loadData && dispatch(eventRatePerDeviceSprActions.getAllEventRatePerDeviceSprs(filter));
    }, [
        dispatch,
        loadData,
        serviceFilters.carType,
        serviceFilters.fromTime,
        serviceFilters.toTime,
        serviceFilters.langCode,
        serviceFilters.plantId,
        serviceFilters.view,
        serviceFilters.systemType,
        serviceFilters.eventType,
        serviceFilters.eventCode,
        serviceFilters.subLine,
        serviceFilters.studType,
        serviceFilters.deviceName,
    ]);

    useEffect(() => {
        const filter = _.omitBy(
            {
                [FilterNames.week]: localFilters.week ? +localFilters.week : undefined,
            },
            _.isNil,
        );
        dispatch(eventRatePerDeviceSprActions.localFiltering(filter));
    }, [dispatch, localFilters.week]);

    const options = {
        chart: {
            type: 'line',
        },
        xAxis: {
            max: data[0] && data[0]?.data?.length > 12 ? 10 : null,
            scrollbar: {
                enabled: data[0] && data[0]?.data?.length > 12 ? true : false,
            },
            labels: {
                rotation: filters.view === view.Daily ? 45 : 0,
            },
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            maxHeight: 55,
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false,
                },
            },
        },
        tooltip: {
            useHTML: true,
            headerFormat: '<table><tr><th colspan="2">{series.name}</th></tr>',
            pointFormat:
                '<tr><td style="color: {series.color}">Event Rate : </td>' +
                '<td style="text-align: left"><b>{point.y} ( Part Per Million )</b></td></tr>' +
                '<tr><td style="color: {series.color}">Event Count : </td>' +
                '<td style="text-align: left"><b>{point.eventCount}</b></td></tr>' +
                '<tr><td style="color: {series.color}">Weld Count : </td>' +
                '<td style="text-align: left"><b>{point.rivetCount}</b></td></tr>' +
                '<tr><td style="color: {series.color}">Date : </td>' +
                '<td style="text-align: left"><b>{point.date}</b></td></tr>',
            footerFormat: '</table>',
        },
        series: data,
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500,
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                        },
                    },
                },
            ],
        },
    };

    return (
        <Chart
            chartType={'line'}
            chartTitle={`
                 ${t(messages.eventRatePerBodyshopTitle)}
                 ${title}
                 ${filters.view === view.Daily ? t(messages.eventRateByDay) : t(messages.eventRateByWeek)}`}
            // xChartTitle={t(messages.xAxisEventRatePerDeviceTitle)}
            xChartTitle={
                filters.view === view.Daily
                    ? t(messages.xAxisEventRatePerDeviceTitleDaily)
                    : t(messages.xAxisEventRatePerDeviceTitleWeekly)
            }
            yChartTitle={t(messages.yAxisEventRatePerDeviceTitle)}
            // className={` ${className} x-cls-cycle-count `}
            options={options}
        />
    );
});

// extra widget properties
const defaultFilters = [];
export const EventRatePerDeviceSprProperty = Object.assign(
    {},
    {
        defaultFilters,
        type: 'panel',
        layout: {
            minW: 1,
            minH: 1,
        },
    },
);

export default EventRatePerDeviceSpr;

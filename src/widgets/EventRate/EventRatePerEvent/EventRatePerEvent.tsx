/**
 *
 * EventRatePerEvent
 *
 */

import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Chart } from 'components/panels';
import {
    eventRatePerEventActions,
    eventRatePerEventReducer,
    eventRatePerEventKey,
} from 'services/event-rate-per-event/event-rate-per-event-reducer';
import {
    selectEventRatePerEvents,
    // selectCategories,
    selectEventRatePerEventIsLoading,
} from 'services/event-rate-per-event/event-rate-per-event-selectors';
import { getAllEventRatePerEventsSaga } from 'services/event-rate-per-event/sagas/event-rate-per-event-saga-get-all';
import { Filters, FilterNames, view } from 'models';
import {
    DashboardFilter,
    // DateFilterData,
    // FilterType,
    // SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { ChartRef } from 'components/panels/Chart/Chart';
import { synchronousChart } from 'utils/synchronousChart';
import { WidgetProps, Widget } from 'widgets';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import { messages } from './messages';

import 'scss/main.scss';
import './EventRatePerEvent.scss';

interface EventRatePerEventProps extends WidgetProps {
    localFilters: Filters;
    getRef?(ref: ChartRef);
    refs?: ChartRef[];
}

export const EventRatePerEvent: Widget<EventRatePerEventProps> = memo((props: EventRatePerEventProps) => {
    const { className = '', filters = {}, localFilters = {} /*, setAvailableFilters*/, getRef, refs } = props;
    useInjectReducer({ key: eventRatePerEventKey, reducer: eventRatePerEventReducer });

    useInjectSaga({ key: eventRatePerEventKey, saga: getAllEventRatePerEventsSaga });

    const { t, i18n } = useTranslation();

    const series: any = useSelector(selectEventRatePerEvents);
    // const categories = useSelector(selectCategories) || [];
    const eventRatePerEventIsLoading: boolean = useSelector(selectEventRatePerEventIsLoading);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(eventRatePerEventIsLoading);
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
            [FilterNames.eventCode]: filters?.eventCode === '' ? undefined : filters?.eventCode,
        }),
        [widgetFilters, filters, i18n.language],
    );

    const yearLabel = useMemo(() => {
        if (serviceFilters?.fromTime.year() !== serviceFilters?.toTime.year()) {
            return `${serviceFilters?.fromTime.year()} - ${serviceFilters?.toTime.year()}`;
        }
        return `${serviceFilters?.toTime.year()}`;
    }, [serviceFilters.fromTime, serviceFilters.toTime]);

    useEffect(() => {
        const filter = omitBy(
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
            isNil,
        );
        dispatch(eventRatePerEventActions.getAllEventRatePerEvents(filter));
    }, [
        dispatch,
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
        const filter = omitBy(
            {
                [FilterNames.week]: localFilters.week,
            },
            isNil,
        );

        dispatch(eventRatePerEventActions.localFiltering(filter));
    }, [dispatch, localFilters.week]);

    const options = {
        chart: {
            type: 'line',
        },
        xAxis: {
            max: series[0] && series[0]?.data?.length > 12 ? 10 : null,
            scrollbar: {
                enabled: series[0] && series[0]?.data?.length > 12 ? true : false,
            },
            events: {
                afterSetExtremes: synchronousChart(refs),
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
                '<td style="text-align: left"><b>{point.weldCount}</b></td></tr>' +
                '<tr><td style="color: {series.color}">Date : </td>' +
                '<td style="text-align: left"><b>{point.date}</b></td></tr>',
            footerFormat: '</table>',
        },
        series,
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
            chartTitle={
                filters.view === view.Daily
                    ? t(messages.eventRatePerEventChartTitleDaily, { yearLabel })
                    : t(messages.eventRatePerEventChartTitleWeekly, { yearLabel })
            }
            xChartTitle={
                filters.view === view.Daily
                    ? t(messages.eventRatePerEventXAxisLabelDaily)
                    : t(messages.eventRatePerEventXAxisLabelWeekly)
            }
            yChartTitle={t(messages.eventRatePerEventYAxisLabel)}
            className={` ${className} x-cls-cycle-count`}
            options={options}
            isLoading={eventRatePerEventIsLoading}
            getRef={getRef}
            size={{ width: 0, height: '450' }}
        />
    );
});

// extra widget properties
const defaultFilters: DashboardFilter[] = [];

export const EventRatePerEventProperty = Object.assign(
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

export default EventRatePerEvent;

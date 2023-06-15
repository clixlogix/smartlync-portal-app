/**
 *
 * DailyFaultTrendsWidget
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    dailyFaultTrendActions,
    dailyFaultTrendReducer,
    dailyFaultTrendKey,
} from 'services/daily-fault-trend/daily-fault-trends-reducer';
import {
    selectDailyFaultTrends,
    selectDailyFaultTrendIsLoading,
} from 'services/daily-fault-trend/daily-fault-trends-selectors';
import { getAllDailyFaultTrendsSaga } from 'services/daily-fault-trend/sagas/daily-fault-trends-saga-get-all';
import { Filters, DailyFaultTrends, FilterNames } from 'models';
import moment from 'moment';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { Chart } from 'components/panels';
import { messages } from './messages';

import 'scss/main.scss';
import './DailyFaultTrendsWidget.scss';

interface DailyFaultTrendsWidgetProps extends WidgetProps {}

export const DailyFaultTrendsWidgetWidget: Widget<DailyFaultTrendsWidgetProps> = memo(
    (props: DailyFaultTrendsWidgetProps) => {
        const { className = '', filters = {} } = props;

        useInjectReducer({ key: dailyFaultTrendKey, reducer: dailyFaultTrendReducer });
        useInjectSaga({ key: dailyFaultTrendKey, saga: getAllDailyFaultTrendsSaga });

        const { t } = useTranslation();

        const dailyFaultTrends: DailyFaultTrends | undefined = useSelector(selectDailyFaultTrends);
        const dailyFaultTrendIsLoading: boolean = useSelector(selectDailyFaultTrendIsLoading);
        const dispatch = useDispatch();

        const [formattedData] = useMemo(() => {
            const fData: Map<string, number[]> = (dailyFaultTrends || []).reduce((acc, row: any) => {
                const { occurredOn, countDayPercent } = row;
                let values: any[] = [];

                const time = moment(occurredOn).format('HH:mm');
                const timeInMilliseconds = moment(occurredOn).valueOf() - moment(occurredOn).startOf('day').valueOf();

                values = acc.get(moment(occurredOn).format('YYYY-MM-DD')) || [];
                values.push({ x: timeInMilliseconds, y: countDayPercent, time, ...row });
                acc.set(moment(occurredOn).format('YYYY-MM-DD'), values);

                return acc;
            }, new Map<string, number[]>());

            return [fData];
        }, [dailyFaultTrends]);

        const series: any[] = [];
        formattedData.forEach(function (data, name) {
            series.push({ data, name });
        });

        if (props.isLoading) {
            props.isLoading(dailyFaultTrendIsLoading);
        }

        const [widgetFilters] = useState<Filters>({
            ...defaultFilters,
            // add your filters here
            ...filters,
        });

        useEffect(() => {
            dispatch(dailyFaultTrendActions.getAllDailyFaultTrends(widgetFilters));
        }, [dispatch, widgetFilters]);
        const minXaxis = moment(0).valueOf();
        const maxXaxis = moment(86400000).valueOf();
        const options = {
            chart: {
                type: 'spline',
            },
            title: {
                text: '',
            },
            legend: {
                enabled: true,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                title: {
                    text: t(messages.code),
                },
                itemStyle: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'Open Sans',
                    color: 'white',
                },
            },
            xAxis: {
                min: minXaxis,
                max: maxXaxis,
                type: 'datetime',
                tickPositioner: function () {
                    var info = this.tickPositions.info;
                    var positions = [];
                    for (let i = minXaxis; i <= maxXaxis; i += 3600 * 1000 * 3) {
                        positions.push(i);
                    }
                    positions.info = info;
                    return positions;
                },
                lineWidth: 1,
                dateTimeLabelFormats: {
                    day: '%H:%M',
                },
                title: {
                    text: t(messages.hourOfDay),
                },
                scrollbar: {
                    enabled: false,
                },
            },
            yAxis: {
                min: 0,
                max: 100,
                gridLineColor: 'transparent',
                title: {
                    text: t(messages.totalDayFaults),
                },
                labels: {
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: 'white',
                    },
                },
                tickmarkPlacement: 'on',
            },
            tooltip: {
                useHTML: true,
                headerFormat: '',
                pointFormat:
                    `<b>${t(messages.code)}: {series.name}</b><br/>` +
                    `<b>${t(messages.time)}: {point.time}</b><br/>` +
                    `<b>${t(messages.countDayPercent)}: {point.countDayPercent}</b><br/>` +
                    `<b>${t(messages.countDay)}: {point.countDay}</b><br/>`,
            },
            series: series,
        };

        return (
            <Div className={`${className} x-cls-daily-fault-trend-widget`}>
                <Chart
                    chartType={'line'}
                    // chartTitle={t(messages.liftTitle)}
                    xChartTitle={''}
                    // yChartTitle={t(messages.yAxisTitle)}
                    // tooltipFormat={`<b>${t(messages.liftTitle)} : {point.y}</b>`}
                    className={`x-cls-daily-fault-trend-widget-chart`}
                    options={options}
                />
            </Div>
        );
    },
);

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
];
export const DailyFaultTrendsWidgetProperty = Object.assign(
    {},
    {
        defaultFilters: defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 0,
            w: 3,
            h: 3.75,
            minW: 1,
            minH: 1,
        },
    },
);

export default DailyFaultTrendsWidgetWidget;

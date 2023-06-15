/**
 *
 * EventCodeFrequencySpr
 *
 */
import React, { useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import orderBy from 'lodash/orderBy';
import { useTheme } from '@mui/material';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';
import { Chart } from 'components/panels';
import {
    selectEventDescFrequencySprs,
    selectEventDescFrequencySprIsLoading,
} from 'services/event-desc-frequency-spr/event-desc-frequency-spr-selectors';
import { EventDescFrequencys } from 'models';

interface EventCodeFrequencySprProps extends WidgetProps {}

export const EventCodeFrequencySprWidget: Widget<EventCodeFrequencySprProps> = memo(
    (props: EventCodeFrequencySprProps) => {
        const { className = '' } = props;
        const { t } = useTranslation();
        const themePalette = useTheme().palette;
        const themeMode: 'light' | 'dark' = themePalette.mode;
        const isLoading: boolean = useSelector(selectEventDescFrequencySprIsLoading);

        if (props.isLoading) {
            props.isLoading(isLoading);
        }
        const totalCyclesData: EventDescFrequencys | undefined = useSelector(selectEventDescFrequencySprs);

        const [weeklyDataFormatted] = useMemo(() => {
            let count: any[] = [];
            let percent: any[] = [];
            (totalCyclesData || []).forEach((row: any, index) => {
                count.push({
                    name: row.fc.toString(),
                    y: +row.occurrences,
                    percentage: +row.percentageFaultCount,
                    description: row?.description,
                });
                percent.push({
                    name: row.fc.toString(),
                    y: +row.percentageFaultCount,
                });
            });
            const sortedValues = orderBy(count, ['y'], ['desc']);
            const fData = { count: sortedValues, percent };
            return [fData];
        }, [totalCyclesData]);

        const series: any[] = useMemo(
            () => [
                {
                    type: 'pareto',
                    name: 'Pareto',
                    color: 'red',
                    baseSeries: 1,
                    tooltip: {
                        valuePrefix: 'Pareto: ',
                        valueDecimals: 2,
                        valueSuffix: '%',
                    },
                    yAxis: 1,
                },
                {
                    type: 'column',
                    name: 'Count',
                    color: '#149B74',
                    borderWidth: 0,
                    data: weeklyDataFormatted.count,
                    dataLabels: {
                        enabled: true,
                        align: 'center',
                        style: {
                            fontSize: '12px',
                            fontFamily: 'Open Sans',
                        },
                    },
                    tooltip: {
                        useHTML: true,
                        xDateFormat: '(%b %d,%Y , %k:%M:%S)',
                        pointFormat: `<b>Event Count: {point.y}</b></br><b>Description: {point.description}</b>`,
                    },
                },
            ],
            [weeklyDataFormatted],
        );

        const options = useMemo(
            () => ({
                xAxis: {
                    max: series[1] && series[1]?.data?.length > 10 ? 20 : null,
                },
                legend: {
                    enabled: false,
                },
                yAxis: [
                    {
                        gridLineColor: 'transparent',
                        lineWidth: 1,
                        title: {
                            text: `${t(messages.yAxisFaultFrequencyTitle)}`,
                            style: {
                                fontSize: '14px',
                                fontWeight: 'bold',
                                fontFamily: 'Open Sans',
                                color: themePalette.text.primary,
                            },
                        },
                        labels: {
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Open Sans',
                                color: themePalette.text.primary,
                            },
                        },
                    },
                    {
                        gridLineColor: 'transparent',
                        opposite: true,
                        min: 0,
                        max: 100,
                        title: {
                            text: '',
                            style: {
                                color: themePalette.text.primary,
                                fontFamily: 'Open Sans',
                            },
                        },
                        labels: {
                            format: '{value}%',
                            style: {
                                color: themePalette.text.primary,
                                fontFamily: 'Open Sans',
                            },
                        },
                        lineWidth: 1,
                    },
                ],
                plotOptions: {
                    column: {
                        grouping: false,
                        shadow: false,
                        getExtremesFromAll: true,
                    },
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
            }),
            [series, t, themeMode],
        );

        return (
            <Chart
                chartType={'column'}
                chartTitle={t(messages.faultFrequencyChartTitle)}
                xChartTitle={t(messages.xAxisFaultFrequencyTitle)}
                className={` ${className} x-cls-event-code-frequency-widget `}
                options={options}
                isLoading={isLoading}
            />
        );
    },
);

export const EventCodeFrequencySprProperty = {
    type: 'panel',
    layout: {
        x: 0,
        y: 0,
        w: 2,
        h: 3,
        minW: 1,
        minH: 1,
    },
};

export default EventCodeFrequencySprWidget;

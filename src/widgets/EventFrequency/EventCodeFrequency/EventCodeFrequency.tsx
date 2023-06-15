/**
 *
 * EventCodeFrequency
 *
 */
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
//import { FilterNames } from 'models';
import { Chart } from 'components/panels';
import {
    selectEventDescFrequencys,
    selectEventDescFrequencyIsLoading,
} from 'services/event-desc-frequency/event-desc-frequency-selectors';
//import { FilterType, DashboardFilter, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';
import { EventDescFrequencys } from 'models';
import * as _ from 'lodash';
import { useTheme } from '@mui/material';

interface EventCodeFrequencyProps extends WidgetProps {}

export const EventCodeFrequency: Widget<EventCodeFrequencyProps> = memo((props: EventCodeFrequencyProps) => {
    const { className = '' /* filters = {} */ } = props;
    const { t } = useTranslation();
    const themePalette = useTheme().palette;
    const themeMode: 'light' | 'dark' = themePalette.mode;
    const isLoading: boolean = useSelector(selectEventDescFrequencyIsLoading);

    if (props.isLoading) {
        props.isLoading(isLoading);
    }
    const totalCyclesData: EventDescFrequencys | undefined = useSelector(selectEventDescFrequencys);

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
        const sortedValues = _.orderBy(count, ['y'], ['desc']);
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
});

// extra widget properties
// const defaultFilters: DashboardFilter[] = [
//     {
//         name: FilterNames.eventType,
//         type: FilterType.Select,
//         data: {
//             options: [],
//         } as SelectFilterData,
//     },
//     { name: FilterNames.studType, type: FilterType.Select, data: { options: [] } as SelectFilterData },
//     {
//         name: FilterNames.deviceName,
//         type: FilterType.Select,
//         data: { options: [] } as SelectFilterData,
//     },
// ];

export const EventCodeFrequencyProperty = Object.assign(
    {},
    {
        // defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 3,
            w: 4,
            h: 3,
            minW: 1,
            minH: 1,
        },
    },
);

export default EventCodeFrequency;

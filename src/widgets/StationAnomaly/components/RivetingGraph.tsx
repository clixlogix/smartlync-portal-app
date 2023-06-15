/**
 *
 * RivetingGraph
 *
 */
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Chart } from 'components/panels';
import { Widget, ChartWidgetProps } from 'widgets';
import { messages } from './../messages';

interface RivetingGraphProps extends ChartWidgetProps {
    graphData: any;
    width: any;
}

export const RivetingGraph: Widget<RivetingGraphProps> = memo((props: RivetingGraphProps) => {
    const { className = '', graphData, width } = props;

    const { t } = useTranslation();

    const options = {
        title: {
            text: '',
        },

        subtitle: {
            text: '',
        },

        yAxis: {
            title: {
                text: 'Force in KN',
            },
            tickInterval: 5,
            lineWidth: 0,
            gridLineDashStyle: 'longdash',
            gridLineColor: '#707073',
        },

        xAxis: {
            allowDecimals: true,
            title: {
                text: 'Distance in mm',
            },
            tickInterval: 1,

            offset: 35,
            min: 0,
            scrollbar: {
                enabled: false,
            },
        },

        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
        },

        tooltip: {
            useHTML: true,
            headerFormat: '<table><tr><th colspan="2">{series.y}{series.x}{series.name}</th></tr>',
        },
        chart: {
            width: width - 15,
        },

        plotOptions: {
            series: {
                pointStart: 0,
            },
        },

        series: [
            {
                dashStyle: 'ShortDash',
                name: `${t(messages.actualCurve) || 'Actual Curve'}`,
                data: graphData?.rivetData || [],
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: ' KN',
                },
            },
            {
                name: `${t(messages.referenceCurve) || 'Reference Curve'}`,
                data: graphData?.referenceData || [],
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: ' KN',
                },
            },
        ],

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
                            verticalAlign: 'top',
                        },
                    },
                },
            ],
        },
    };

    return (
        <Chart
            chartType={'line'}
            chartTitle={''}
            xChartTitle={''}
            yChartTitle={''}
            className={` ${className} x-cls-rivet-graph `}
            options={options}
        />
    );
});

// extra widget properties
const defaultFilters = [];

export const RivetingGraphProperty = Object.assign(
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

export default RivetingGraph;

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
}

export const RivetingGraph: Widget<RivetingGraphProps> = memo((props: RivetingGraphProps) => {
    const { className = '', graphData } = props;

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
                margin: 15,
            },
            tickInterval: 50,

            scrollbar: {
                enabled: true,
            },
            // offset: 65,
            min: 0,
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
        },

        tooltip: {
            useHTML: true,
            headerFormat: '<table><tr><th colspan="2">{series.y}{series.x}{series.name}</th></tr>',
        },

        plotOptions: {
            series: {
                pointStart: 0,
            },
        },

        series: [
            {
                dashStyle: 'ShortDash',
                name: `${t(messages.actualCurve)}`,
                data: graphData.rivetGraphData.y,
            },
            {
                name: `${t(messages.referenceCurve)}`,
                data: graphData.referenceGraphData.y,
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

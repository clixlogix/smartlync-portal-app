/**
 *
 * EssentialControlWidgets
 *
 */
import React, { useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import startCase from 'lodash/startCase';
import { FilterNames, Filters } from 'models';
import { ChartWidgetProps, Widget } from 'widgets';
import { messages } from './messages';
import { Chart } from 'components/panels';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { ChartRef } from 'components/panels/Chart/Chart';
import { synchronousChart } from 'utils/synchronousChart';
import 'scss/main.scss';
import './EssentialControlWidgets.scss';

interface EssentialControlWidgetsProps extends ChartWidgetProps {
    data?: any;
    title?: string;
    loadData?: boolean;
    localFilters: Filters;
    getRef?(ref: ChartRef);
    refs?: ChartRef[];
    chartData: any;
    onClick: any;
}

export const EssentialControlWidgetsWidget: Widget<EssentialControlWidgetsProps> = memo(
    (props: EssentialControlWidgetsProps) => {
        const {
            className = '',
            filters = {},
            localFilters = {},
            onClick,
            getRef,
            refs,
            data,
            title = '',
            chartData,
        } = props;

        const { unit = '' } = data;
        const { t, i18n } = useTranslation();

        const maximum = chartData[0]?.maximum;
        const actual = chartData[0]?.actual;
        const minimum = chartData[0]?.minimum;
        const time = chartData[0]?.time;

        const series: any = useMemo(() => {
            const data: any[] = [
                {
                    boostThreshold: 1000,
                    data: maximum,
                    name: t(messages.maximum),
                    dashStyle: 'ShortDash',
                    color: 'rgb(235, 70, 45)',
                },
                {
                    boostThreshold: 1000,
                    data: actual,
                    name: t(messages.actual),
                    dashStyle: 'ShortDash',
                    color: 'rgb(104, 205, 209)',
                },
                {
                    boostThreshold: 1000,
                    data: minimum,
                    name: t(messages.minimum),
                    dashStyle: 'ShortDash',
                    color: 'rgb(235, 70, 45)',
                },
            ];
            return data;
        }, [actual, maximum, minimum, t]);
        const pointsX = time.length > 10 ? 10 : time.length - 1;

        const options = {
            chart: {
                type: 'spline',
                animation: false,
                events: {
                    click: onClick,
                },
            },
            xAxis: {
                categories: time,
                type: 'datetime',
                scrollbar: {
                    enabled: true,
                },
                min: 0,
                max: pointsX,
                offset: 65,
                events: {
                    afterSetExtremes: synchronousChart(refs),
                },
            },
            yAxis: {
                title: {
                    margin: 20,
                    text: `${startCase(data.value)} ${unit ? `(${unit})` : ''} `,
                },
                tickInterval: 5,
                lineWidth: 0,
                gridLineDashStyle: 'longdash',
                gridLineColor: '#707073',
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
                    cursor: 'pointer',
                    event: {
                        click: onClick,
                    },
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
                key={`essential-${title}`}
                xChartTitle=""
                yChartTitle=""
                tooltipFormat={`<b>${startCase(data.value)} : {point.y}</b>`}
                className={` ${className} x-cls-essential-control-widgets`}
                options={options}
                onClick={onClick}
                getRef={getRef}
                // isLoading={penetrationIsLoading}
            />
        );
    },
);

// extra widget properties
const defaultFilters = [
    { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    { name: FilterNames.studId, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    {
        name: FilterNames.outletNo,
        label: 'Filters.OutletLabel',
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.feederNo,
        label: 'Filters.FeederLabel',
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
];

export const EssentialControlWidgetsProperty = Object.assign(
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

export default EssentialControlWidgetsWidget;

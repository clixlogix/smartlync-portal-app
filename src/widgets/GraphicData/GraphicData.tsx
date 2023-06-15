/**
 *
 * GraphicData
 *
 */
import React, { memo } from 'react';
// import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import Chart, { ChartRef } from 'components/panels/Chart/Chart';
import { WidgetProps, Widget } from 'widgets';

import 'scss/main.scss';
import './GraphicData.scss';
import { synchronousChart } from 'utils/synchronousChart';
import { GraphicDatas } from 'models/graphic-data-model';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';

interface GraphicDataProps extends WidgetProps {
    graphicDatas?: GraphicDatas | any[];
    current?: GraphicDataSeries[];
    voltage?: GraphicDataSeries[];
    lift?: GraphicDataSeries[];
    refs?: ChartRef[];
    getRef?(newRef: ChartRef);
}

export interface GraphicDataSeries {
    data: number[];
    studId: number | string;
    type: string;
    pointInterval?: number;
}

export const GraphicDataWidget: Widget<GraphicDataProps> = memo(
    ({ className = '', current = [], voltage = [], lift = [], refs = [], getRef }: GraphicDataProps) => {
        // const { t } = useTranslation();

        const options = {
            chart: {
                type: 'spline',
            },
            rangeSelector: {
                selected: 1,
            },
            legend: {
                enabled: false,
            },
            title: {
                text: 'Current',
            },
            xAxis: {
                events: {
                    afterSetExtremes: synchronousChart(refs),
                },
                tickInterval: 10,
                max: 100,
                labels: {
                    format: '{text}ms',
                },
            },
            yAxis: [
                {
                    labels: {
                        align: 'right',
                    },
                    title: {
                        text: 'Current',
                        style: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            fontFamily: 'Roboto',
                            color: '#ffffff',
                        },
                    },
                    lineWidth: 2,
                    resize: {
                        enabled: true,
                    },
                },
            ],
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                useHTML: true,
                headerFormat:
                    '<tr><td>Sample time: </td><td style="text-align: right"><b>{point.x}</b></td></tr><table>',
                pointFormat:
                    `<tr><td>Current: </td><td style="text-align: right"><b>{point.y}</b></td></tr>` +
                    `<br/><tr><td>Stud ID: </td><td style="text-align: right"><b>{point.series.userOptions.studId}</b></td></tr>` +
                    `<br/><tr><td>Weld Type: </td><td style="text-align: right"><b>{point.series.userOptions.weldType}</b></td></tr>` +
                    `<br/><tr><td>CarBody ID: </td><td style="text-align: right"><b>{point.series.userOptions.carbodyId}</b></td></tr>`,
                footerFormat:
                    '<tr><td>Date Time: </td><td style="text-align: right"><b>{point.series.userOptions.dateTime}</b></td></tr></table>',
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false,
                    },
                },
            },
            series: [],
        };

        const currentOptions = {
            ...options,
            title: {
                text: 'Current',
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                useHTML: true,
                headerFormat:
                    '<tr><td>Sample time: </td><td style="text-align: right"><b>{point.x}</b></td></tr><table>',
                pointFormat:
                    `<tr><td>Current: </td><td style="text-align: right"><b>{point.y}</b></td></tr>` +
                    `<br/><tr><td>Stud ID: </td><td style="text-align: right"><b>{point.series.userOptions.studId}</b></td></tr>` +
                    `<br/><tr><td>Weld Type: </td><td style="text-align: right"><b>{point.series.userOptions.weldType}</b></td></tr>` +
                    `<br/><tr><td>CarBody ID: </td><td style="text-align: right"><b>{point.series.userOptions.carbodyId}</b></td></tr>`,
                footerFormat:
                    '<tr><td>Date Time: </td><td style="text-align: right"><b>{point.series.userOptions.dateTime}</b></td></tr></table>',
            },
            series: current,
        };

        const voltageOptions = {
            ...options,
            title: {
                text: 'Voltage',
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                useHTML: true,
                headerFormat:
                    '<tr><td>Sample time: </td><td style="text-align: right"><b>{point.x}</b></td></tr><table>',
                pointFormat:
                    `<tr><td>Voltage: </td><td style="text-align: right"><b>{point.y}</b></td></tr>` +
                    `<br/><tr><td>Stud ID: </td><td style="text-align: right"><b>{point.series.userOptions.studId}</b></td></tr>` +
                    `<br/><tr><td>Weld Type: </td><td style="text-align: right"><b>{point.series.userOptions.weldType}</b></td></tr>` +
                    `<br/><tr><td>CarBody ID: </td><td style="text-align: right"><b>{point.series.userOptions.carbodyId}</b></td></tr>`,
                footerFormat:
                    '<tr><td>Date Time: </td><td style="text-align: right"><b>{point.series.userOptions.dateTime}</b></td></tr></table>',
            },
            series: voltage,
        };

        const liftOptions = {
            ...options,
            title: {
                text: 'Lift',
            },
            legend: {
                enabled: false,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                maxHeight: 55,
                labelFormat: '{userOptions.studId}',
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                useHTML: true,
                headerFormat:
                    '<tr><td>Sample time: </td><td style="text-align: right"><b>{point.x}</b></td></tr><table>',
                pointFormat:
                    `<tr><td>Lift: </td><td style="text-align: right"><b>{point.y}</b></td></tr>` +
                    `<br/><tr><td>Stud ID: </td><td style="text-align: right"><b>{point.series.userOptions.studId}</b></td></tr>` +
                    `<br/><tr><td>Weld Type: </td><td style="text-align: right"><b>{point.series.userOptions.weldType}</b></td></tr>` +
                    `<br/><tr><td>CarBody ID: </td><td style="text-align: right"><b>{point.series.userOptions.carbodyId}</b></td></tr>`,
                footerFormat:
                    '<tr><td>Date Time: </td><td style="text-align: right"><b>{point.series.userOptions.dateTime}</b></td></tr></table>',
            },
            series: lift,
        };

        return (
            <div className="graphic-data-container">
                <Div className={` ${className} x-cls-graphic-data-widget`}>
                    <Chart getRef={getRef} xChartTitle="Time (ms)" options={currentOptions} />
                </Div>
                <Div className={` ${className} x-cls-graphic-data-widget`}>
                    <Chart getRef={getRef} xChartTitle="Time (ms)" options={voltageOptions} />
                </Div>
                <Div className={` ${className} x-cls-graphic-data-widget`}>
                    <Chart getRef={getRef} xChartTitle="Time (ms)" options={liftOptions} />
                </Div>
            </div>
        );
    },
);

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    { name: 'deviceName', type: FilterType.Select, data: { options: [] } as SelectFilterData },
    // { name: 'deviceType', type: FilterType.Select, label: 'Type' },
];
export const GraphicDataProperty = Object.assign(
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

export default GraphicDataWidget;

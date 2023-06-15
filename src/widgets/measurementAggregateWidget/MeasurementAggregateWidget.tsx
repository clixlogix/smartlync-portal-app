/**
 *
 * MeasurementAggregateWidget
 *
 */
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Filters, FilterNames, SidePanelOpenState } from 'models';
import { ChartRef } from 'components/panels/Chart/Chart';
import * as _ from 'lodash';
import { Chart } from 'components/panels';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import startCase from 'lodash/startCase';
import { chartTheme, ThemeModes } from 'styles/theme/themes';
import {
    cycleGapMetaDataActions,
    cycleGapMetaDataReducer,
    cycleGapMetaDataKey,
} from 'services/cycle-gap-meta-data/cycle-gap-meta-data-reducer';
import { getAllCycleGapMetaDatasSaga } from 'services/cycle-gap-meta-data/sagas/cycle-gap-meta-data-saga-get-all';
import { useTheme } from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import 'scss/main.scss';
import { Box } from '@mui/material';
import { synchronousChart } from 'utils/synchronousChart';

interface MeasurementAggregateWidgetProps extends WidgetProps {
    data?: any;
    title?: string;
    loadData?: boolean;
    localFilters: Filters;
    getRef?(ref: ChartRef);
    refs?: ChartRef[];
    chartData: any;
    setExtraPanelState: any;
    onClick: any;
}

export const MeasurementAggregateWidgetWidget: Widget<MeasurementAggregateWidgetProps> = memo(
    (props: MeasurementAggregateWidgetProps) => {
        const {
            className = '',
            filters = {},
            /*setAvailableFilters,*/
            data,
            title = '',
            getRef,
            chartData,
            refs,
            onClick,
        } = props;
        useInjectReducer({ key: cycleGapMetaDataKey, reducer: cycleGapMetaDataReducer });
        useInjectSaga({ key: cycleGapMetaDataKey, saga: getAllCycleGapMetaDatasSaga });

        const { unit = '' } = data;
        const dispatch = useDispatch();
        const themeMode: 'light' | 'dark' = useTheme().palette.mode;

        const options = {
            chart: {
                height: '290px',
                renderTo: 'container',
                type: 'scatter',
                zoomType: 'xy',
                events: {
                    click: onClick,
                },
            },
            rangeSelector: {
                selected: 1,
            },
            title: {
                text: undefined,
            },
            xAxis: {
                labels: {
                    step: 1,
                },
                type: 'datetime',
                scrollbar: {
                    enabled: false,
                },
                min: filters.fromTime.valueOf(),
                max: filters.toTime.valueOf(),
                events: {
                    afterSetExtremes: synchronousChart(refs),
                },
            },
            yAxis: [
                {
                    gridLineColor: '#424242',
                    title: {
                        text: `${startCase(data.value)} ${unit ? `(${unit})` : ''} `,
                        style: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            fontFamily: 'Open Sans',
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                        },
                    },
                    labels: {
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Open Sans',
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                        },
                    },
                    tickmarkPlacement: 'on',
                },
            ],
            legend: {
                title: {
                    text: 'Device Name',
                },
            },
            series: chartData,
            tooltip: {
                useHTML: true,
                headerFormat: '<table><tr><th colspan="2">{series.name}</th></tr>',
                pointFormat:
                    '<tr><td style="color: {series.color}">Date : </td>' +
                    '<td style="text-align: left"><b>{point.time}</b></td></tr>' +
                    `<tr><td style="color: {series.color}">${data.value} : </td>` +
                    '<td style="text-align: left"><b>{point.measurementTime}</b></td></tr>' +
                    '<tr><td style="color: {series.color}">FeederNo : </td>' +
                    '<td style="text-align: left"><b>{point.feederNo}</b></td></tr>' +
                    '<tr><td style="color: {series.color}">OutletNo : </td>' +
                    '<td style="text-align: left"><b>{point.outletNo}</b></td></tr>' +
                    // '<tr><td style="color: {series.color}">WIP : </td>' +
                    // '<td style="text-align: left"><b>{point.wip}</b></td></tr>' +
                    '<tr><td style="color: {series.color}">StudId : </td>' +
                    '<td style="text-align: left"><b>{point.studId}</b></td></tr>',
                footerFormat: '</table>',
            },
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 500,
                        },
                    },
                ],
            },
            plotOptions: {
                series: {
                    marker: {
                        radius: 2,
                    },
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                if (!isEmpty(filters)) {
                                    dispatch(
                                        cycleGapMetaDataActions.getAllCycleGapMetaDatas({
                                            systemType: filters?.systemType,
                                            plantId: filters?.plantId,
                                            deviceName: this?.series?.name,
                                            fromTime: this?.series?.options?.data[this.index]?.time,
                                            toTime: this?.series?.options?.data[this.index]?.time,
                                            feederNo: this?.series?.options?.data[this.index]?.feederNo,
                                            outletNo: this?.series?.options?.data[this.index]?.outletNo,
                                            studId: this?.series?.options?.data[this.index]?.studId,
                                            graphData: false,
                                        }),
                                    );
                                    props.setExtraPanelState(SidePanelOpenState.Open);
                                }
                            },
                        },
                    },
                },
                scatter: {
                    turboThreshold: 100000000,
                },
            },
        };

        return (
            <Box style={{ width: '100%' }}>
                <Chart
                    key={`aggregate-chart-${title}`}
                    chartType={'scatter'}
                    xChartTitle=""
                    yChartTitle=""
                    className={` ${className} x-cls-event-code-frequency-widget `}
                    options={options}
                    getRef={getRef}
                    // isLoading={measurementAggregateWidgetIsLoading}
                />
            </Box>
        );
    },
);

// extra widget properties
const defaultFilters = [
    {
        name: FilterNames.station,
        type: FilterType.Select,
        disableClearable: true,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.deviceName,
        type: FilterType.Select,
        multiple: true,
        disableClearable: true,
        data: { options: [] } as SelectFilterData,
    },
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
export const MeasurementAggregateWidgetProperty = Object.assign(
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

export default MeasurementAggregateWidgetWidget;

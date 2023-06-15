/**
 *
 * MeasurementAggregateWidgetSpr
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { Filters, DeviceNames, Stations, SidePanelOpenState } from 'models';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { cycleGapSprActions, cycleGapSprReducer, cycleGapSprKey } from 'services/cycle-gap-spr/cycle-gap-spr-reducer';

import {
    // Filters,
    FilterNames /*, WeldingTimeMeasurementTrends */,
    AggregateColumn,
    MeasurementAggregateWidgets,
} from 'models';
import { getAllCycleGapSprsSaga as getAllCycleGapsSaga } from 'services/cycle-gap-spr/sagas/cycle-gap-spr-saga-get-all';

import { Chart } from 'components/panels';
// import {
//     cycleGapMetaDataActions,
//     cycleGapMetaDataReducer,
//     cycleGapMetaDataKey,
// } from 'services/cycle-gap-meta-data/cycle-gap-meta-data-reducer';

import {
    cycleGapMetaDataSprActions,
    cycleGapMetaDataSprReducer,
    cycleGapMetaDataSprKey,
} from 'services/cycle-gap-meta-data-spr/cycle-gap-meta-data-spr-reducer';
import { getAllCycleGapMetaDatasSaga } from 'services/cycle-gap-meta-data/sagas/cycle-gap-meta-data-saga-get-all';
import { getAllCycleGapMetaDataSprsSaga } from 'services/cycle-gap-meta-data-spr/sagas/cycle-gap-meta-data-spr-saga-get-all';

import {
    selectMeasurementAggregateWidgetSprs,
    selectMeasurementAggregateWidgetSprIsLoading,
} from 'services/measurement-aggregate-widget-spr/measurement-aggregate-widget-spr-selectors';
import { selectDeviceNames } from 'services/device/device-name/device-name-selectors';
import { selectStations } from 'services/station/station-selectors';
import { ChartRef } from 'components/panels/Chart/Chart';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';
import startCase from 'lodash/startCase';
import * as _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import 'scss/main.scss';
import { chartTheme, ThemeModes } from 'styles/theme/themes';
import './MeasurementAggregateWidgetSpr.scss';
import { useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { synchronousChart } from 'utils/synchronousChart';

interface MeasurementAggregateWidgetSprProps extends WidgetProps {
    data?: any;
    title?: string;
    loadData?: boolean;
    localFilters: Filters;
    getRef?(ref: ChartRef);
    refs?: ChartRef[];
    chartData: any;
    setExtraPanelState: any;
}

export const MeasurementAggregateWidgetSprWidget: Widget<MeasurementAggregateWidgetSprProps> = memo(
    (props: MeasurementAggregateWidgetSprProps) => {
        const { className = '', filters = {}, data, title = '', getRef, refs, chartData } = props;
        const { unit = '' } = data;
        const dispatch = useDispatch();
        useInjectReducer({ key: cycleGapSprKey, reducer: cycleGapSprReducer });

        useInjectSaga({ key: cycleGapSprKey, saga: getAllCycleGapsSaga });

        useInjectReducer({ key: cycleGapMetaDataSprKey, reducer: cycleGapMetaDataSprReducer });
        useInjectSaga({ key: cycleGapMetaDataSprKey, saga: getAllCycleGapMetaDataSprsSaga });
        const deviceNames: DeviceNames = useSelector(selectDeviceNames);
        const stations: Stations = useSelector(selectStations);
        const { t, i18n } = useTranslation();
        const themeMode: 'light' | 'dark' = useTheme().palette.mode;

        const measurementAggregateWidgetIsLoading: boolean = useSelector(selectMeasurementAggregateWidgetSprIsLoading);

        const options = {
            chart: {
                height: '290px',
                renderTo: 'container',
                type: 'scatter',
                zoomType: 'xy',
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
                    '<tr><td style="color: {series.color}">OutletNo : </td>' +
                    '<td style="text-align: left"><b>{point.outletNo}</b></td></tr>' +
                    '<tr><td style="color: {series.color}">Program : </td>' +
                    '<td style="text-align: left"><b>{point.program}</b></td></tr>',
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
                                        cycleGapMetaDataSprActions.getAllCycleGapMetaDataSprs({
                                            plantId: filters.plantId,
                                            systemType: filters?.systemType,
                                            deviceName: this?.series?.name,
                                            fromTime: this?.series?.options?.data[this.index]?.time,
                                            toTime: this?.series?.options?.data[this.index]?.time,
                                            outletNo: this?.series?.options?.data[this.index]?.outletNo,
                                            program: this?.series?.options?.data[this.index]?.studId,
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
                    turboThreshold: 1000000,
                },
            },
        };

        return (
            <Box style={{ width: '100%' }}>
                <Chart
                    key={`aggregate-chart-spr-${title}`}
                    chartType={'scatter'}
                    xChartTitle=""
                    yChartTitle=""
                    className={` ${className} x-cls-event-code-frequency-widget `}
                    options={options}
                    getRef={getRef}
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
        multiple: false,
        disableClearable: true,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.program,
        label: 'Filters.Program',
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.outletNo,
        label: 'Filters.OutletLabel',
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
];
export const MeasurementAggregateWidgetSprProperty = Object.assign(
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

export default MeasurementAggregateWidgetSprWidget;

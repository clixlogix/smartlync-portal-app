/**
 *
 * StudProjectionMeasurementTrend
 *
 */
import React, { useState, memo, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    studProjectionMeasurementTrendActions,
    studProjectionMeasurementTrendReducer,
    studProjectionMeasurementTrendKey,
} from 'services/stud-projection-measurement-trend/stud-projection-measurement-trend-reducer';
import {
    selectStudProjectionMeasurementTrends,
    selectStudProjectionMeasurementTrendIsLoading,
} from 'services/stud-projection-measurement-trend/stud-projection-measurement-trend-selectors';
import { Chart } from 'components/panels';
import { getAllStudProjectionMeasurementTrendsSaga } from 'services/stud-projection-measurement-trend/sagas/stud-projection-measurement-trend-saga-get-all';
import { Filters, FilterNames /*, StudProjectionMeasurementTrends*/, AggregateColumn } from 'models';
import { synchronousChart } from 'utils/synchronousChart';
import { Options } from 'highcharts';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { ChartRef } from 'components/panels/Chart/Chart';
import { messages } from './messages';
import * as _ from 'lodash';
import 'scss/main.scss';
import './StudProjectionMeasurementTrend.scss';

interface StudProjectionMeasurementTrendProps extends WidgetProps {
    localFilters: Filters;
    getRef?(ref: ChartRef);
    refs?: ChartRef[];
}

export const StudProjectionMeasurementTrendWidget: Widget<StudProjectionMeasurementTrendProps> = memo(
    (props: StudProjectionMeasurementTrendProps) => {
        const { className = '', filters = {}, getRef, refs, onFilterChange = () => {} } = props;
        const { view } = filters;
        useInjectReducer({ key: studProjectionMeasurementTrendKey, reducer: studProjectionMeasurementTrendReducer });
        useInjectSaga({ key: studProjectionMeasurementTrendKey, saga: getAllStudProjectionMeasurementTrendsSaga });

        const { t, i18n } = useTranslation();

        const studProjectionMeasurementTrends: any | undefined = useSelector(selectStudProjectionMeasurementTrends);
        const studProjectionMeasurementTrendIsLoading: boolean = useSelector(
            selectStudProjectionMeasurementTrendIsLoading,
        );

        const dispatch = useDispatch();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [isEmptyData, setEmptyData] = useState<boolean>(false);
        if (props.isLoading) {
            props.isLoading(studProjectionMeasurementTrendIsLoading);
        }

        const [widgetFilters] = useState<Filters>({
            // add your filters here
            ...filters,
        });

        const serviceFilters = useMemo(
            () => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }),
            [widgetFilters, filters, i18n.language],
        );
        useEffect(
            () => {
                onFilterChange({
                    ...serviceFilters,
                });
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [],
        );

        useEffect(() => {
            const filter = _.omitBy(
                {
                    [FilterNames.deviceName]: serviceFilters.deviceName,
                    [FilterNames.langCode]: serviceFilters.selectedLanguage,
                    [FilterNames.fromTime]: serviceFilters.fromTime,
                    [FilterNames.toTime]: serviceFilters.toTime,
                    [FilterNames.systemType]: serviceFilters.systemType,
                    [FilterNames.station]: serviceFilters.station,
                    [FilterNames.groupBy]: serviceFilters.groupBy,
                    [FilterNames.aggregateType]: serviceFilters.aggregateType,
                    [FilterNames.aggregateColumn]: AggregateColumn.boltProjection,
                    [FilterNames.aggregateWindow]: view,
                    [FilterNames.aggregateNeeded]: serviceFilters.aggregateNeeded,
                    [FilterNames.carTypeId]: serviceFilters.carbodyId,
                },
                _.isNil,
            );
            dispatch(studProjectionMeasurementTrendActions.getAllStudProjectionMeasurementTrends(filter));
        }, [
            dispatch,
            serviceFilters.deviceName,
            serviceFilters.fromTime,
            serviceFilters.selectedLanguage,
            serviceFilters.station,
            serviceFilters.systemType,
            serviceFilters.toTime,
            serviceFilters.groupBy,
            serviceFilters.aggregateType,
            serviceFilters.aggregateNeeded,
            serviceFilters.carbodyId,
            view,
        ]);

        useEffect(() => {
            const filter = _.omitBy(
                {
                    [FilterNames.studId]: serviceFilters.studId,
                    [FilterNames.outletNo]: serviceFilters.outletNo,
                    [FilterNames.feederNo]: serviceFilters.feederNo,
                    [FilterNames.systemType]: serviceFilters.systemType,
                    [FilterNames.carTypeId]: serviceFilters.carbodyId,
                },
                _.isNil,
            );

            dispatch(studProjectionMeasurementTrendActions.localFiltering(filter));
        }, [
            dispatch,
            serviceFilters.studId,
            serviceFilters.outletNo,
            serviceFilters.feederNo,
            serviceFilters.systemType,
            serviceFilters.carbodyId,
        ]);

        useEffect(
            () => {
                if (_.isEmpty(studProjectionMeasurementTrends)) {
                    setEmptyData(true);
                } else {
                    setEmptyData(false);
                }
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [studProjectionMeasurementTrends],
        );

        const options: Options = {
            chart: {
                renderTo: 'container',
                type: 'scatter',
                zoomType: 'xy',
            },
            rangeSelector: {
                selected: 1,
            },
            title: {
                text: `${t(messages.studProjectionMeasurementTrendTitle)}`,
            },
            xAxis: {
                labels: {
                    step: 1,
                },
                // min: 0,
                // max: 50,
                type: 'datetime',
                scrollbar: {
                    enabled: true,
                },
                events: {
                    afterSetExtremes: synchronousChart(refs),
                },
            },
            yAxis: [
                {
                    gridLineColor: '#424242',
                    title: {
                        text: '',
                    },
                    labels: {
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Open Sans',
                            color: 'white',
                        },
                    },
                    tickmarkPlacement: 'on',
                    reversed: true,
                },
            ],
            series: studProjectionMeasurementTrends,
            tooltip: {
                useHTML: true,
                headerFormat: '<table><tr><th colspan="2">{series.name}</th></tr>',
                pointFormat:
                    '<tr><td style="color: {series.color}">Date : </td>' +
                    '<td style="text-align: left"><b>{point.time}</b></td></tr>' +
                    '<tr><td style="color: {series.color}">Stud Projection Time : </td>' +
                    '<td style="text-align: left"><b>{point.studProjection}</b></td></tr>' +
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
            plotOptions: {
                scatter: {
                    turboThreshold: 1000000,
                },
                series: {
                    marker: {
                        radius: 2,
                    },
                },
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                maxHeight: 55,
            },
        };

        return (
            <Div
                style={{ width: '100%', height: '100%' }}
                className={` ${className} x-cls-fault-rate-measurement-trend-widget`}
            >
                <Chart
                    chartType={'scatter'}
                    // chartTitle={t(messages.faultFrequencyChartTitle)}
                    xChartTitle=""
                    yChartTitle=""
                    className={` ${className} x-cls-event-code-frequency-widget `}
                    options={options}
                    getRef={getRef}
                    // data={displayRows.y}
                    // isLoading={isLoading}
                />
            </Div>
        );
    },
);

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    {
        name: FilterNames.aggregateNeeded,
        type: FilterType.Select,
        defaultValue: 'true',
        label: 'Filters.AggregateNeeded',
        data: { options: ['true', 'false'] } as SelectFilterData,
    },
    {
        name: FilterNames.station,
        type: FilterType.Select,
        defaultValue: 'Z8.3_020',
        data: { options: ['Z8.3_020', 'Z8.3_070'] } as SelectFilterData,
    },
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
    {
        name: FilterNames.groupBy,
        label: 'Filters.GroupBy',
        type: FilterType.Select,
        multiple: true,
        data: { options: ['deviceName', 'outletNo', 'feederNo', 'studId'] } as SelectFilterData,
    },
    {
        name: FilterNames.view,
        type: FilterType.Select,
        label: 'Filters.View',
        data: { options: ['Filters.Weekly', 'Filters.Daily', 'Filters.Hourly'] } as SelectFilterData,
    },
];
export const StudProjectionMeasurementTrendProperty = Object.assign(
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

export default StudProjectionMeasurementTrendWidget;

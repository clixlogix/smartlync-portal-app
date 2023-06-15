/**
 *
 * DropTimeMeasurementTrend
 *
 */
import React, { useState, memo, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    dropTimeMeasurementTrendActions,
    dropTimeMeasurementTrendReducer,
    dropTimeMeasurementTrendKey,
} from 'services/drop-time-measurement-trend/drop-time-measurement-trend-reducer';
import {
    selectDropTimeMeasurementTrends,
    selectDropTimeMeasurementTrendIsLoading,
} from 'services/drop-time-measurement-trend/drop-time-measurement-trend-selectors';
import { getAllDropTimeMeasurementTrendsSaga } from 'services/drop-time-measurement-trend/sagas/drop-time-measurement-trend-saga-get-all';
import { ChartRef } from 'components/panels/Chart/Chart';

import { Filters, FilterNames /*, DropTimeMeasurementTrends*/, AggregateColumn } from 'models';
import { Chart } from 'components/panels';
import { synchronousChart } from 'utils/synchronousChart';
import * as _ from 'lodash';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';
import 'scss/main.scss';
import './DropTimeMeasurementTrend.scss';

interface DropTimeMeasurementTrendProps extends WidgetProps {
    getRef?(ref: ChartRef);
    refs?: ChartRef[];
    localFilters: Filters;
}

export const DropTimeMeasurementTrendWidget: Widget<DropTimeMeasurementTrendProps> = memo(
    (props: DropTimeMeasurementTrendProps) => {
        const { className = '', filters = {}, getRef, refs, onFilterChange = () => {} } = props;
        const { view } = filters;
        useInjectReducer({ key: dropTimeMeasurementTrendKey, reducer: dropTimeMeasurementTrendReducer });
        useInjectSaga({ key: dropTimeMeasurementTrendKey, saga: getAllDropTimeMeasurementTrendsSaga });

        const { t, i18n } = useTranslation();

        const dropTimeMeasurementTrends: any | undefined = useSelector(selectDropTimeMeasurementTrends);
        const dropTimeMeasurementTrendIsLoading: boolean = useSelector(selectDropTimeMeasurementTrendIsLoading);
        const dispatch = useDispatch();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [isEmptyData, setEmptyData] = useState<boolean>(false);

        if (props.isLoading) {
            props.isLoading(dropTimeMeasurementTrendIsLoading);
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

        useEffect(
            () => {
                if (_.isEmpty(dropTimeMeasurementTrends)) {
                    setEmptyData(true);
                } else {
                    setEmptyData(false);
                }
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [dropTimeMeasurementTrends],
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
                    [FilterNames.aggregateColumn]: AggregateColumn.dropTime,
                    [FilterNames.aggregateWindow]: view,
                    [FilterNames.aggregateNeeded]: serviceFilters.aggregateNeeded,
                    [FilterNames.carTypeId]: serviceFilters.carbodyId,
                },
                _.isNil,
            );
            dispatch(dropTimeMeasurementTrendActions.getAllDropTimeMeasurementTrends(filter));
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

            dispatch(dropTimeMeasurementTrendActions.localFiltering(filter));
        }, [
            dispatch,
            serviceFilters.studId,
            serviceFilters.outletNo,
            serviceFilters.feederNo,
            serviceFilters.systemType,
            serviceFilters.carbodyId,
        ]);

        const options = {
            chart: {
                renderTo: 'container',
                type: 'scatter',
            },
            rangeSelector: {
                selected: 1,
            },
            title: {
                text: `${t(messages.dropTimeMeasurementTrendSubTitle)}`,
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
            series: dropTimeMeasurementTrends,
            tooltip: {
                useHTML: true,
                headerFormat: '<table><tr><th colspan="2">{series.name}</th></tr>',
                pointFormat:
                    '<tr><td style="color: {series.color}">Date : </td>' +
                    '<td style="text-align: left"><b>{point.time}</b></td></tr>' +
                    '<tr><td style="color: {series.color}">Drop: </td>' +
                    '<td style="text-align: left"><b>{point.dropTime}</b></td></tr>' +
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
                bar: {
                    pointWidth: 10,
                    pointPadding: 0,
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
            <div
                style={{ width: '100%', height: '100%' }}
                className={` ${className} x-cls-fault-rate-measurement-trend-widget`}
            >
                <Chart
                    chartType={'scatter'}
                    chartTitle={t(messages.dropTimeMeasurementTrendSubTitle)}
                    xChartTitle=""
                    yChartTitle=""
                    className={` ${className} x-cls-event-code-frequency-widget `}
                    options={options}
                    getRef={getRef}
                    // data={displayRows.y}
                    // isLoading={isLoading}
                />
            </div>
        );
    },
);

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
        defaultValue: '',
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
export const DropTimeMeasurementTrendProperty = Object.assign(
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

export default DropTimeMeasurementTrendWidget;

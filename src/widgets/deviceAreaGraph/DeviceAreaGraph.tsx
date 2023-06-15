/**
 *
 * DeviceAreaGraph
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    deviceAreaGraphActions,
    deviceAreaGraphReducer,
    deviceAreaGraphKey,
} from 'services/device-area-graph/device-area-graph-reducer';
import { Chart } from 'components/panels';
import moment from 'moment';
import {
    selectDeviceAreaGraphs,
    selectDeviceAreaGraphIsLoading,
} from 'services/device-area-graph/device-area-graph-selectors';

import { getAllDeviceAreaGraphsSaga } from 'services/device-area-graph/sagas/device-area-graph-saga-get-all';

import { Filters } from 'models';
import { WidgetProps, Widget } from 'widgets';
// import { messages } from './messages';

import 'scss/main.scss';
import './DeviceAreaGraph.scss';

interface DeviceAreaGraphProps extends WidgetProps {}

export const DeviceAreaGraphWidget: Widget<DeviceAreaGraphProps> = memo((props: DeviceAreaGraphProps) => {
    const { className = '', filters = {} } = props;
    useInjectReducer({ key: deviceAreaGraphKey, reducer: deviceAreaGraphReducer });

    useInjectSaga({ key: deviceAreaGraphKey, saga: getAllDeviceAreaGraphsSaga });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t } = useTranslation();

    const deviceAreaGraphs: any = useSelector(selectDeviceAreaGraphs);
    const deviceAreaGraphIsLoading: boolean = useSelector(selectDeviceAreaGraphIsLoading);
    const dispatch = useDispatch();

    const displayRows = useMemo(() => {
        return deviceAreaGraphs || []; // .filter((row) => !row.hidden);
    }, [deviceAreaGraphs]);

    if (props.isLoading) {
        props.isLoading(deviceAreaGraphIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        ...defaultFilters,
        // add your filters here
        ...filters,
    });

    useEffect(() => {
        dispatch(deviceAreaGraphActions.getAllDeviceAreaGraphs(widgetFilters));
    }, [dispatch, widgetFilters]);

    const { /* categories = [],  categoriesX = [], */ graphData = [] } = useMemo(() => {
        return displayRows.reduce(
            (acc, item) => {
                acc.categories.push(item?.weldingRate);
                acc.categoriesX.push(moment(item?.dateTime).format('MMM DD'));

                acc.graphData.push({
                    name: moment(item?.dateTime || '').valueOf(),
                    y: item?.weldingRate,
                    dateTimeFormatted: moment(item?.dateTime).format('MMM DD'),
                });

                return acc;
            },
            {
                graphData: [],
                categories: [],
                categoriesX: [],
            },
        );
    }, [displayRows]);

    const options = useMemo(
        () => ({
            chart: {
                renderTo: 'container',
                type: 'scatter',
            },
            rangeSelector: {
                selected: 1,
            },
            title: {
                text: '',
            },
            xAxis: {
                type: 'datetime',
                // labels: {
                //     step: 1,
                // },
                gridLineWidth: 1,
                min: 0,
                max: 11,
                offset: 65,
                scrollbar: {
                    enabled: true,
                },
                categories: [1, 2, 3, 4, 5],
            },
            yAxis: [
                {
                    min: 0,
                    max: 99.9,
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
                        format: '{value}%',
                    },
                    tickmarkPlacement: 'on',
                },
            ],
            series: [
                {
                    data: [...graphData],
                    color: '#2C7462',
                    name: 'Graph',
                    tooltip: {
                        useHTML: true,
                        headerFormat: '',
                        pointFormat: `<b> {point.y}</b><br/><b>Date: {point.dateTimeFormatted}</b><br/>`,
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
                                verticalAlign: 'bottom',
                            },
                        },
                    },
                ],
            },
        }),
        [graphData],
    );

    return (
        <Chart
            chartType={'scatter'}
            // chartTitle={t(messages.faultFrequencyChartTitle)}
            xChartTitle=""
            yChartTitle=""
            className={` ${className} x-cls-device-area-graph-widget`}
            options={options}
            // data={displayRows.y}
            // isLoading={isLoading}
        />
    );
});

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
*/
];
export const DeviceAreaGraphProperty = Object.assign(
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

export default DeviceAreaGraphWidget;

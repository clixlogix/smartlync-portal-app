/**
 *
 * WopRateMeasurementTrend
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import moment from 'moment';
import {
    wopRateMeasurementTrendActions,
    wopRateMeasurementTrendReducer,
    wopRateMeasurementTrendKey,
} from 'services/wop-rate-measurement-trend/wop-rate-measurement-trend-reducer';
import {
    selectWopRateMeasurementTrends,
    selectWopRateMeasurementTrendIsLoading,
} from 'services/wop-rate-measurement-trend/wop-rate-measurement-trend-selectors';

import { getAllWopRateMeasurementTrendsSaga } from 'services/wop-rate-measurement-trend/sagas/wop-rate-measurement-trend-saga-get-all';

import { Filters, FilterNames /*, WopRateMeasurementTrends */ } from 'models';
import { Chart } from 'components/panels';

import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
// import { messages } from './messages';

import 'scss/main.scss';
import './WopRateMeasurementTrend.scss';

interface WopRateMeasurementTrendProps extends WidgetProps {
    localFilters: Filters;
}

export const WopRateMeasurementTrendWidget: Widget<WopRateMeasurementTrendProps> = memo(
    (props: WopRateMeasurementTrendProps) => {
        const { className = '', filters = {} } = props;
        useInjectReducer({ key: wopRateMeasurementTrendKey, reducer: wopRateMeasurementTrendReducer });

        useInjectSaga({ key: wopRateMeasurementTrendKey, saga: getAllWopRateMeasurementTrendsSaga });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { t } = useTranslation();

        const wopRateMeasurementTrends: any | undefined = useSelector(selectWopRateMeasurementTrends);
        const wopRateMeasurementTrendIsLoading: boolean = useSelector(selectWopRateMeasurementTrendIsLoading);
        const dispatch = useDispatch();

        const displayRows = useMemo(() => {
            return wopRateMeasurementTrends || []; // .filter((row) => !row.hidden);
        }, [wopRateMeasurementTrends]);

        if (props.isLoading) {
            props.isLoading(wopRateMeasurementTrendIsLoading);
        }

        const [widgetFilters] = useState<Filters>({
            ...defaultFilters,
            // add your filters here
            ...filters,
        });

        useEffect(() => {
            dispatch(wopRateMeasurementTrendActions.getAllWopRateMeasurementTrends(widgetFilters));
        }, [dispatch, widgetFilters]);

        const categories: any = [];
        const categoriesX: any = [];

        const graphData: any = [];
        displayRows?.forEach((item) => {
            categories.push(item?.wopRate);
            categoriesX.push(moment(item?.dateTime).format('MMM DD'));
            return graphData.push({
                name: moment(item?.dateTime || '').valueOf(),
                y: item?.wopRate,
                dateTimeFormatted: moment(item?.dateTime).format('MMM DD'),
                ...item,
            });
        });

        const options = {
            title: {
                text: '',
            },
            xAxis: {
                type: 'datetime',
                scrollbar: {
                    enabled: true,
                },
                categories: categoriesX,
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
                    categories: categories,
                    reversed: true,
                },
            ],
            series: [
                {
                    data: [...graphData],
                    name: 'WOP Rate',
                    color: '#EF563B',
                    tooltip: {
                        useHTML: true,
                        headerFormat: '',
                        pointFormat:
                            `<b>WOP Rate: {point.wopRate}</b><br/>` +
                            `<b>Date: {point.dateTimeFormatted}</b><br/>` +
                            `<br/><tr><td>WOP Count: </td><td style="text-align: right"><b>{point.faultCount}</b></td></tr>` +
                            `<br/><tr><td>Cycle Count: </td><td style="text-align: right"><b>{point.cycleCount}</b></td></tr>`,
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
        };

        return (
            <Div
                style={{ width: '100%', height: '100%' }}
                className={` ${className} x-cls-fault-rate-measurement-trend-widget`}
            >
                <Chart
                    chartType={'line'}
                    // chartTitle={t(messages.faultFrequencyChartTitle)}
                    xChartTitle=""
                    yChartTitle=""
                    className={` ${className} x-cls-event-code-frequency-widget `}
                    options={options}
                />
            </Div>
        );
    },
);

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    {
        name: FilterNames.stationName,
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
        data: { options: ['Filters.Weekly', 'Filters.Daily'] } as SelectFilterData,
    },
];
export const WopRateMeasurementTrendProperty = Object.assign(
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

export default WopRateMeasurementTrendWidget;

/**
 *
 * FaultRateMeasurementTrend
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { FilterNames, Filters /*, FaultRateMeasurementTrends*/ } from 'models';
import moment from 'moment';
import { Chart } from 'components/panels';
import {
    faultRateMeasurementTrendActions,
    faultRateMeasurementTrendReducer,
    faultRateMeasurementTrendKey,
} from 'services/fault-rate-measurement-trend/fault-rate-measurement-trend-reducer';
import {
    selectFaultRateMeasurementTrends,
    selectFaultRateMeasurementTrendIsLoading,
} from 'services/fault-rate-measurement-trend/fault-rate-measurement-trend-selectors';
import { getAllFaultRateMeasurementTrendsSaga } from 'services/fault-rate-measurement-trend/sagas/fault-rate-measurement-trend-saga-get-all';
// import { filterByLocalFilters } from 'utils/filterByLocalFilters';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';

import 'scss/main.scss';
import './FaultRateMeasurementTrend.scss';

interface FaultRateMeasurementTrendProps extends WidgetProps {
    localFilters: Filters;
}

export const FaultRateMeasurementTrendWidget: Widget<FaultRateMeasurementTrendProps> = memo(
    (props: FaultRateMeasurementTrendProps) => {
        const { className = '', filters = {} /*, localFilters = {}*/ } = props;

        useInjectReducer({ key: faultRateMeasurementTrendKey, reducer: faultRateMeasurementTrendReducer });
        useInjectSaga({ key: faultRateMeasurementTrendKey, saga: getAllFaultRateMeasurementTrendsSaga });

        const { t, i18n } = useTranslation();

        const faultRateMeasurementTrends: any | undefined = useSelector(selectFaultRateMeasurementTrends);
        const faultRateMeasurementTrendIsLoading: boolean = useSelector(selectFaultRateMeasurementTrendIsLoading);

        // const categories: any = useSelector(selectFaultRateCategories);
        // const graphData1: any = useSelector(selectFaultRateGraphData);
        const dispatch = useDispatch();

        const displayRows = useMemo(() => {
            return faultRateMeasurementTrends || []; // .filter((row) => !row.hidden);
        }, [faultRateMeasurementTrends]);

        if (props.isLoading) {
            props.isLoading(faultRateMeasurementTrendIsLoading);
        }

        const [widgetFilters] = useState<Filters>({
            langCode: i18n.language,
            ...filters,
        });

        useEffect(() => {
            dispatch(faultRateMeasurementTrendActions.getAllFaultRateMeasurementTrends(widgetFilters));
        }, [dispatch, widgetFilters]);

        const { categories = [], categoriesX = [], graphData = [] } = useMemo(() => {
            return displayRows.reduce(
                (acc, item) => {
                    acc.categories.push(item?.faultRate);
                    acc.categoriesX.push(moment(item?.dateTime).format('MMM DD'));
                    acc.graphData.push({
                        name: moment(item?.dateTime || '').valueOf(),
                        y: item?.faultRate,
                        dateTimeFormatted: moment(item?.dateTime).format('MMM DD'),
                        ...item,
                    });
                    return acc;
                },
                { categories: [], categoriesX: [], graphData: [] },
            );
        }, [displayRows]);

        const options = useMemo(
            () => ({
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
                        categories,
                        reversed: true,
                    },
                ],
                series: [
                    {
                        data: [...graphData],
                        name: t(messages.faultRate),
                        tooltip: {
                            useHTML: true,
                            headerFormat: '',
                            pointFormat: `<b>Fault Rate: {point.faultRate}</b><br/>
                                <b>Date: {point.dateTimeFormatted}</b><br/>
                                <br/><tr><td>Fault Count: </td><td style="text-align: right"><b>{point.faultCount}</b></td></tr>
                                <br/><tr><td>Cycle Count: </td><td style="text-align: right"><b>{point.cycleCount}</b></td></tr>`,
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
            [categories, categoriesX, graphData, t],
        );

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
export const FaultRateMeasurementTrendProperty = Object.assign(
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

export default FaultRateMeasurementTrendWidget;

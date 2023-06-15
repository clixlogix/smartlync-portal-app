/**
 *
 * DurationOfFaultsSpr
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    durationOfFaultsSprActions,
    durationOfFaultsSprReducer,
    durationOfFaultsSprKey,
} from 'services/duration-of-faults-spr/duration-of-faults-spr-reducer';
import {
    selectDurationOfFaultsSprs,
    selectDurationOfFaultsSprIsLoading,
} from 'services/duration-of-faults-spr/duration-of-faults-spr-selectors';

import { getAllDurationOfFaultsSprsSaga } from 'services/duration-of-faults-spr/sagas/duration-of-faults-spr-saga-get-all';

import { Filters, DurationOfFaultsSprs, FilterNames, DurationOfFaultsSpr } from 'models';
import { Chart } from 'components/panels';
import { messages } from './messages';
import { filterByLocalFilters } from 'utils/filterByLocalFilters';
import { WidgetProps, Widget } from 'widgets';
import orderBy from 'lodash/orderBy';
import { useTheme } from '@mui/material';

interface DurationOfFaultsSprProps extends WidgetProps {
    localFilters: Filters;
}

export const DurationOfFaultsSprWidget: Widget<DurationOfFaultsSprProps> = memo((props: DurationOfFaultsSprProps) => {
    const { className = '', filters = {}, localFilters = {} } = props;
    useInjectReducer({ key: durationOfFaultsSprKey, reducer: durationOfFaultsSprReducer });

    useInjectSaga({ key: durationOfFaultsSprKey, saga: getAllDurationOfFaultsSprsSaga });

    const { t, i18n } = useTranslation();

    const [widgetFilters] = useState<Filters>({
        langCode: i18n.language,
        ...filters,
    });

    const durationOfFaults: DurationOfFaultsSprs | undefined = useSelector(selectDurationOfFaultsSprs);
    const isLoading: boolean = useSelector(selectDurationOfFaultsSprIsLoading);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(isLoading);
    }
    const themePallete = useTheme().palette;
    const themeMode: 'light' | 'dark' = themePallete.mode;

    const dataAfterLocalFilter = filterByLocalFilters(durationOfFaults, localFilters);

    const [weeklyDataFormatted] = useMemo(() => {
        const fault: any[] = (dataAfterLocalFilter || []).reduce((accumulator: any[], row: DurationOfFaultsSpr) => {
            accumulator.push({
                name: row.faultCode.toString(),
                y: +(+row.duration).toFixed(2),
                description: row?.description,
            });

            return accumulator;
        }, []);

        const sortedValues = orderBy(fault, ['y'], ['desc']);

        return [{ fault: sortedValues }];
    }, [dataAfterLocalFilter]);

    const serviceFilters = useMemo(() => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }), [
        widgetFilters,
        filters,
        i18n.language,
    ]);
    useEffect(() => {
        dispatch(durationOfFaultsSprActions.getAllDurationOfFaultsSprs(serviceFilters));
    }, [dispatch, serviceFilters, filters]);

    const series: any[] = useMemo(
        () => [
            {
                type: 'pareto',
                name: 'Pareto',
                color: 'red',
                style: {
                    color: themePallete.text.primary,
                },
                baseSeries: 1,
                tooltip: {
                    valuePrefix: 'Pareto: ',
                    valueDecimals: 2,
                    valueSuffix: '%',
                },
                yAxis: 1,
            },
            {
                type: 'column',
                // name: 'Percentage',
                color: '#149B74',
                borderWidth: 0,
                data: weeklyDataFormatted.fault,
                panningEnabled: false,
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Open Sans',
                    },
                },
                tooltip: {
                    valuePrefix: 'Duration: ',
                    valueDecimals: 1,
                    valueSuffix: ' mins',
                    pointFormat: '<b>{point.y}</b></br><b>Description: {point.description}</b>',
                },
            },
        ],
        [themeMode, weeklyDataFormatted.fault],
    );

    const options = useMemo(
        () => ({
            xAxis: {
                max: series[1] && series[1]?.data?.length > 10 ? 20 : null,
            },
            legend: {
                enabled: false,
            },
            yAxis: [
                {
                    gridLineColor: 'transparent',
                    lineWidth: 1,
                    title: {
                        text: `${t(messages.yAxisDurationOfFaultsTitle)} (mins)`,
                        style: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            fontFamily: 'Open Sans',
                            color: themePallete.text.primary,
                        },
                    },
                    labels: {
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Open Sans',
                            color: themePallete.text.primary,
                        },
                    },
                },
                {
                    gridLineColor: 'transparent',
                    opposite: true,
                    min: 0,
                    max: 100,
                    title: {
                        text: '',
                        style: {
                            color: themePallete.text.primary,
                            fontFamily: 'Open Sans',
                        },
                    },
                    labels: {
                        format: '{value}%',
                        style: {
                            color: themePallete.text.primary,
                            fontFamily: 'Open Sans',
                        },
                    },
                    lineWidth: 1,
                },
            ],
            plotOptions: {
                column: {
                    pointPlacement: 0,
                    grouping: false,
                    shadow: false,
                    getExtremesFromAll: true,
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
                                verticalAlign: 'bottom',
                            },
                        },
                    },
                ],
            },
        }),
        [series, t, themeMode],
    );

    return (
        <Chart
            chartType={'column'}
            chartTitle={t(messages.durationOfFaultsTitle)}
            xChartTitle={t(messages.xAxisDurationOfFaultsTitle)}
            tooltipFormat={`<b>{point.y}</b>`}
            className={` ${className} x-cls-duration-of-faults-widget `}
            options={options}
            isLoading={isLoading}
        />
    );
});

export const DurationOfFaultsSprProperty = {
    defaultFilters: [],
    type: 'panel',
    layout: {
        x: 0,
        y: 0,
        w: 2,
        h: 3,
        minW: 1,
        minH: 1,
    },
};
export default DurationOfFaultsSprWidget;

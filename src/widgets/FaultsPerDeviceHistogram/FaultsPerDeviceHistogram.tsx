/**
 *
 * FaultsPerDeviceHistogram
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    faultsPerDeviceHistogramActions,
    faultsPerDeviceHistogramReducer,
    faultsPerDeviceHistogramKey,
} from 'services/faults-per-device-histogram/faults-per-device-histogram-reducer';
import {
    selectFaultsPerDeviceHistograms,
    selectFaultsPerDeviceHistogramIsLoading,
    selectFaultsPerDeviceHistogramCategories,
} from 'services/faults-per-device-histogram/faults-per-device-histogram-selectors';

import { getAllFaultsPerDeviceHistogramsSaga } from 'services/faults-per-device-histogram/sagas/faults-per-device-histogram-saga-get-all';

import { Filters, FaultsPerDeviceHistograms, FilterNames } from 'models';
import { Chart } from 'components/panels';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';
import 'scss/main.scss';
import './FaultsPerDeviceHistogram.scss';
import Histogram from 'highcharts/modules/histogram-bellcurve.js';
import Highcharts from 'highcharts/highstock';
import { Box } from '@mui/material';

interface FaultsPerDeviceHistogramProps extends WidgetProps {
    localFilters: Filters;
}

Histogram(Highcharts);

export const FaultsPerDeviceHistogramWidget: Widget<FaultsPerDeviceHistogramProps> = memo(
    (props: FaultsPerDeviceHistogramProps) => {
        const { className = '', filters = {} } = props;
        useInjectReducer({ key: faultsPerDeviceHistogramKey, reducer: faultsPerDeviceHistogramReducer });

        useInjectSaga({ key: faultsPerDeviceHistogramKey, saga: getAllFaultsPerDeviceHistogramsSaga });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { t, i18n } = useTranslation();

        const faultsPerDeviceHistograms: FaultsPerDeviceHistograms | undefined = useSelector(
            selectFaultsPerDeviceHistograms,
        );
        const category = useSelector(selectFaultsPerDeviceHistogramCategories);

        const faultsPerDeviceHistogramIsLoading: boolean = useSelector(selectFaultsPerDeviceHistogramIsLoading);
        const dispatch = useDispatch();

        const displayRows = useMemo(() => {
            return faultsPerDeviceHistograms || []; // .filter((row) => !row.hidden);
        }, [faultsPerDeviceHistograms]);

        if (props.isLoading) {
            props.isLoading(faultsPerDeviceHistogramIsLoading);
        }

        const [widgetFilters] = useState<Filters>({
            // add your filters here
            ...filters,
        });

        const serviceFilters = useMemo(
            () => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }),
            [widgetFilters, filters, i18n.language],
        );

        useEffect(() => {
            dispatch(faultsPerDeviceHistogramActions.getAllFaultsPerDeviceHistograms(serviceFilters));
        }, [dispatch, serviceFilters]);

        const options = {
            chart: {
                type: 'bar',
                zoomType: 'xy',
            },
            xAxis: {
                categories: category,
                max: category.size > 9 ? 9 : category.size ? category.size - 1 : 9,
                scrollbar: {
                    enabled: true,
                },
                labels: {
                    step: 0,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                    },
                    y: 35,
                },
            },
            title: {
                text: '',
            },
            legend: {
                title: {
                    text: 'Event Code',
                },
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    label: {
                        connectorAllowed: false,
                    },
                },
                histogram: {
                    pointWidth: 20,
                },
            },
            tooltip: {
                useHTML: true,
                headerFormat: '<table><tr><th colspan="2">Event Code :{series.name}</th></tr>',
                pointFormat:
                    '<tr><td style="color: {series.color}">occurrences : </td>' +
                    '<td style="text-align: left"><b>{point.occurrences}</b></td></tr>' +
                    '<tr><td style="color: {series.color}">Device Name : </td>' +
                    '<td style="text-align: left"><b>{point.deviceName}</b></td></tr>' +
                    '<tr><td style="color: {series.color}">Description : </td>' +
                    '<td style="text-align: left"><b>{point.details.description}</b></td></tr>',
                footerFormat: '</table>',
            },
            series: displayRows,
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 50000,
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
            <Box sx={{ width: '100%', height: '100%', display: 'flex', flex: 1 }}>
                <Chart
                    chartType={'bar'}
                    xChartTitle={t(messages.xAxisTitle)}
                    yChartTitle={t(messages.yAxisTitle)}
                    className={` ${className} x-cls-faults-per-device-histogram-widget maximize-widget-width`}
                    options={options}
                    isLoading={faultsPerDeviceHistogramIsLoading}
                />
            </Box>
        );
    },
);

// extra widget properties
const defaultFilters = [
    {
        name: FilterNames.eventType,
        type: FilterType.Select,
        data: {
            options: [
                'Filters.Fault',
                'Filters.Warning',
                'Filters.Componentexchange',
                'Filters.FirmwareUpdate',
                'Filters.Info',
                'Filters.Maintenance',
            ],
        } as SelectFilterData,
    },
    {
        name: FilterNames.faultCode,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.studType,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.deviceName,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
];
export const FaultsPerDeviceHistogramProperty = Object.assign(
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

export default FaultsPerDeviceHistogramWidget;

/**
 *
 * FaultsPerDeviceHistogramWidgetSpr
 *
 */

import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
    faultsPerDeviceHistogramSprActions,
    faultsPerDeviceHistogramSprKey,
    faultsPerDeviceHistogramSprReducer,
} from 'services/faults-per-device-histogram-spr/faults-per-device-histogram-spr-reducer';
import {
    selectFaultsPerDeviceHistogramSprIsLoading,
    selectFaultsPerDeviceHistogramSprs,
    selectFaultsPerDeviceHistogramSprCategories,
} from 'services/faults-per-device-histogram-spr/faults-per-device-histogram-spr-selectors';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Chart } from 'components/panels';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { FaultsPerDeviceHistogramSprs, FilterNames, Filters } from 'models';
import 'scss/main.scss';
import { getAllFaultsPerDeviceHistogramSprsSaga } from 'services/faults-per-device-histogram-spr/sagas/faults-per-device-histogram-spr-saga-get-all';
import { Widget, WidgetProps } from 'widgets';
import './FaultsPerDeviceHistogramWidgetSpr.scss';
import Histogram from 'highcharts/modules/histogram-bellcurve.js';
import Highcharts from 'highcharts/highstock';

import { messages } from './messages';
import { Box } from '@mui/material';

interface FaultsPerDeviceHistogramWidgetSprProps extends WidgetProps {
    localFilters: Filters;
}
Histogram(Highcharts);

export const FaultsPerDeviceHistogramSprWidget: Widget<FaultsPerDeviceHistogramWidgetSprProps> = memo(
    (props: FaultsPerDeviceHistogramWidgetSprProps) => {
        const { className = '', filters = {} } = props;
        useInjectReducer({ key: faultsPerDeviceHistogramSprKey, reducer: faultsPerDeviceHistogramSprReducer });

        useInjectSaga({ key: faultsPerDeviceHistogramSprKey, saga: getAllFaultsPerDeviceHistogramSprsSaga });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { t, i18n } = useTranslation();

        const faultsPerDeviceHistogramSprs: FaultsPerDeviceHistogramSprs | undefined = useSelector(
            selectFaultsPerDeviceHistogramSprs,
        );

        const category = useSelector(selectFaultsPerDeviceHistogramSprCategories);
        const faultsPerDeviceHistogramSprIsLoading: boolean = useSelector(selectFaultsPerDeviceHistogramSprIsLoading);
        const dispatch = useDispatch();

        const displayRows = useMemo(() => {
            return faultsPerDeviceHistogramSprs || []; // .filter((row) => !row.hidden);
        }, [faultsPerDeviceHistogramSprs]);

        if (props.isLoading) {
            props.isLoading(faultsPerDeviceHistogramSprIsLoading);
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
            dispatch(faultsPerDeviceHistogramSprActions.getAllFaultsPerDeviceHistogramSprs(serviceFilters));
        }, [dispatch, serviceFilters]);

        const options = {
            chart: {
                type: 'bar',
                zoomType: 'xy',
            },
            xAxis: {
                categories: category,
                min: 0,
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
                    showLastLabel: false,
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
                    isLoading={faultsPerDeviceHistogramSprIsLoading}
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
        name: FilterNames.deviceName,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
];
export const FaultsPerDeviceHistogramWidgetSprProperty = Object.assign(
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

export default FaultsPerDeviceHistogramSprWidget;

/**
 *
 * UploadChart
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { uploadStatActions, uploadStatReducer, uploadStatKey } from 'services/upload-stat/upload-stat-reducer';
import { selectUploadListItems, selectUploadListItemIsLoading } from 'services/upload-stat/upload-stat-selectors';
import { getAllUploadListItemsSaga } from 'services/upload-stat/sagas/upload-stat-saga-get-all';
import {
    Filters,
    UploadListItems,
    FilterNames,
    ReportingDataView,
    UploadListItem,
    ReportingIntervalViews,
} from 'models';
import { Chart } from 'components/panels';
import Highcharts from 'highcharts/highstock';
import { useQueryParam } from 'utils';
import { DashboardFilter } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import moment, { Moment } from 'moment';
import { messages } from './messages';

import 'scss/main.scss';
import './UploadChart.scss';

interface UploadChartProps extends WidgetProps {
    title?: string;
    subtitle?: string;
    groupingView?: ReportingDataView;
}

export const UploadChartWidget: Widget<UploadChartProps> = memo((props: UploadChartProps) => {
    useInjectReducer({ key: uploadStatKey, reducer: uploadStatReducer });
    useInjectSaga({ key: uploadStatKey, saga: getAllUploadListItemsSaga });

    const {
        className = '',
        filters = {},
        groupingView = ReportingDataView.Daily,
        title,
        subtitle = 'Source: ELU platform',
    } = props;
    const { t, i18n } = useTranslation();
    const [plantId] = useQueryParam<string>('plantId', '1', true);
    const [view] = useState<ReportingDataView>(groupingView);

    const uploadListItems: UploadListItems | undefined = useSelector(selectUploadListItems);
    const isLoading: boolean = useSelector(selectUploadListItemIsLoading);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(isLoading);
    }

    const [widgetFilter] = useState<Filters>({
        [FilterNames.plantId]: plantId,
        [FilterNames.selectedLanguage]: i18n.language,
        ...defaultFilters,
        // add your filters here
        ...filters,
    });

    const widgetFilters = useMemo(
        () => ({
            ...filters,
            ...widgetFilter,
        }),
        [widgetFilter, filters],
    );

    useEffect(() => {
        dispatch(uploadStatActions.getAllUploadListItems(widgetFilters));
    }, [dispatch, widgetFilters]);

    const [categories, fileSizes, fileCounts] = useMemo(() => {
        const acc = new Map<string, any>();
        const categoryArr: string[] = [];
        const fileSizeArr: number[] = [];
        const fileCountArr: number[] = [];

        let minTime: Moment = moment((uploadListItems || [])[0].dateTime);
        let maxTime: Moment = moment((uploadListItems || [])[0].dateTime);

        (uploadListItems || []).forEach(({ dateTime, size, count }: UploadListItem) => {
            const key: string = moment(dateTime).format(ReportingIntervalViews[view].groupBy);

            minTime = moment(dateTime).diff(minTime) < 0 ? moment(dateTime) : minTime;
            maxTime = moment(dateTime).diff(maxTime) > 0 ? moment(dateTime) : maxTime;

            if (!acc.has(key)) {
                acc.set(key, { size: 0, count: 0 });
            }

            const value = acc.get(key) || { size: 0, count: 0 };
            acc.set(key, { size: size + value.size, count: count + value.count });
        });

        // cycle through the times
        const currInterval = moment(minTime);
        while (!currInterval.isAfter(maxTime)) {
            const key: string = moment(currInterval).format(ReportingIntervalViews[view].groupBy);
            const category: string = moment(currInterval).format(ReportingIntervalViews[view].format);

            if (!acc.has(key)) {
                acc.set(key, { size: 0, count: 0 });
            }

            const value = acc.get(key) || { size: 0, count: 0 };
            categoryArr.push(category);
            fileSizeArr.push(value.size);
            fileCountArr.push(value.count);

            currInterval.add(
                1 as moment.DurationInputArg1,
                ReportingIntervalViews[view].duration as moment.DurationInputArg2,
            );
        }

        return [categoryArr, fileSizeArr, fileCountArr];
    }, [uploadListItems, view]);

    const options = {
        chart: {
            zoomType: 'xy',
        },
        title: {
            text: title,
            align: 'center',
        },
        subtitle: {
            text: subtitle,
            align: 'center',
        },
        xAxis: [
            {
                categories,
                crosshair: true,
            },
        ],
        yAxis: [
            {
                // Primary yAxis
                labels: {
                    // format: '{value}',
                    style: {
                        color: Highcharts?.getOptions().colors[2],
                    },
                },
                title: {
                    text: 'Size',
                    style: {
                        color: Highcharts?.getOptions().colors[2],
                    },
                },
                opposite: false,
            },
            {
                // Secondary yAxis
                gridLineWidth: 1,
                title: {
                    text: 'File Count',
                    style: {
                        color: Highcharts?.getOptions().colors[0],
                    },
                },
                labels: {
                    // format: '{value}',
                    style: {
                        color: Highcharts?.getOptions().colors[0],
                    },
                },
                opposite: true,
            },
            {
                // Tertiary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Sea-Level Pressure',
                    style: {
                        color: Highcharts?.getOptions().colors[1],
                    },
                },
                labels: {
                    // format: '{value} mb',
                    style: {
                        color: Highcharts?.getOptions().colors[1],
                    },
                },
                opposite: true,
                visible: false,
            },
        ],
        tooltip: {
            shared: true,
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)',
        },
        series: [
            {
                name: t(messages.numberOfFilesUploadedLabel),
                type: 'column',
                yAxis: 1,
                data: fileCounts,
            },
            {
                name: t(messages.uploadSizeLabel),
                type: 'spline',
                yAxis: 2,
                data: fileSizes,
                marker: {
                    enabled: true,
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
                            floating: false,
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                            x: 0,
                            y: 0,
                        },
                        yAxis: [
                            {
                                labels: {
                                    align: 'right',
                                    x: 0,
                                    y: -6,
                                },
                                showLastLabel: true,
                            },
                            {
                                labels: {
                                    align: 'left',
                                    x: 0,
                                    y: -6,
                                },
                                showLastLabel: true,
                            },
                        ],
                    },
                },
            ],
        },
    };

    return (
        <Chart
            tooltipFormat={`<b>{point.series.name}: {point.y}</b>`}
            className={` ${className} x-cls-cycle-count `}
            options={options}
            overrideOptions={options}
        />
    );
});

// extra widget properties
const defaultFilters: DashboardFilter[] = [];

export const UploadChartProperty = Object.assign(
    {},
    {
        defaultFilters,
        type: 'panel',
        layout: {
            w: 2,
            h: 1,
            minW: 1,
            minH: 1,
        },
    },
);

export default UploadChartWidget;

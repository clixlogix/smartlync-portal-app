/**
 *
 * Chart
 *
 */
import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import Loader from 'components/Loader';
import { Options, Chart as DefaultChartType, SeriesOptionsRegistry, SeriesOptionsType } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import Exporting from 'highcharts/modules/exporting';
import Pareto from 'highcharts/modules/pareto';
import XRange from 'highcharts/modules/xrange';
import * as NoData from 'highcharts/modules/no-data-to-display';
import { withSize } from 'react-sizeme';
import { useTranslation } from 'react-i18next';
import { Box, useTheme } from '@mui/material';
import { chartTheme, ThemeModes } from 'styles/theme/themes';
import * as _ from 'lodash';

import 'scss/main.scss';
import './Chart.scss';

export type ChartType = SeriesOptionsRegistry[keyof SeriesOptionsRegistry]['type'];
export type ChartRef = RefObject<{
    chart: Highcharts.Chart;
    container: RefObject<HTMLDivElement>;
}>;
interface ChartProps {
    chartType?: ChartType;
    chartTitle?: string;
    xChartTitle?: string;
    yChartTitle?: string;
    tooltipFormat?: string;
    className?: string;
    options?: any;
    overrideOptions?: any;
    highchartsMore?: boolean;

    data?: any[];
    size?: { width: number; height: number };
    onClick?(event);
    getRef?(newRef: ChartRef);
    isLoading?: boolean;
}

Exporting(Highcharts);
Pareto(Highcharts);
XRange(Highcharts);
//@ts-ignore
NoData(Highcharts);
export interface ExtendedChart extends DefaultChartType {
    restIsHidden?: boolean;
}

const Chart = (props: ChartProps) => {
    const { t } = useTranslation();
    if (props.highchartsMore) {
        HighchartsMore(Highcharts);
    }
    const theme = useTheme();
    const themeMode: 'light' | 'dark' = theme.palette.mode;
    const chartTextColor = theme.palette.text.primary;
    const chartColor = '#149B74';
    const {
        className = '',
        chartType = 'column',
        data = [],
        options = {},
        chartTitle,
        xChartTitle = props.yChartTitle || 'X - Axis',
        yChartTitle = props.xChartTitle || 'Y - Axis',
        tooltipFormat = `<b> {point.y} </b>`,
        size,
        onClick,
        overrideOptions,
        getRef,
        isLoading,
    } = props;

    const [isRefReceived, setIsRefReceived] = useState(false);

    const chartRef = useRef<{
        chart: Highcharts.Chart;
        container: RefObject<HTMLDivElement>;
    }>(null);

    useEffect(() => {
        if (chartRef?.current && getRef && !isLoading && !isRefReceived) {
            getRef?.(chartRef);
            setIsRefReceived(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    const theOptions: Highcharts.Options = useMemo(() => {
        const chart: any = {
            type: chartType,
            backgroundColor: themeMode === ThemeModes.dark ? chartTheme.backgroundDark : chartTheme.backgroundLight,
            events: {
                click: onClick,
            },
            zoomType: chartType === 'line' || chartType === 'scatter' ? 'xy' : null,
        };

        if (size && size?.width > 0) {
            chart.width = size?.width;
            if (!!overrideOptions) {
                overrideOptions.chart.width = size?.width;
            }
        }

        if (size && size?.height > 0) {
            chart.height = size?.height;
            if (!!overrideOptions) {
                overrideOptions.chart.height = size?.height;
            }
        }

        const opts: Options = {
            chart,
            credits: {
                enabled: false,
            },
            lang: {
                noData: t('General.NoData') || 'No Data To Display',
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: chartTextColor,
                },
            },
            title: {
                text: chartTitle,
                align: 'left',
                x: 25,
                y: 25,
                margin: 35,
                style: {
                    color: chartTextColor,
                    fontsize: '20px',
                    fontWeight: '500',
                    fontFamily: 'Roboto',
                    textTransform: 'capitalize',
                },
            },
            legend: {
                enabled: true,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                itemStyle: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'Open Sans',
                    color: chartTextColor,
                },
                itemHoverStyle: {
                    color: chartTextColor,
                },
            },
            plotOptions: {
                column: {
                    pointPlacement: 0,
                },
                series: {
                    //@ts-ignore
                    pointWidth: 45,
                    dataLabels: {
                        style: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            fontFamily: 'Open Sans',
                            color: chartTextColor,
                        },
                    },
                    events: {
                        legendItemClick: function () {
                            let series = this.chart.series;
                            let chart: ExtendedChart = this.chart;
                            const show = this.visible && chart.restIsHidden;

                            series.forEach(function (item) {
                                if (!item.visible || !chart.restIsHidden) {
                                    item.setVisible(show, false);
                                }
                            });
                            this.show();
                            chart.restIsHidden = !show;
                            this.chart = chart;
                            return false;
                        },
                    },
                    bar: {
                        dataLabels: {
                            enabled: true,
                        },
                    },
                    showInLegend: true,
                },
            },
            xAxis: {
                type: 'category',
                // reversed: false,
                title: {
                    text: xChartTitle,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: 'Open Sans',
                        color: chartTextColor,
                    },
                },
                labels: {
                    step: 1,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: chartTextColor,
                    },
                },
                scrollbar: {
                    enabled: true,
                },
            },
            yAxis: {
                gridLineColor: 'transparent',
                title: {
                    text: yChartTitle,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: 'Open Sans',
                        color: chartTextColor,
                    },
                },
                labels: {
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: chartTextColor,
                    },
                },
                lineWidth: 1,
            },
            tooltip: {
                pointFormat: tooltipFormat,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Open Sans',
                    color: chartTextColor,
                },
                backgroundColor: theme.palette.background.default,
            },
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG'],
                    },
                },
            },
            series: [
                {
                    type: chartType,
                    color: chartColor,
                    borderColor: chartColor,
                    data,
                    dataLabels: {
                        enabled: false,
                        color: chartTheme.dark,
                        borderColor: chartTheme.dark,
                        align: 'center',
                        format: '{point.y}',
                        style: {
                            fontSize: '14px',
                            fontFamily: 'Open Sans',
                        },
                    },
                } as SeriesOptionsType,
            ],
        };
        return overrideOptions || _.merge(opts, options);
    }, [
        chartType,
        themeMode,
        onClick,
        size,
        t,
        chartTextColor,
        chartTitle,
        xChartTitle,
        yChartTitle,
        tooltipFormat,
        theme.palette.background.default,
        data,
        overrideOptions,
        options,
    ]);

    return (
        <Box
            className={`${className} x-cls-chart`}
            sx={{
                boxShadow:
                    '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
            }}
        >
            {isLoading ? (
                <Loader circle />
            ) : (
                <HighchartsReact ref={chartRef} highcharts={Highcharts} options={theOptions} immutable={true} />
            )}
        </Box>
    );
};

export default withSize({ monitorHeight: true })(Chart);

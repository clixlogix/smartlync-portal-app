/**
 *
 * DReportWidget
 *
 */
import React, { useMemo, useState, memo } from 'react';
import { SizeMe } from 'react-sizeme';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { Filters } from 'models';
import Table from 'components/Table';
import {
    DashboardFilter,
    DateFilterData,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { Chart } from 'components/panels';
import { ChartRef } from 'components/panels/Chart/Chart';
import { chartTheme, ThemeModes } from 'styles/theme/themes';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import findIndex from 'lodash/findIndex';
import { messages } from './messages';


import 'scss/main.scss';
import './DReportWidget.scss';

interface DReportWidgetProps extends WidgetProps {
    series: any;
    view: string;
    categories?: string[];
    title: string;
}

export const DReportWidgetWidget: Widget<DReportWidgetProps> = memo((props: DReportWidgetProps) => {
    const { series, view, categories, title } = props;
    let seriesArray = [...series];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t } = useTranslation();
    const labelSeries = ['Cycles', 'Target', '17068', '20002', '20028'];
    labelSeries.forEach((item) => {
        const index = findIndex(seriesArray, { name: item });
        switch (item) {
            case 'Cycles':
                seriesArray.splice(index, 1, { ...seriesArray[index], name: t(messages.primaryAxisTitle) });
                break;
            case 'Target':
                seriesArray.splice(index, 1, { ...seriesArray[index], name: t(messages.target) });
                break;
            case '17068':
                seriesArray.splice(index, 1, { ...seriesArray[index], name: t(messages.event_17068) });
                break;
            case '20002':
                seriesArray.splice(index, 1, { ...seriesArray[index], name: t(messages.event_20002) });
                break;
            case '20028':
                seriesArray.splice(index, 1, { ...seriesArray[index], name: t(messages.event_20028) });
                break;
            default:
                break;
        }
    });


    const DReportWidgetOptions = {
        title: {
            text: `${title} ${t(messages.chartTitle)}`,
            style: {
                fontsize: '20px',
                fontWeight: '500',
                fontFamily: 'Roboto',
                textTransform: 'capitalize',
            },
        },
        credits: {
            enabled: false,
        },
        xAxis: {
            type: 'category',
            categories: view === 'weekly' ? categories : undefined,
            labels: {
                autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
                style: {
                    fontSize: '13px',
                    fontFamily: 'Open Sans',
                    // color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                },
            },
        },
        yAxis: [
            {
                gridLineColor: 'transparent',
                lineWidth: 1,
                title: {
                    text: t(messages.primaryAxisTitle),
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: 'Open Sans',
                        // color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    },
                },
                labels: {
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        // color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    },
                },
            },
            {
                gridLineColor: 'transparent',
                lineWidth: 1,
                opposite: true,
                title: {
                    text: t(messages.secondaryAxisTitle),
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: 'Open Sans',
                        // color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    },
                },
                labels: {
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        // color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    },
                },
            },
        ],
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            maxHeight: 55,
        },
        plotOptions: {
            column: {
                pointPlacement: 0,
                grouping: false,
                shadow: false,
                getExtremesFromAll: true,
            },
            series: {
                pointWidth: 10,
            },
        },
        series: seriesArray,
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
                            verticalAlign: 'top',
                        },
                    },
                },
            ],
        },
    };

    return (
        <HighchartsReact highcharts={Highcharts} options={DReportWidgetOptions} immutable={true} />
    );
});

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
*/
];
export const DReportWidgetProperty = Object.assign(
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

export default DReportWidgetWidget;

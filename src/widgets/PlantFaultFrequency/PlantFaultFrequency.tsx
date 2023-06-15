/**
 *
 * PlantFaultFrequency
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    faultFrequencyActions,
    faultFrequencyReducer,
    faultFrequencyKey,
} from 'services/fault-frequency/fault-frequency-reducer';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

import {
    selectFaultFrequencys,
    selectFaultFrequencyIsLoading,
} from 'services/fault-frequency/fault-frequency-selectors';
import { getAllFaultFrequencysSaga } from 'services/fault-frequency/sagas';
import { FilterNames, Filters, ReportingDataView } from 'models';
import { WidgetProps, Widget } from 'widgets';
import { Chart } from 'components/panels';
import { messages } from './messages';
import { useTheme } from '@mui/material';
import { chartTheme, ThemeModes } from 'styles/theme/themes';
import { Box } from '@mui/material';
import 'scss/main.scss';
// import './PlantFaultFrequency.scss';

interface PlantFaultFrequencyProps extends WidgetProps {}

const defaultFaultFrequencyFilters = {
    [FilterNames.view]: ReportingDataView.Weekly,
    [FilterNames.plantId]: '1',
};
const chartColor = '#149B74';
// const themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light = '#FFFFFF';

export const PlantFaultFrequencyWidget: Widget<PlantFaultFrequencyProps> = memo((props: PlantFaultFrequencyProps) => {
    useInjectReducer({ key: faultFrequencyKey, reducer: faultFrequencyReducer });
    useInjectSaga({ key: faultFrequencyKey, saga: getAllFaultFrequencysSaga });

    const { className = '', filters = {} } = props;
    const { t, i18n } = useTranslation();

    const totalCyclesData = useSelector(selectFaultFrequencys);
    const isLoading: boolean = useSelector(selectFaultFrequencyIsLoading);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(isLoading);
    }

    const [widgetFilters] = useState<Filters>({
        langCode: [i18n.language],
        ...defaultFaultFrequencyFilters,
        // add your filters here
        ...filters,
    });
    const theme = useTheme();
    const themePalette = theme.palette;
    const themeMode: 'light' | 'dark' = themePalette.mode;
    const serviceFilters = useMemo(() => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }), [
        widgetFilters,
        filters,
        i18n.language,
    ]);

    useEffect(() => {
        dispatch(faultFrequencyActions.getAllFaultFrequencys(serviceFilters));
    }, [dispatch, serviceFilters]);

    const faultFrequencyOptions = useMemo(() => {
        const options = {
            chart: {
                height: 355,
                backgroundColor: themeMode === ThemeModes.dark ? chartTheme.backgroundDark : chartTheme.backgroundLight,
            },
            credits: {
                enabled: false,
            },
            title: {
                text: `${t(messages.faultFrequencyChartTitle)}`,
                align: 'left',
                x: 25,
                y: 20,
                margin: 25,
                style: {
                    color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    fontsize: '20px',
                    fontWeight: '500',
                    fontFamily: 'Roboto',
                    textTransform: 'capitalize',
                },
            },
            plotOptions: {
                column: {
                    pointPlacement: 0,
                    grouping: false,
                    shadow: false,
                    getExtremesFromAll: true,
                },
            },
            xAxis: {
                reversed: false,
                categories: totalCyclesData.categories,
                title: {
                    text: `${t(messages.xAxisFaultFrequencyTitle)}`,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: 'Open Sans',
                        color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    },
                },
                labels: {
                    autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    },
                },
            },
            yAxis: [
                {
                    gridLineColor: 'transparent',
                    title: {
                        text: `${t(messages.yAxisFaultFrequencyTitle)}`,
                        style: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            fontFamily: 'Open Sans',
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                        },
                    },
                    labels: {
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Open Sans',
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                        },
                    },
                    lineWidth: 1,
                },
                {
                    gridLineColor: 'transparent',
                    opposite: true,
                    min: 0,
                    max: 100,
                    title: {
                        text: '',
                        style: {
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                            fontFamily: 'Open Sans',
                        },
                    },
                    labels: {
                        format: '{value}%',
                        style: {
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                            fontFamily: 'Open Sans',
                        },
                    },
                    lineWidth: 1,
                },
            ],
            legend: {
                enabled: false,
            },
            tooltip: {
                headerFormat: `<b>${t(messages.xAxisFaultFrequencyTitle)}: {point.x}</b><br/><br/>`,
                shared: true,
                style: {
                    color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    fontFamily: 'Open Sans',
                },
                backgroundColor: themePalette.background.default,
            },
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG'],
                    },
                },
            },
            navigation: {
                menuItemStyle: {
                    fontFamily: 'Open Sans',
                    fontSize: '16px',
                },
            },
            series: [
                {
                    type: 'pareto',
                    name: 'Pareto',
                    color: 'red',
                    style: {
                        color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                        fontFamily: 'Open Sans',
                    },
                    zIndex: 2,
                    baseSeries: 1,
                    tooltip: {
                        valueDecimals: 2,
                        valueSuffix: '%',
                    },
                    yAxis: 1,
                },
                {
                    type: 'column',
                    name: 'Fault Count',
                    color: chartColor,
                    // borderColor: chartColor,
                    style: {
                        color: chartColor,
                        fontFamily: 'Open Sans',
                    },
                    data: totalCyclesData.data,
                    dataLabels: {
                        enabled: true,
                        color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                        borderColor: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                        align: 'center',
                        format: '{point.y}',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Open Sans',
                        },
                    },
                },
            ],
        };
        return options;
    }, [t, themeMode, totalCyclesData.categories, totalCyclesData.data]);

    return (
        <Box sx={{ height: '355px', minWidth: '645px' }}>
            <HighchartsReact highcharts={Highcharts} options={faultFrequencyOptions} immutable={true} />
        </Box>
    );
});

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
    */
];
export const PlantFaultFrequencyProperty = Object.assign(
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

export default PlantFaultFrequencyWidget;

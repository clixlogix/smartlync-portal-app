/**
 *
 * CarBodyDurationWidget
 *
 */
import React, { useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    carBodyDurationWidgetActions,
    carBodyDurationWidgetReducer,
    carBodyDurationWidgetKey,
} from 'services/car-body-duration-widget/car-body-duration-widget-reducer';
import {
    selectCarBodyDurationWidgetIsLoading,
    selectCarBodyCategories,
    selectDurationGraphData,
    selectDurationSecondaryGraphData,
} from 'services/car-body-duration-widget/car-body-duration-widget-selectors';
import { getAllCarBodyDurationWidgetsSaga } from 'services/car-body-duration-widget/sagas/car-body-duration-widget-saga-get-all';
import { Filters } from 'models';
import { selectStations } from 'services/station/station-selectors';
import { WidgetProps, Widget } from 'widgets';
import { Chart } from 'components/panels';
import { useTheme } from '@mui/material';
import { chartTheme, ThemeModes } from 'styles/theme/themes';
// import { messages } from './messages';

import 'scss/main.scss';
import './CarBodyDurationWidget.scss';
import moment from 'moment';

interface CarBodyDurationWidgetProps extends WidgetProps {}

export const CarBodyDurationWidgetWidget: Widget<CarBodyDurationWidgetProps> = memo(
    (props: CarBodyDurationWidgetProps) => {
        const { filters = {} } = props;
        useInjectReducer({ key: carBodyDurationWidgetKey, reducer: carBodyDurationWidgetReducer });

        useInjectSaga({ key: carBodyDurationWidgetKey, saga: getAllCarBodyDurationWidgetsSaga });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { t } = useTranslation();

        const eventTypes = ['Info', 'Storung', 'Warnung'];

        const carBodyDurationWidgetIsLoading: boolean = useSelector(selectCarBodyDurationWidgetIsLoading);
        const carBodyDurationCategories: string[] = useSelector(selectCarBodyCategories);
        const carBodyDurationGraph: any[] = useSelector(selectDurationGraphData);
        const carBodyDuratioSecondaryGraph: any[] = useSelector(selectDurationSecondaryGraphData);
        const stationOptions = useSelector(selectStations);

        const dispatch = useDispatch();

        if (props.isLoading) {
            props.isLoading(carBodyDurationWidgetIsLoading);
        }

        const themeMode: 'light' | 'dark' = useTheme().palette.mode;

        const [widgetFilters] = useState<Filters>({
            // ...defaultFilters,
            // add your filters here
            ...filters,
        });

        useEffect(() => {
            const finalFilters = {
                ...widgetFilters,
                ...filters,
                station: filters.stationName || stationOptions[0] || 'Line1Station1',
            };
            dispatch(carBodyDurationWidgetActions.getAllCarBodyDurationWidgets(finalFilters));
        }, [dispatch, filters, filters.stationName, stationOptions, widgetFilters]);

        const options = {
            legend: {
                enabled: false,
            },
            xAxis: {
                type: 'datetime',
                min: moment(filters.fromTime).valueOf(),
                max: moment(filters.toTime).valueOf(),
                scrollbar: {
                    enabled: true,
                },
            },
            yAxis: [
                {
                    height: '75%',
                    gridLineColor: '#424242',
                    gridLineDashStyle: 'longdash',
                    title: {
                        text: '',
                    },
                    labels: {
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Open Sans',
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                        },
                    },
                    tickmarkPlacement: 'on',
                    categories: carBodyDurationCategories,
                    reversed: true,
                    min: 0,
                    max: carBodyDurationCategories.length > 25 ? 25 : undefined,
                    scrollbar: {
                        enabled: true,
                    },
                },
                {
                    top: '80%',
                    height: '20%',
                    gridLineColor: '#424242',
                    title: {
                        text: '',
                    },
                    labels: {
                        x: 55,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Open Sans',
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                        },
                    },
                    tickmarkPlacement: 'between',
                    tickColor: 'transparent',
                    categories: eventTypes,
                    min: 0,
                    max: 2,
                    reversed: true,
                },
            ],
            series: [
                {
                    name: '',
                    yAxis: 0,
                    type: 'xrange',
                    pointWidth: 10,
                    borderColor: 'gray',
                    data: [...carBodyDurationGraph],
                    dataLabels: {
                        enabled: false,
                    },
                    tooltip: {
                        useHTML: true,
                        xDateFormat: '(%b %d,%Y , %k:%M:%S)',
                        pointFormat: `<b>{point.carbodyID}</b><br/><b>{point.cycleDuration} mins</b>`,
                    },
                },
                {
                    name: '',
                    yAxis: 1,
                    type: 'scatter',
                    data: [...carBodyDuratioSecondaryGraph],
                    dataLabels: {
                        enabled: false,
                    },
                    tooltip: {
                        useHTML: true,
                        headerFormat: '',
                        pointFormat: `<b>Type: {point.eventType}</b><br/><b>Date-Time: {point.occurredOn}</b><br/><b>FaultCode: {point.faultCode}</b><br/><b>Description: {point.description}</b><br/>`,
                    },
                },
            ],
        };

        return (
            <Chart
                chartType={'xrange'}
                chartTitle={`${filters.stationName || 'Line1Station1'}, ${moment(filters.toTime).format(
                    'MM/DD/YYYY',
                )} CarbodyID Duration (Color Coded by CarbodyID)`}
                xChartTitle={''}
                // yChartTitle={t(messages.yAxisTitle)}
                // tooltipFormat={`<b>${t(messages.liftTitle)} : {point.y}</b>`}
                className={``}
                options={options}
            />
        );
    },
);

// extra widget properties
// const defaultFilters = [
//     {
//         name: FilterNames.dateRange,
//         type: FilterType.Date,
//         data: {
//             fromTime: moment('2021-06-28').startOf('day'),
//             toTime: moment('2021-06-28').endOf('day'),
//             startDatePlaceholder: 'll',
//             endDatePlaceholder: 'll',
//         } as DateFilterData,
//     },
// ];
export const CarBodyDurationWidgetProperty = Object.assign(
    {},
    {
        // defaultFilters: defaultFilters,
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

export default CarBodyDurationWidgetWidget;

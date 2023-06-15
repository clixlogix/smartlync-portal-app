/**
 *
 * MeasurementsSprWidget
 *
 */
import { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import has from 'lodash/has';
import { useTheme } from '@mui/material/styles';

import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    measurementsSprWidgetActions,
    measurementsSprWidgetReducer,
    measurementsSprWidgetKey,
} from 'services/measurements-spr-widget/measurements-spr-widget-reducer';
import {
    selectMeasurementsSprWidgetIsLoading,
    selectMeasurementsSprWidgetsFilteredByRules,
} from 'services/measurements-spr-widget/measurements-spr-widget-selectors';
import { getAllMeasurementsSprWidgetsSaga } from 'services/measurements-spr-widget/sagas/measurements-spr-widget-saga-get-all';
import { Filters, DeviceNames, FilterNames, Stations } from 'models';
import { DashboardFilter, FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { selectDeviceNames } from 'services/device/device-name/device-name-selectors';
import { WidgetProps, Widget } from 'widgets';
import { Options } from 'highcharts';
import { Chart } from 'components/panels';
import { messages } from './messages';
import { selectStations } from 'services/station/station-selectors';

import './MeasurementsSprWidget.scss';

interface MeasurementsSprWidgetProps extends WidgetProps {}

export const MeasurementsSprWidgetWidget: Widget<MeasurementsSprWidgetProps> = memo(
    (props: MeasurementsSprWidgetProps) => {
        const { filters = {}, onFilterChange = () => {} } = props;
        useInjectReducer({ key: measurementsSprWidgetKey, reducer: measurementsSprWidgetReducer });
        useInjectSaga({ key: measurementsSprWidgetKey, saga: getAllMeasurementsSprWidgetsSaga });

        const { t, i18n } = useTranslation();

        const formattedMeasurements: any | undefined = useSelector(selectMeasurementsSprWidgetsFilteredByRules);
        const measurementsSprWidgetIsLoading: boolean = useSelector(selectMeasurementsSprWidgetIsLoading);
        const deviceNames: DeviceNames = useSelector(selectDeviceNames);
        const stations: Stations = useSelector(selectStations);

        const dispatch = useDispatch();

        if (props.isLoading) {
            props.isLoading(measurementsSprWidgetIsLoading);
        }
        const GROUP_BY_DEFAULT = 'deviceName,outletNo';

        const [widgetFilters] = useState<Filters>({
            ...filters,
            [FilterNames.groupBy]: GROUP_BY_DEFAULT,
        });

        const serviceFilters = useMemo(
            () => ({
                [FilterNames.station]: stations[0],
                [FilterNames.deviceName]: deviceNames[0],
                [FilterNames.langCode]: i18n.language,
                ...widgetFilters,
                ...filters,
            }),
            [i18n.language, widgetFilters, filters, stations, deviceNames],
        );

        useEffect(
            () => {
                onFilterChange({
                    ...serviceFilters,
                    [FilterNames.groupBy]: serviceFilters.groupBy || GROUP_BY_DEFAULT,
                    [FilterNames.deviceName]: deviceNames[0],
                    [FilterNames.station]: stations[0],
                });
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [deviceNames, stations, serviceFilters.groupBy],
        );

        useEffect(() => {
            const filter = omitBy(
                {
                    [FilterNames.plantId]: serviceFilters.plantId,
                    [FilterNames.deviceName]: serviceFilters.deviceName,
                    [FilterNames.langCode]: serviceFilters.selectedLanguage,
                    [FilterNames.fromTime]: serviceFilters.fromTime,
                    [FilterNames.toTime]: serviceFilters.toTime,
                    [FilterNames.systemType]: serviceFilters.systemType,
                    [FilterNames.station]: serviceFilters.station,
                    [FilterNames.groupBy]: serviceFilters.groupBy,
                    [FilterNames.carTypeId]: serviceFilters.carbodyId,
                    aggregateNeeded: false,
                },
                isNil,
            );
            if (!filter[FilterNames.groupBy]) {
                filter[FilterNames.groupBy] = GROUP_BY_DEFAULT;
            }
            has(filter, [FilterNames.deviceName]) &&
                has(filter, [FilterNames.station]) &&
                dispatch(measurementsSprWidgetActions.getAllMeasurementsSprWidgets(filter));
        }, [
            dispatch,
            serviceFilters.plantId,
            serviceFilters.deviceName,
            serviceFilters.fromTime,
            serviceFilters.selectedLanguage,
            serviceFilters.station,
            serviceFilters.systemType,
            serviceFilters.toTime,
            serviceFilters.groupBy,
            serviceFilters.carbodyId,
        ]);

        useEffect(() => {
            const filter = omitBy(
                {
                    [FilterNames.outletNo]: serviceFilters.outletNo,
                },
                isNil,
            );

            dispatch(measurementsSprWidgetActions.localFiltering(filter));
        }, [dispatch, serviceFilters.outletNo]);

        const theme = useTheme();
        const textColor = theme.palette.text.primary;

        const options: Options = {
            chart: {
                type: 'scatter',
                zoomType: 'xy',
            },
            title: {
                text: t(messages.measurementGraphTitle, {
                    stationName: serviceFilters[FilterNames.stationName] || serviceFilters.station || t(messages.none),
                }),
            },
            xAxis: {
                tickInterval: 2 * 3600 * 1000, // the number of milliseconds in a day

                type: 'datetime',
                scrollbar: {
                    enabled: true,
                },
                min: moment(filters.fromTime).valueOf(),
                max: moment(filters.toTime).valueOf(),
            },
            legend: {
                enabled: formattedMeasurements.length > 0 ? true : false,
                align: 'left',
            },
            tooltip: {
                useHTML: true,
                headerFormat: '<table><tr><th colspan="2">{series.name}</th></tr>',
                pointFormat:
                    '<tr><td style="color: {series.color}">Weld Energy : </td>' +
                    '<td style="text-align: left"><b>{point.energy}</b></td></tr>' +
                    '<tr><td style="color: {series.color}">Time : </td>' +
                    '<td style="text-align: left"><b>{point.time}</b></td></tr>' +
                    '<tr><td style="color: {series.color}">OutletNo : </td>' +
                    '<td style="text-align: left"><b>{point.outletNo}</b></td></tr>',
                footerFormat: '</table>',
            },
            yAxis: [
                {
                    height: '90%',
                    gridLineColor: '#424242',
                    title: {
                        text: t(messages.unitslabel),
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Open Sans',
                            color: textColor,
                        },
                    },
                    labels: {
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Open Sans',
                            color: textColor,
                        },
                    },
                    tickmarkPlacement: 'on',
                    minorTickInterval: 0.1,
                    plotLines: [
                        {
                            value: 45,
                            width: 1,
                            color: '#999',
                        },
                    ],
                },
            ],
            series: formattedMeasurements,
            plotOptions: {
                series: {
                    cursor: 'pointer',
                },
                scatter: {
                    turboThreshold: 100000,
                },
            },
        };

        return (
            <div className={`x-cls-measurements-spr-widget`}>
                <Chart
                    chartType={'scatter'}
                    xChartTitle=""
                    yChartTitle=""
                    className={`x-cls-cycle-gap-widget`}
                    options={options}
                    isLoading={measurementsSprWidgetIsLoading}
                />
            </div>
        );
    },
);

// extra widget properties
const defaultFilters: DashboardFilter[] = [
    {
        name: FilterNames.station,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.deviceName,
        type: FilterType.Select,
        multiple: false,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.outletNo,
        label: 'Filters.OutletLabel',
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
];
export const MeasurementsSprWidgetProperty = Object.assign(
    {},
    {
        defaultFilters,
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

export default MeasurementsSprWidgetWidget;

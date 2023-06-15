/**
 *
 * MeasurementsWidget
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    measurementsWidgetActions,
    measurementsWidgetReducer,
    measurementsWidgetKey,
} from 'services/measurements-widget/measurements-widget-reducer';
import {
    selectMeasurementsWidgets,
    selectMeasurementsWidgetIsLoading,
} from 'services/measurements-widget/measurements-widget-selectors';
import { selectDeviceNames } from 'services/device/device-name/device-name-selectors';

import { getAllMeasurementsWidgetsSaga } from 'services/measurements-widget/sagas/measurements-widget-saga-get-all';

import { Filters /*, MeasurementsWidgets*/, DeviceNames, FilterNames } from 'models';
import {
    DashboardFilter,
    // DateFilterData,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import * as _ from 'lodash';
import { Chart } from 'components/panels';
import { Options } from 'highcharts';
import moment from 'moment';
import { messages } from './messages';

import './MeasurementsWidget.scss';

interface MeasurementsWidgetProps extends WidgetProps {}

export const MeasurementsWidgetWidget: Widget<MeasurementsWidgetProps> = memo((props: MeasurementsWidgetProps) => {
    const { className = '', filters = {}, onFilterChange = () => {} } = props;
    useInjectReducer({ key: measurementsWidgetKey, reducer: measurementsWidgetReducer });

    useInjectSaga({ key: measurementsWidgetKey, saga: getAllMeasurementsWidgetsSaga });

    const { t, i18n } = useTranslation();

    const formattedMeasurements: any = useSelector(selectMeasurementsWidgets);

    const measurementsIsLoading: boolean = useSelector(selectMeasurementsWidgetIsLoading);

    const deviceNames: DeviceNames = useSelector(selectDeviceNames);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isEmptyData, setEmptyData] = useState<boolean>(false);

    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(measurementsIsLoading);
    }

    // const [wipOrWop, setWipOrWop] = useState(null);

    const [widgetFilters /*, setWidgetFilters*/] = useState<Filters>({
        // add your filters here
        ...filters,
        [FilterNames.groupBy]: 'deviceName,outletNo,feederNo,studId',
        station: filters.stationName && filters.stationName !== '' ? filters.stationName : 'Z8.3_020',
    });

    const serviceFilters = useMemo(
        () => ({
            [FilterNames.langCode]: i18n.language,
            ...widgetFilters,
            ...filters,
            station: filters.stationName && filters.stationName !== '' ? filters.stationName : 'Z8.3_020',
        }),
        [i18n.language, widgetFilters, filters],
    );

    useEffect(
        () => {
            onFilterChange({
                ...serviceFilters,
                [FilterNames.deviceName]: deviceNames[0],
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deviceNames],
    );

    useEffect(
        () => {
            if (_.isEmpty(formattedMeasurements)) {
                setEmptyData(true);
            } else {
                setEmptyData(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [formattedMeasurements],
    );

    const convertedData: any = [];

    //TODO: Need to replace this with actual data from API
    const extraSeries: any = {
        name: '',
        yAxis: 1,
        type: 'scatter',
        data: [
            {
                x: moment('2021-05-10T06:58:51').valueOf(),
                color: 'rgb(92,200,154)',
                y: 0,
            },
            {
                x: moment('2021-05-10T21:17:13').valueOf(),
                color: 'rgb(221,96,70)',
                y: 1,
            },
            {
                x: moment('2021-05-10T12:58:42').valueOf(),
                color: 'rgb(221,96,70)',
                y: 1,
            },
        ],
        dataLabels: {
            enabled: false,
        },
    };

    convertedData.push(extraSeries);

    useEffect(() => {
        const filter = _.omitBy(
            {
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
            _.isNil,
        );
        dispatch(measurementsWidgetActions.getAllMeasurementsWidgets(filter));
    }, [
        dispatch,
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
        const filter = _.omitBy(
            {
                [FilterNames.studId]: serviceFilters.studId,
                [FilterNames.outletNo]: serviceFilters.outletNo,
                [FilterNames.feederNo]: serviceFilters.feederNo,
                // wip: wipOrWop,
            },
            _.isNil,
        );

        dispatch(measurementsWidgetActions.localFiltering(filter));
    }, [dispatch, serviceFilters.studId, serviceFilters.outletNo, serviceFilters.feederNo /*, wipOrWop*/]);

    const options: Options = {
        chart: {
            type: 'scatter',
            zoomType: 'xy',
        },
        title: {
            text: t(messages.cycleGapGraphTitle, {
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
                '<tr><td style="color: {series.color}">FeederNo : </td>' +
                '<td style="text-align: left"><b>{point.feederNo}</b></td></tr>' +
                '<tr><td style="color: {series.color}">OutletNo : </td>' +
                '<td style="text-align: left"><b>{point.outletNo}</b></td></tr>' +
                // '<tr><td style="color: {series.color}">WIP : </td>' +
                // '<td style="text-align: left"><b>{point.wip}</b></td></tr>' +
                '<tr><td style="color: {series.color}">StudId : </td>' +
                '<td style="text-align: left"><b>{point.studId}</b></td></tr>',
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
                        color: 'white',
                    },
                },
                labels: {
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: 'white',
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
        <div className={` ${className} x-cls-measurement-widget`}>
            <Chart
                chartType={'scatter'}
                xChartTitle=""
                yChartTitle=""
                className={` ${className} x-cls-cycle-gap-widget`}
                options={options}
                isLoading={measurementsIsLoading}
            />
        </div>
    );
});

// extra widget properties
const defaultFilters: DashboardFilter[] = [
    {
        name: FilterNames.stationName,
        type: FilterType.Select,
        defaultValue: 'Z8.3_020',
        data: { options: ['Z8.3_020', 'Z8.3_070'] } as SelectFilterData,
    },
    {
        name: FilterNames.deviceName,
        type: FilterType.Select,
        multiple: false,
        data: { options: [] } as SelectFilterData,
    },
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
];
export const MeasurementsWidgetProperty = Object.assign(
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

export default MeasurementsWidgetWidget;

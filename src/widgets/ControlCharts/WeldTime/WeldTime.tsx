/**
 *
 * WeldTime
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { weldTimeActions, weldTimeReducer, weldTimeKey } from 'services/weld-time/weld-time-reducer';
import { selectWeldTimes, selectWeldTimeIsLoading } from 'services/weld-time/weld-time-selectors';
import { Chart } from 'components/panels';
import { getAllWeldTimesSaga } from 'services/weld-time/sagas/weld-time-saga-get-all';
import { FilterNames, Filters, WeldTimes } from 'models';
import { DashboardFilter, FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { ChartRef } from 'components/panels/Chart/Chart';
import { synchronousChart } from 'utils/synchronousChart';
import { filterControlChartByLocalFilters } from 'utils/filterByLocalFilters';
import { ChartWidgetProps, Widget } from 'widgets';
import { messages } from './messages';
interface WeldTimeProps extends ChartWidgetProps {
    getRef?(ref: ChartRef);
    refs?: ChartRef[];
    localFilters: Filters;
}

export const WeldTime: Widget<WeldTimeProps> = memo((props: WeldTimeProps) => {
    const { className = '', filters = {}, localFilters = {}, setAvailableFilters, onClick, getRef, refs } = props;

    useInjectReducer({ key: weldTimeKey, reducer: weldTimeReducer });
    useInjectSaga({ key: weldTimeKey, saga: getAllWeldTimesSaga });

    const { t, i18n } = useTranslation();
    const weldTimes: WeldTimes | undefined = useSelector(selectWeldTimes);
    const weldTimeIsLoading: boolean = useSelector(selectWeldTimeIsLoading);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(weldTimeIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        // ...defaultFilters,
        // add your filters here
        // fromTime: moment().subtract(9, 'isoWeek').startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss'),
        // toTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        // selectedLanguage: 'en',
        // plantId: 1,
        ...filters,
    });

    const serviceFilters = useMemo(() => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }), [
        widgetFilters,
        filters,
        i18n.language,
    ]);

    useEffect(() => {
        dispatch(weldTimeActions.getAllWeldTimes(serviceFilters));
    }, [dispatch, serviceFilters]);

    const dataAfterLocalFilter = filterControlChartByLocalFilters(weldTimes, localFilters);

    const maximum = dataAfterLocalFilter?.maximum;
    const actual = dataAfterLocalFilter?.actual;
    const minimum = dataAfterLocalFilter?.minimum;

    const series: any = useMemo(() => {
        const data: any[] = [
            {
                boostThreshold: 1000,
                data: maximum,
                name: t(messages.maximum),
                dashStyle: 'ShortDash',
                color: 'rgb(235, 70, 45)',
            },
            {
                boostThreshold: 1000,
                data: actual,
                name: t(messages.actual),
                dashStyle: 'ShortDash',
                color: 'rgb(104, 205, 209)',
            },
            {
                boostThreshold: 1000,
                data: minimum,
                name: t(messages.minimum),
                dashStyle: 'ShortDash',
                color: 'rgb(235, 70, 45)',
            },
        ];
        return data;
    }, [actual, maximum, minimum, t]);

    // get filter values;
    // defaultFilters
    useEffect(() => {
        if (setAvailableFilters) {
            setAvailableFilters(
                defaultFilters.map((filter: DashboardFilter) => {
                    const data: any = {};

                    switch (filter.name) {
                        case 'faultCode':
                            // data.options = Array.from(filterValues.faultCodes);
                            break;
                        case 'deviceName': // add your de=fault option values for your select in the filter panel
                            data.options = ['1', '2', '3', '4'];
                            break;
                    }

                    return { ...filter, data };
                }),
            );
        }
    }, [widgetFilters, setAvailableFilters]);
    const pointsX = window.innerWidth < 1400 ? 11 : 15;
    const options = {
        chart: {
            type: 'spline',
            animation: false,
            events: {
                click: onClick,
            },
        },
        xAxis: {
            type: 'datetime',
            categories: dataAfterLocalFilter?.occurredOn,
            scrollbar: {
                enabled: true,
            },
            min: 0,
            max: pointsX,
            offset: 65,
            events: {
                afterSetExtremes: synchronousChart(refs),
            },
        },
        yAxis: {
            min: 0,
            max: 200,
            lineWidth: 0,
            gridLineDashStyle: 'longdash',
            gridLineColor: '#707073',
            title: {
                margin: 20,
            },
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            maxHeight: 55,
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false,
                },
                // pointStart: 1,
                cursor: 'pointer',
                event: {
                    click: onClick,
                },
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
                            verticalAlign: 'top',
                        },
                    },
                },
            ],
        },
    };

    return (
        <Chart
            chartType={'line'}
            chartTitle={t(messages.weldTimeTitle)}
            xChartTitle={''}
            yChartTitle={t(messages.yAxisTitle)}
            tooltipFormat={`<b>${t(messages.weldTimeTitle)} : {point.y}</b>`}
            className={` ${className} x-cls-cycle-count `}
            options={options}
            onClick={onClick}
            getRef={getRef}
            isLoading={weldTimeIsLoading}
        />
    );
});

// extra widget properties
const defaultFilters = [
    { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    { name: FilterNames.studId, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    {
        name: FilterNames.week,
        type: FilterType.Select,
        label: 'Filters.WeekLabel',
        placeholder: 'Filters.FilterByWeekPlaceholder',
        data: { options: [] } as SelectFilterData,
    },
    { name: FilterNames.studType, type: FilterType.Select, data: { options: [] } as SelectFilterData },
];

export const WeldTimeProperty = Object.assign(
    {},
    {
        defaultFilters,
        type: 'panel',
        layout: {
            minW: 1,
            minH: 1,
        },
    },
);

export default WeldTime;

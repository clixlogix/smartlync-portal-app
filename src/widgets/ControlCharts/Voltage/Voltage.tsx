/**
 *
 * Voltage
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { voltageActions, voltageReducer, voltageKey } from 'services/voltage/voltage-reducer';
import { selectVoltages, selectVoltageIsLoading } from 'services/voltage/voltage-selectors';
import { Chart } from 'components/panels';
import { getAllVoltagesSaga } from 'services/voltage/sagas/voltage-saga-get-all';
import { FilterNames, Filters, Voltages } from 'models';
import { DashboardFilter, FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { ChartRef } from 'components/panels/Chart/Chart';
import { synchronousChart } from 'utils/synchronousChart';
import { filterControlChartByLocalFilters } from 'utils/filterByLocalFilters';
import { ChartWidgetProps, Widget } from 'widgets';
import { messages } from './messages';

interface VoltageProps extends ChartWidgetProps {
    getRef?(ref: ChartRef);
    refs?: ChartRef[];
    localFilters: Filters;
}

export const Voltage: Widget<VoltageProps> = memo((props: VoltageProps) => {
    const { className = '', filters = {}, localFilters = {}, setAvailableFilters, onClick, getRef, refs } = props;

    useInjectReducer({ key: voltageKey, reducer: voltageReducer });
    useInjectSaga({ key: voltageKey, saga: getAllVoltagesSaga });

    const { t, i18n } = useTranslation();
    const voltages: Voltages | undefined = useSelector(selectVoltages);
    const voltageIsLoading: boolean = useSelector(selectVoltageIsLoading);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(voltageIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        // ...defaultFilters,
        // add your filters here
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
        dispatch(voltageActions.getAllVoltages(serviceFilters));
    }, [dispatch, serviceFilters]);

    const dataAfterLocalFilter = filterControlChartByLocalFilters(voltages, localFilters);

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
            max: 50,
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
            chartTitle={t(messages.voltageTitle)}
            xChartTitle={''}
            yChartTitle={t(messages.yAxisTitle)}
            tooltipFormat={`<b>${t(messages.voltageTitle)} : {point.y}</b>`}
            className={` ${className} x-cls-cycle-count `}
            options={options}
            onClick={onClick}
            getRef={getRef}
            isLoading={voltageIsLoading}
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

export const VoltageProperty = Object.assign(
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

export default Voltage;

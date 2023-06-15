/**
 *
 * Lift
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
// import { liftActions, liftReducer, liftKey } from 'services/lift/lift-reducer';
// import { selectLifts, selectLiftIsLoading } from 'services/lift/lift-selectors';
// import { getAllLiftsSaga } from 'services/lift/sagas/lift-saga-get-all';
import { liftSprActions, liftSprReducer, liftSprKey } from 'services/SPR/lift-spr/lift-spr-reducer';
import { selectLiftSprs, selectLiftSprIsLoading } from 'services/SPR/lift-spr/lift-spr-selectors';

import { getAllLiftSprsSaga } from 'services/SPR/lift-spr/sagas/lift-spr-saga-get-all';
import { Chart } from 'components/panels';
import { FilterNames, Filters, LiftSprs } from 'models';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { ChartRef } from 'components/panels/Chart/Chart';
import { synchronousChart } from 'utils/synchronousChart';
import { filterControlChartByLocalFilters } from 'utils/filterByLocalFilters';
import { Widget, ChartWidgetProps } from 'widgets';
import { messages } from './messages';
interface LiftSprProps extends ChartWidgetProps {
    onClick?(event);
    getRef?(ref: ChartRef);
    refs?: ChartRef[];
    localFilters: Filters;
}

export const LiftSprWidget: Widget<LiftSprProps> = memo((props: LiftSprProps) => {
    const { className = '', filters = {}, localFilters = {}, onClick, getRef, refs } = props;

    useInjectReducer({ key: liftSprKey, reducer: liftSprReducer });
    useInjectSaga({ key: liftSprKey, saga: getAllLiftSprsSaga });

    const { t, i18n } = useTranslation();
    const lift: LiftSprs | undefined = useSelector(selectLiftSprs);

    const liftIsLoading: boolean = useSelector(selectLiftSprIsLoading);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(liftIsLoading);
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
        dispatch(liftSprActions.getAllLiftSprs(serviceFilters));
    }, [dispatch, serviceFilters]);

    const dataAfterLocalFilter = filterControlChartByLocalFilters(lift, localFilters);

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
            max: 5,
            tickInterval: 5,
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
            chartTitle={t(messages.liftTitle)}
            xChartTitle={''}
            yChartTitle={t(messages.yAxisTitle)}
            tooltipFormat={`<b>${t(messages.liftTitle)} : {point.y}</b>`}
            className={` ${className} x-cls-cycle-count `}
            options={options}
            onClick={onClick}
            getRef={getRef}
            isLoading={liftIsLoading}
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

export const LiftSprProperty = Object.assign(
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

export default LiftSprWidget;

/**
 *
 * EventCountFrequencyWidgetSpr
 *
 */
import { Chart } from 'components/panels';
import { DashboardFilter, FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { EventCountFrequencySprs, FilterNames, Filters, LineValue } from 'models';
import moment from 'moment';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
    eventCountFrequencySprWidgetActions,
    eventCountFrequencySprWidgetKey,
    eventCountFrequencySprWidgetReducer,
} from 'services/event-count-frequency-spr-widget/event-count-frequency-spr-widget-reducer';
import {
    selectEventCountFrequencySprWidgetIsLoading,
    selectEventCountFrequencySprWidgets,
} from 'services/event-count-frequency-spr-widget/event-count-frequency-spr-widget-selectors';
import { getAllEventCountFrequencySprWidgetsSaga } from 'services/event-count-frequency-spr-widget/sagas/event-count-frequency-spr-widget-saga-get-all';
import { filterByLocalFilters } from 'utils/filterByLocalFilters';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Widget, WidgetProps } from 'widgets';
import { messages } from './messages';

interface EventCountFrequencyWidgetSprProps extends WidgetProps {
    localFilters: Filters;
}

export const EventCountFrequencyWidgetSpr: Widget<EventCountFrequencyWidgetSprProps> = memo(
    (props: EventCountFrequencyWidgetSprProps) => {
        const { className = '', filters = {}, localFilters = {}, setAvailableFilters } = props;
        useInjectReducer({
            key: eventCountFrequencySprWidgetKey,
            reducer: eventCountFrequencySprWidgetReducer,
        });

        useInjectSaga({
            key: eventCountFrequencySprWidgetKey,
            saga: getAllEventCountFrequencySprWidgetsSaga,
        });
        const [widgetFilters] = useState<Filters>({
            view: 'weekly',
            ...filters,
        });
        const eventCountFrequencySprWidgets: EventCountFrequencySprs | undefined = useSelector(
            selectEventCountFrequencySprWidgets,
        );
        const isLoading: boolean = useSelector(selectEventCountFrequencySprWidgetIsLoading);
        const dispatch = useDispatch();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { t, i18n } = useTranslation();

        const serviceFilters = useMemo(
            () => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }),
            [widgetFilters, filters, i18n.language],
        );

        const yearLabel = useMemo(() => {
            if (moment(serviceFilters.fromTime).year() !== moment(serviceFilters.toTime).year()) {
                return `${moment(serviceFilters.fromTime).year()} - ${moment(serviceFilters.toTime).year()}`;
            }
            return `${moment(serviceFilters.toTime).year()}`;
        }, [serviceFilters.fromTime, serviceFilters.toTime]);

        useEffect(() => {
            dispatch(eventCountFrequencySprWidgetActions.getAllEventCountFrequencySprWidgets(serviceFilters));
        }, [dispatch, serviceFilters]);

        const dataAfterLocalFilter = useMemo(() => {
            return filterByLocalFilters(eventCountFrequencySprWidgets, localFilters);
        }, [eventCountFrequencySprWidgets, localFilters]);

        const [filterValues, formattedData, categories] = useMemo(() => {
            const fValues = { occurences: { max: 0, min: 0 }, eventCodes: new Set() };
            const fCategories = new Set<string>();
            const fData: Map<string, LineValue[]> = (dataAfterLocalFilter || []).reduce((acc, row: any, index) => {
                const { occurrences, eventCode, deviceName, week } = row;
                let value: LineValue[] = [[week, occurrences]];

                if (acc.has(deviceName)) {
                    value = acc.get(deviceName) || [];
                    value.push([week, occurrences]);
                }

                acc.set(deviceName, value);

                fValues.occurences.max = Math.max(fValues.occurences.max, occurrences);
                fValues.occurences.min = Math.min(fValues.occurences.min, occurrences);
                fValues.eventCodes.add(parseInt(eventCode));

                fCategories.add(week);

                return acc;
            }, new Map<string, LineValue[]>());

            return [fValues, fData, Array.from(fCategories)];
        }, [dataAfterLocalFilter]);

        const series: any[] = [];
        formattedData.forEach(function (data, name) {
            series.push({ data, name });
        });

        useEffect(() => {
            if (setAvailableFilters) {
                setAvailableFilters(
                    defaultFilters.map((filter) => {
                        const data: any = {};

                        switch (filter.name) {
                            case 'eventCode':
                                data.options = Array.from(filterValues.eventCodes);
                                break;
                            case 'deviceName':
                                data.options = ['1', '2', '3', '4'];
                                break;
                        }

                        return { ...filter, data };
                    }),
                );
            }
        }, [widgetFilters, setAvailableFilters, filterValues]);

        const options = {
            chart: {
                type: 'line',
                scrollablePlotArea: {
                    minWidth: 700,
                    scrollPositionX: 1,
                },
            },
            xAxis: {
                categories,
                labels: {
                    overflow: 'justify',
                },
                max: categories.length > 10 ? 10 : categories.length - 1,
            },
            legend: {
                enabled: series.length > 0 ? true : false,
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
                                verticalAlign: 'bottom',
                            },
                        },
                    },
                ],
            },
        };

        return (
            <Chart
                chartType={'line'}
                chartTitle={`${t(messages.faultFrequencyCountTitle)} ${yearLabel}`}
                xChartTitle={t(messages.xAxisFaultFrequencyCountTitle)}
                yChartTitle={t(messages.yAxisFaultFrequencyCountTitle)}
                tooltipFormat={`<b>${t(messages.yAxisFaultFrequencyCountTitle)} : {point.y}</b></br><b>${t(
                    messages.deviceName,
                )} : {point.series.name}</b>`}
                className={` ${className} x-cls-event-count-frequency-widget-widget `}
                options={options}
                isLoading={isLoading}
            />
        );
    },
);

// extra widget properties
const defaultFilters: DashboardFilter[] = [
    {
        name: FilterNames.week,
        type: FilterType.Select,
        label: 'Filters.WeekLabel',
        placeholder: 'Filters.FilterByWeekPlaceholder',
        data: { options: [] } as SelectFilterData,
    },
    { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    { name: FilterNames.faultCode, type: FilterType.Select, data: { options: [] } as SelectFilterData },
];
export const EventCountFrequencyWidgetSprProperty = Object.assign(
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

export default EventCountFrequencyWidgetSpr;

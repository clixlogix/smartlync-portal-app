/**
 *
 * EventCountDailyFrequency
 *
 */
import React, { memo, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { FilterNames, Filters, LineValue } from 'models';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    eventCountDailyFrequencyActions,
    eventCountDailyFrequencyReducer,
    eventCountDailyFrequencyKey,
} from 'services/event-count-daily-frequency/event-count-daily-frequency-reducer';
import {
    // DateFilterData,
    FilterType,
    DashboardFilter,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import {
    selectEventCountDailyFrequencys,
    selectEventCountDailyFrequencyIsLoading,
} from 'services/event-count-daily-frequency/event-count-daily-frequency-selectors';
import { getAllEventCountDailyFrequencysSaga } from 'services/event-count-daily-frequency/sagas/event-count-daily-frequency-saga-get-all';
import { EventCountDailyFrequencys } from 'models';
import { filterByLocalFilters } from 'utils/filterByLocalFilters';
import { sortByDate } from 'utils/sortByDate';
import { Chart } from 'components/panels';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';

interface EventCountDailyFrequencyProps extends WidgetProps {
    localFilters: Filters;
}

export const EventCountDailyFrequency: Widget<EventCountDailyFrequencyProps> = memo(
    (props: EventCountDailyFrequencyProps) => {
        const { filters = {}, localFilters = {}, setAvailableFilters } = props;

        const [widgetFilters] = useState<Filters>({
            view: 'daily',
            ...filters,
        });

        useInjectReducer({ key: eventCountDailyFrequencyKey, reducer: eventCountDailyFrequencyReducer });
        useInjectSaga({ key: eventCountDailyFrequencyKey, saga: getAllEventCountDailyFrequencysSaga });

        const eventCountDailyFrequencys: EventCountDailyFrequencys | undefined = useSelector(
            selectEventCountDailyFrequencys,
        );
        const isLoading = useSelector(selectEventCountDailyFrequencyIsLoading);
        const dispatch = useDispatch();
        const { t, i18n } = useTranslation();

        if (props.isLoading) {
            props.isLoading(isLoading);
        }

        const serviceFilters = useMemo(
            () => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }),
            [widgetFilters, filters, i18n.language],
        );

        useEffect(() => {
            dispatch(eventCountDailyFrequencyActions.getAllEventCountDailyFrequencys(serviceFilters));
        }, [dispatch, serviceFilters]);

        const dataAfterLocalFilter = filterByLocalFilters(eventCountDailyFrequencys, localFilters);

        const [filterValues, formattedData, categories] = useMemo(() => {
            const fValues = { occurences: { max: 0, min: 0 }, eventCodes: new Set() };
            const fCategories = new Set<string>();
            const fData: Map<string, LineValue[]> = (dataAfterLocalFilter || []).reduce((acc, row: any) => {
                const { occurrences, eventCode, deviceName, occurredOn } = row;
                let value: LineValue[] = [[occurredOn, occurrences]];

                if (acc.has(deviceName)) {
                    value = acc.get(deviceName) || [];
                    value.push([occurredOn, occurrences]);
                }

                acc.set(deviceName, value);

                fValues.occurences.max = Math.max(fValues.occurences.max, occurrences);
                fValues.occurences.min = Math.min(fValues.occurences.min, occurrences);
                fValues.eventCodes.add(parseInt(eventCode));

                fCategories.add(occurredOn);

                return acc;
            }, new Map<string, LineValue[]>());

            return [fValues, fData, Array.from(fCategories)];
        }, [dataAfterLocalFilter]);

        const series: any[] = [];
        formattedData.forEach(function (data, name) {
            series.push({ data, name });
        });

        const yearLabel = useMemo(() => {
            if (moment(serviceFilters.fromTime).year() !== moment(serviceFilters.toTime).year()) {
                return `${moment(serviceFilters.fromTime).year()} - ${moment(serviceFilters.toTime).year()}`;
            }
            return `${moment(serviceFilters.toTime).year()}`;
        }, [serviceFilters.fromTime, serviceFilters.toTime]);

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

        const [sortedCategories, sortedCategoriesLength] = sortByDate<string>(categories);

        const options = {
            chart: {
                type: 'line',
            },
            xAxis: {
                categories: sortedCategories,
                max: sortedCategoriesLength > 10 ? 10 : sortedCategoriesLength - 1,
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
            <>
                <Chart
                    chartType={'line'}
                    chartTitle={`${t(messages.faultFrequencyCountTitle)} ${yearLabel}`}
                    xChartTitle={t(messages.xAxisFaultFrequencyCountTitle)}
                    yChartTitle={t(messages.yAxisFaultFrequencyCountTitle)}
                    tooltipFormat={`<b>${t(messages.yAxisFaultFrequencyCountTitle)} : {point.y}</b></br><b>${t(
                        messages.deviceName,
                    )} : {point.series.name}</b>`}
                    options={options}
                    isLoading={isLoading}
                />
            </>
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
    { name: FilterNames.studType, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    { name: FilterNames.faultCode, type: FilterType.Select, data: { options: [] } as SelectFilterData },
];

export const EventCountDailyFrequencyProperty = Object.assign(
    {},
    {
        defaultFilters,
        type: 'panel',
        layout: {
            minW: 2,
            minH: 3,
        },
    },
);

export default EventCountDailyFrequency;

/**
 *
 * EventRateCycleCountSpr
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import moment from 'moment';
import { Chart } from 'components/panels';
import {
    eventRateCycleCountSprActions,
    eventRateCycleCountSprReducer,
    eventRateCycleCountSprKey,
} from 'services/event-rate-cycle-count-spr/event-rate-cycle-count-spr-reducer';
import {
    selectEventRateCycleCountSprs,
    selectEventRateCycleCountSprIsLoading,
} from 'services/event-rate-cycle-count-spr/event-rate-cycle-count-spr-selectors';
import { getAllEventRateCycleCountSprsSaga } from 'services/event-rate-cycle-count-spr/sagas/event-rate-cycle-count-spr-saga-get-all';
import { Filters, EventRateCycleCountSprs, FilterNames, view } from 'models';
import {
    DashboardFilter,
    // DateFilterData,
    // FilterType,
    // SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { filterByLocalFilters } from 'utils/filterByLocalFilters';
import { ChartRef } from 'components/panels/Chart/Chart';
import { synchronousChart } from 'utils/synchronousChart';
import { WidgetProps, Widget } from 'widgets';
import omitBy from 'lodash/omitBy';
import { useTheme } from '@mui/material';
import { chartTheme, ThemeModes } from 'styles/theme/themes';
import isNil from 'lodash/isNil';
import { messages } from './messages';

import 'scss/main.scss';
import './EventRateCycleCountSpr.scss';

interface EventRateCycleCountSprProps extends WidgetProps {
    localFilters: Filters;
    getRef?(ref: ChartRef);
    refs?: ChartRef[];
}
export const EventRateCycleCountSpr: Widget<EventRateCycleCountSprProps> = memo(
    (props: EventRateCycleCountSprProps) => {
        const { className = '', filters = {}, localFilters = {}, setAvailableFilters, getRef, refs } = props;
        useInjectReducer({ key: eventRateCycleCountSprKey, reducer: eventRateCycleCountSprReducer });
        useInjectSaga({ key: eventRateCycleCountSprKey, saga: getAllEventRateCycleCountSprsSaga });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { t, i18n } = useTranslation();

        const eventRateCycleCountSprs: EventRateCycleCountSprs | undefined = useSelector(selectEventRateCycleCountSprs);
        const eventRateCycleCountSprIsLoading: boolean = useSelector(selectEventRateCycleCountSprIsLoading);
        const dispatch = useDispatch();

        if (props.isLoading) {
            props.isLoading(eventRateCycleCountSprIsLoading);
        }

        const [widgetFilters] = useState<Filters>({
            // ...defaultFilters,
            // add your filters here
            plantId: 1,
            view: view.Weekly,
            ...filters,
        });

        const serviceFilters = useMemo(
            () => ({
                [FilterNames.langCode]: i18n.language,
                ...widgetFilters,
                ...filters,
                [FilterNames.eventCode]: filters?.eventCode === '' ? undefined : filters?.eventCode,
            }),
            [widgetFilters, filters, i18n.language],
        );

        const yearLabel = useMemo(() => {
            if (serviceFilters?.fromTime.year() !== serviceFilters?.toTime.year()) {
                return `${serviceFilters?.fromTime.year()} - ${serviceFilters?.toTime.year()}`;
            }
            return `${serviceFilters?.toTime.year()}`;
        }, [serviceFilters.fromTime, serviceFilters.toTime]);
        useEffect(() => {
            const filter = omitBy(
                {
                    [FilterNames.carType]: serviceFilters.carType,
                    [FilterNames.fromTime]: serviceFilters.fromTime,
                    [FilterNames.toTime]: serviceFilters.toTime,
                    [FilterNames.langCode]: serviceFilters.langCode,
                    [FilterNames.plantId]: serviceFilters.plantId,
                    [FilterNames.view]: serviceFilters.view,
                    [FilterNames.systemType]: serviceFilters.systemType,
                    [FilterNames.eventType]: serviceFilters.eventType,
                    [FilterNames.eventCode]: serviceFilters.eventCode,
                    [FilterNames.deviceLine]: serviceFilters.subLine,
                    [FilterNames.studType]: serviceFilters.studType,
                    [FilterNames.deviceName]: serviceFilters.deviceName,
                },
                isNil,
            );
            dispatch(eventRateCycleCountSprActions.getAllEventRateCycleCountSprs(filter));
        }, [
            dispatch,
            serviceFilters.carType,
            serviceFilters.fromTime,
            serviceFilters.toTime,
            serviceFilters.langCode,
            serviceFilters.plantId,
            serviceFilters.view,
            serviceFilters.systemType,
            serviceFilters.eventType,
            serviceFilters.eventCode,
            serviceFilters.subLine,
            serviceFilters.studType,
            serviceFilters.deviceName,
        ]);

        const themeMode: 'light' | 'dark' = useTheme().palette.mode;

        const dataAfterLocalFilter = useMemo(() => {
            return filterByLocalFilters(eventRateCycleCountSprs, localFilters);
        }, [eventRateCycleCountSprs, localFilters]);

        const [filterValues, formattedData, categories, eventPercentage] = useMemo(() => {
            const fValues = { cycleCount: { max: 0, min: 0 }, week: new Set() };
            const fCategories = new Set<string>();
            let eventPercent: any[] = [];

            const sortedDataAfterLocalFilter = dataAfterLocalFilter?.sort(
                (a, b) => moment(a?.occurredOn || a?.date).valueOf() - moment(b?.occurredOn || b?.date).valueOf(),
            );

            const fData = (sortedDataAfterLocalFilter || []).reduce((acc: any, row: any, index) => {
                const { cycleCount, week, eventCount, occurredOn, date } = row;

                const formattedDate = moment(occurredOn || date).format('YYYY-MM-DD');
                let eventRate;
                if (cycleCount === 0) {
                    eventRate = 0;
                } else {
                    eventRate = +((eventCount / (eventCount + cycleCount)) * 100).toFixed(2);
                }

                // add your format for each row of the widget's data here
                acc.push({ y: cycleCount, eventCount, cycleCount, eventRate });

                if (filters.view === view.Weekly || filters.view === undefined) {
                    fCategories.add(week.toString());
                }
                if (filters.view === view.Daily) {
                    fCategories.add(formattedDate.toString());
                }

                eventPercent.push({ y: eventRate, eventCount, cycleCount, eventRate });
                // add your filter default selectors/data here
                return acc;
            }, []);
            return [fValues, fData, Array.from(fCategories), eventPercent];
        }, [dataAfterLocalFilter, filters.view]);

        const series: any[] = [
            {
                type: 'column',
                name: 'Weld Count',
                data: formattedData,
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    format: '{point.y}',
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Open Sans',
                    },
                },
            },
            {
                type: 'line',
                name: 'Event Rate',
                color: 'red',
                data: eventPercentage,
                yAxis: 1,
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    format: '{point.y}',
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Open Sans',
                    },
                },
            },
        ];

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
                                data.options = [];
                                break;
                        }

                        return { ...filter, data };
                    }),
                );
            }
        }, [widgetFilters, setAvailableFilters, filterValues]);

        const eventOptions = {
            xAxis: {
                categories: categories,
                max: categories.length > 12 ? 10 : null,
                scrollbar: {
                    enabled: categories.length > 12 ? true : false,
                },
                events: {
                    afterSetExtremes: synchronousChart(refs),
                },
            },

            tooltip: {
                useHTML: true,
                headerFormat: '<table><tr><th colspan="2">{point.x}</th></tr>',
                pointFormat:
                    '<tr><td>Cycle count : </td>' +
                    '<td style="text-align: left"><b>{point.cycleCount}</b></td></tr>' +
                    '<tr><td>Event Count : </td>' +
                    '<td style="text-align: left"><b>{point.eventCount}</b></td></tr>' +
                    '<tr><td>Event Rate : </td>' +
                    '<td style="text-align: left"><b>{point.eventRate}</b></td></tr>',
                footerFormat: '</table>',
            },
            yAxis: [
                {
                    gridLineColor: 'transparent',
                    lineWidth: 1,
                    title: {
                        text: `${t(messages.yAxisEventRateCycleCountTitle)}`,
                        style: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            fontFamily: 'Open Sans',
                            color: 'white',
                        },
                    },
                    labels: {
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Open Sans',
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                        },
                    },
                },
                {
                    gridLineColor: 'transparent',
                    lineWidth: 1,
                    opposite: true,
                    title: {
                        text: `${t(messages.secondaryYAxisEventRateCycleCountTitle)}`,
                        style: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            fontFamily: 'Open Sans',
                            color: 'white',
                        },
                    },
                    labels: {
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Open Sans',
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
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
                                verticalAlign: 'top',
                            },
                        },
                    },
                ],
            },
        };

        return (
            <Chart
                chartTitle={
                    filters.view === view.Daily
                        ? `${t(messages.eventRateCycleCounSprTitleDaily)} ${yearLabel}`
                        : `${t(messages.eventRateCycleCounSprTitleWeekly)} ${yearLabel}`
                } xChartTitle={t(messages.xAxisEventRateCycleCountTitle)}
                xChartTitle={
                    filters.view === view.Daily
                        ? t(messages.xAxisEventRateCycleCountTitleDaily)
                        : t(messages.xAxisEventRateCycleCountTitleWeekly)
                }
                yChartTitle={t(messages.yAxisEventRateCycleCountTitle)}
                className={` ${className} x-cls-cycle-count `}
                options={eventOptions}
                isLoading={eventRateCycleCountSprIsLoading}
                getRef={getRef}
                size={{ width: 0, height: 450 }}
            />
        );
    },
);

// extra widget properties
const defaultFilters = [];
export const EventRateCycleCountSprProperty = Object.assign(
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

export default EventRateCycleCountSpr;

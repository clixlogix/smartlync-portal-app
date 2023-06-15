/**
 *
 * EventDescFrequencySpr
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/styles';

import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    eventDescFrequencySprActions,
    eventDescFrequencySprReducer,
    eventDescFrequencySprKey,
} from 'services/event-desc-frequency-spr/event-desc-frequency-spr-reducer';
import {
    selectEventDescGraphFrequencySprs,
    selectEventDescFrequencySprIsLoading,
} from 'services/event-desc-frequency-spr/event-desc-frequency-spr-selectors';

import { getAllEventDescFrequencySprsSaga } from 'services/event-desc-frequency-spr/sagas/event-desc-frequency-spr-saga-get-all';

import { Filters, FilterNames } from 'models';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';
import { filterByLocalFilters } from 'utils/filterByLocalFilters';
import { Chart } from 'components/panels';

interface EventDescFrequencySprProps extends WidgetProps {
    localFilters: Filters;
}

export const EventDescFrequencySprWidget: Widget<EventDescFrequencySprProps> = memo(
    (props: EventDescFrequencySprProps) => {
        const { className = '', filters = {}, localFilters = {} } = props;
        useInjectReducer({ key: eventDescFrequencySprKey, reducer: eventDescFrequencySprReducer });

        useInjectSaga({ key: eventDescFrequencySprKey, saga: getAllEventDescFrequencySprsSaga });
        const { t, i18n } = useTranslation();

        const [widgetFilters] = useState<Filters>({
            langCode: i18n.language,
            ...filters,
        });
        const eventDescFrequencys = useSelector(selectEventDescGraphFrequencySprs);
        const isLoading = useSelector(selectEventDescFrequencySprIsLoading);
        const dispatch = useDispatch();
        const themePalette = useTheme().palette;

        const serviceFilters = useMemo(
            () => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }),
            [widgetFilters, filters, i18n.language],
        );

        useEffect(() => {
            dispatch(eventDescFrequencySprActions.getAllEventDescFrequencySprs(serviceFilters));
        }, [dispatch, serviceFilters]);

        const dataAfterLocalFilter = filterByLocalFilters(eventDescFrequencys, localFilters);
        const formattedEventDescFrequencys = dataAfterLocalFilter?.map(([name, value, eventCode, { eventType }]) => {
            const translatedEventType = eventType === 'Warnung' ? t(messages.warning) : t(messages.fault);

            return {
                name: `${eventCode}: ${name} (${translatedEventType})`,
                y: value,
            };
        });

        const options = {
            xAxis: {
                type: 'category',
                min: 0,
                max: 4,
                scrollbar: {
                    enabled: true,
                },
                tickLength: 0,
                uniqueNames: false,
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                    },
                    getExtremesFromAll: true,
                },
            },
            legend: {
                enabled: false,
            },
            credits: {
                enabled: false,
            },
            series: [
                {
                    type: 'bar',
                    data: formattedEventDescFrequencys,
                    dataLabels: {
                        enabled: true,
                        color: themePalette.text.primary,
                        align: 'center',
                        format: '{point.y}',
                        style: {
                            fontSize: '14px',
                            fontFamily: 'Open Sans',
                        },
                    },
                },
            ],
        };

        return (
            <Chart
                chartType={'bar'}
                chartTitle={t(messages.faultFrequencyChartTitle)}
                xChartTitle={t(messages.yAxisFaultFrequencyTitle)}
                yChartTitle={t(messages.xAxisFaultFrequencyTitle)}
                className={` ${className} x-cls-event-code-frequency-widget `}
                options={options}
                data={formattedEventDescFrequencys}
                isLoading={isLoading}
            />
        );
    },
);

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
*/
];
export const EventDescFrequencySprProperty = Object.assign(
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

export default EventDescFrequencySprWidget;

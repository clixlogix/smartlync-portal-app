/**
 *
 * EventDescFrequency
 *
 */

import React, { memo, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { FilterNames, Filters } from 'models';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { useTheme } from '@mui/styles';
import {
    eventDescFrequencyActions,
    eventDescFrequencyReducer,
    eventDescFrequencyKey,
} from 'services/event-desc-frequency/event-desc-frequency-reducer';
import {
    selectEventDescFrequencyIsLoading,
    selectEventDescGraphFrequency,
} from 'services/event-desc-frequency/event-desc-frequency-selectors';
import { getAllEventDescFrequencysSaga } from 'services/event-desc-frequency/sagas/event-desc-frequency-saga-get-all';
//import { DashboardFilter, FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { filterByLocalFilters } from 'utils/filterByLocalFilters';
import { Chart } from 'components/panels';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';

interface EventDescFrequencyProps extends WidgetProps {
    localFilters: Filters;
}

export const EventDescFrequencyWidget: Widget<EventDescFrequencyProps> = memo((props: EventDescFrequencyProps) => {
    const { className = '', filters = {}, localFilters = {} } = props;
    useInjectReducer({ key: eventDescFrequencyKey, reducer: eventDescFrequencyReducer });

    useInjectSaga({ key: eventDescFrequencyKey, saga: getAllEventDescFrequencysSaga });
    const { t, i18n } = useTranslation();

    const [widgetFilters] = useState<Filters>({
        langCode: i18n.language,
        ...filters,
    });
    const eventDescFrequencys = useSelector(selectEventDescGraphFrequency);
    const isLoading = useSelector(selectEventDescFrequencyIsLoading);
    const dispatch = useDispatch();
    const themePalette = useTheme().palette;

    const serviceFilters = useMemo(() => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }), [
        widgetFilters,
        filters,
        i18n.language,
    ]);

    useEffect(() => {
        dispatch(eventDescFrequencyActions.getAllEventDescFrequencys(serviceFilters));
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
                    color: themePalette?.text?.primary,
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
});

// extra widget properties
// const defaultFilters: DashboardFilter[] = [
//     {
//         name: FilterNames.deviceName,
//         type: FilterType.Select,
//         data: { options: [] } as SelectFilterData,
//     },
//     {
//         name: FilterNames.eventType,
//         type: FilterType.Select,
//         data: {
//             options: [],
//         } as SelectFilterData,
//     },
// ];

export const EventDescFrequencyWidgetProperty = Object.assign(
    {},
    {
        // defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 3,
            w: 4,
            h: 3,
            minW: 1,
            minH: 1,
        },
    },
);

export default EventDescFrequencyWidget;

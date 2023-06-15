/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    // eventRatePerDeviceTitle: _t(translations.Widgets.EventRatePerDevice.Title, 'EventRatePerDevice widget'), // default value
    eventRatePerDeviceSubTitle: _t(translations.Widgets.EventRatePerDevice.SubTitle, 'A eventRatePerDevice widget'), // default value
    eventRatePerDeviceTitle: _t(
        translations.Widgets.EventRatePerDevice.EventRatePerDeviceTitle,
        'Event rate per Device By Day 2021',
    ),
    eventRatePerBodyshopTitle: _t(translations.Widgets.EventRatePerDevice.EventRatePerBodyshopTitle, 'Event rate for'),
    eventRateByDay: _t(translations.Widgets.EventRatePerDevice.EventRateByDay, 'by Day'),
    eventRateByWeek: _t(translations.Widgets.EventRatePerDevice.EventRateByWeek, 'by Week'),
    eventRatePerDeviceTitleDaily: _t(
        translations.FailureRateTrend.EventRatePerDeviceTitleDaily,
        'Event Rate per Device by Day 2021',
    ),
    eventRatePerDeviceTitleWeekly: _t(
        translations.FailureRateTrend.EventRatePerDeviceTitleWeekly,
        'Event Rate per Device by Week 2021',
    ),
    yAxisEventRatePerDeviceTitle: _t(
        translations.Widgets.EventRatePerDevice.YAxisEventRatePerDeviceTitle,
        'Event Rate ( Part Per Million )',
    ),

    xAxisEventRatePerDeviceTitleDaily: _t(
        translations.Widgets.EventRatePerDevice.XAxisEventRatePerDeviceTitleDaily,
        'Day',
    ),
    xAxisEventRatePerDeviceTitleWeekly: _t(
        translations.Widgets.EventRatePerDevice.XAxisEventRatePerDeviceTitleWeekly,
        'Week',
    ),
    rateFault: _t(translations.Widgets.EventRatePerDevice.Fault, 'Fault'),
    eventRate: _t(translations.FailureRateTrend.EventRatePerEventYAxisLabel, 'Event Rate'),
    deviceName: _t(translations.Filters.FilterByDeviceNameLabel, 'Device Name'),
};

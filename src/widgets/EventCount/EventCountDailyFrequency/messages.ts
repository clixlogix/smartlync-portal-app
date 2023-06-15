/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    eventCountDailyFrequencyTitle: _t(
        translations.Widgets.EventCountDailyFrequency.Title,
        'EventCountDailyFrequency widget',
    ), // default value
    eventCountDailyFrequencySubTitle: _t(
        translations.Widgets.EventCountDailyFrequency.SubTitle,
        'A eventCountDailyFrequency widget',
    ), // default value
    faultFrequencyCountTitle: _t(
        translations.Widgets.EventCountDailyFrequency.FaultFrequencyCountTitle,
        'Event Code by Week 2021',
    ),
    yAxisFaultFrequencyCountTitle: _t(
        translations.Widgets.EventCountDailyFrequency.YAxisFaultFrequencyCountTitle,
        'Event Count',
    ),
    xAxisFaultFrequencyCountTitle: _t(
        translations.Widgets.EventCountDailyFrequency.XAxisFaultFrequencyCountTitle,
        'Week',
    ),
    deviceName: _t(translations.ReportingViewPageB.DeviceName, 'Event Count'),
};

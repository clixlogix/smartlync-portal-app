/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    eventCountFrequencyWidgetTitle: _t(
        translations.Widgets.EventCountFrequencyWidgetSpr.Title,
        'EventCountFrequencyWidgetSpr widget',
    ), // default value
    eventCountFrequencyWidgetSubTitle: _t(
        translations.Widgets.EventCountFrequencyWidgetSpr.SubTitle,
        'A eventCountFrequencyWidgetSpr widget',
    ), // default value
    faultFrequencyCountTitle: _t(
        translations.Widgets.EventCountFrequencyWidgetSpr.FaultFrequencyCountTitle,
        'Event Code by Week',
    ),
    yAxisFaultFrequencyCountTitle: _t(
        translations.Widgets.EventCountFrequencyWidgetSpr.YAxisFaultFrequencyCountTitle,
        'Week',
    ),
    xAxisFaultFrequencyCountTitle: _t(
        translations.Widgets.EventCountFrequencyWidgetSpr.XAxisFaultFrequencyCountTitle,
        'Event Count',
    ),
    deviceName: _t(translations.ReportingViewPageB.DeviceName, 'Event Count'),
};

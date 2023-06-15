/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    eventRatePerEventSprTitle: _t(translations.Widgets.EventRatePerEventSpr.SubTitle, 'EventRatePerEventSpr widget'), // default value
    eventRatePerEventSprSubTitle: _t(
        translations.Widgets.EventRatePerEventSpr.SubTitle,
        'A eventRatePerEventSpr widget',
    ), // default value
    eventRatePerEventChartTitleDaily: _t(
        translations.FailureRateTrend.EventRatePerEventChartTitleDaily,
        'Event Rate per Root Cause per Day {{yearLabel}}',
    ),
    eventRatePerEventChartTitleWeekly: _t(
        translations.FailureRateTrend.EventRatePerEventChartTitleWeekly,
        'Event Rate per Root Cause per Week {{yearLabel}}',
    ),

    eventRatePerEventYAxisLabel: _t(translations.FailureRateTrend.EventRatePerEventYAxisLabel, 'Event Rate'),
    eventRatePerEventXAxisLabelDaily: _t(translations.FailureRateTrend.EventRatePerEventXAxisLabelDaily, 'Day'),
    eventRatePerEventXAxisLabelWeekly: _t(translations.FailureRateTrend.EventRatePerEventXAxisLabelWeekly, 'Week'),
    fault: _t(translations.Widgets.EventRatePerEventSpr.Fault, 'Fault'),
    warning: _t(translations.Widgets.EventRatePerEventSpr.Warning, 'Warning'),
    faultCode: _t(translations.Filters.FilterByFaultCodeLabel, 'Fault Code'),
};

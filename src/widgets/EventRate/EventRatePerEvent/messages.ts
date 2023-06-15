/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    // eventRatePerEventTitle: _t(translations.Widgets.EventRatePerEvent.Title, 'EventRatePerEvent widget'), // default value
    eventRatePerEventSubTitle: _t(translations.Widgets.EventRatePerEvent.SubTitle, 'A eventRatePerEvent widget'), // default value
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
    fault: _t(translations.Widgets.EventRatePerEvent.Fault, 'Fault'),
    warning: _t(translations.Widgets.EventRatePerEvent.Warning, 'Warning'),
    faultCode: _t(translations.Filters.FilterByFaultCodeLabel, 'Fault Code'),
};

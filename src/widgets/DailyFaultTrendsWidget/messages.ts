/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    dailyFaultTrendsWidgetTitle: _t(
        translations.Widgets.DailyFaultTrendsWidget.WidgetTitle,
        'DailyFaultTrendsWidget widget',
    ),
    dailyFaultTrendsWidgetSubTitle: _t(
        translations.Widgets.DailyFaultTrendsWidget.SubTitle,
        'A dailyFaultTrendsWidget widget',
    ),
    code: _t(translations.Widgets.DailyFaultTrendsWidget.Code, 'Code'),
    time: _t(translations.Widgets.DailyFaultTrendsWidget.Time, 'Time'),
    countDay: _t(translations.Widgets.DailyFaultTrendsWidget.CountDay, 'Count Day'),
    countDayPercent: _t(translations.Widgets.DailyFaultTrendsWidget.CountDayPercent, 'Count Day Percent'),
    hourOfDay: _t(translations.Widgets.DailyFaultTrendsWidget.HourOfDay, 'hour of day'),
    totalDayFaults: _t(translations.Widgets.DailyFaultTrendsWidget.TotalDayFaults, '% total day faults'),
};

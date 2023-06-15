/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    dReportWidgetTitle: _t(translations.Widgets.DReportWidget.WidgetTitle, 'DReportWidget widget'), // default value
    dReportWidgetSubTitle: _t(translations.Widgets.DReportWidget.SubTitle, 'A dReportWidget widget'), // default value
    primaryAxisTitle: _t(translations.Widgets.DReportWidget.PrimaryYAxisTitle, 'Cycles'),
    secondaryAxisTitle: _t(translations.Widgets.DReportWidget.SecondaryYAxisTitle, 'Event Rate %'),
    chartTitle: _t(translations.Widgets.DReportWidget.ChartTitle, 'Trend'),
    target: _t(translations.Widgets.DReportWidget.Target, 'Target'),
    event_20002: _t(translations.Widgets.DReportWidget.Event_20002, 'Quote Ausspucker'),
    event_20028: _t(translations.Widgets.DReportWidget.Event_20028, 'Quote Klemmer'),
    event_17068: _t(translations.Widgets.DReportWidget.Event_17068, 'Quote Ladestift'),
};

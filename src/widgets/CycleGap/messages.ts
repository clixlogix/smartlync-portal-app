/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    cycleGapTitle: _t(translations.Widgets.CycleGap.WidgetTitle, 'CycleGap widget'),
    cycleGapSubTitle: _t(translations.Widgets.CycleGap.SubTitle, 'A cycleGap widget'),
    cycleGapGraphTitle: _t(translations.Widgets.CycleGap.GraphTitle, 'Cycle Gaps (station: {{stationName}}'),
    none: _t(translations.Widgets.CycleGap.None, 'None'),
    eventTypeLabel: _t(translations.Widgets.CycleGap.EventTypeLabel, 'Event Type'),
    unitslabel: _t(translations.Widgets.CycleGap.Unitslabel, 'Minutes'),
};

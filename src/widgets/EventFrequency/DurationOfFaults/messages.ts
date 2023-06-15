/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    durationOfFaultsTitle: _t(translations.Widgets.DurationOfFaults.WidgetTitle, 'Duration Of Faults'), // default value
    xAxisDurationOfFaultsTitle: _t(translations.Widgets.DurationOfFaults.xAxisLabel, 'A durationOfFaults widget'),
    yAxisDurationOfFaultsTitle: _t(translations.Widgets.DurationOfFaults.yAxisLabel, 'A durationOfFaults widget'),
    fault: _t(translations.Widgets.DurationOfFaults.Fault, 'Fault'),
};

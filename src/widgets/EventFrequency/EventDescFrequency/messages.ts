/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    eventDescFrequencyTitle: _t(translations.Widgets.EventDescFrequency.Title, 'EventDescFrequency widget'), // default value
    eventDescFrequencySubTitle: _t(translations.Widgets.EventDescFrequency.SubTitle, 'A eventDescFrequency widget'), // default value
    faultFrequencyChartTitle: _t(
        translations.ParetoAnalysis.EventDescriptionChartTitle,
        'Frequency of Event Description',
    ),
    yAxisFaultFrequencyTitle: _t(translations.ParetoAnalysis.EventDescriptionChartYAxisLabel, 'Description'),
    xAxisFaultFrequencyTitle: _t(translations.ParetoAnalysis.EventDescriptionChartXAxisLabel, 'Count Of Event Number'),
    fault: _t(translations.Widgets.EventDescFrequency.Fault, 'Fault'),
    warning: _t(translations.Filters.Warning, 'Warning'),
};

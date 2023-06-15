/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    eventCodeFrequencyTitle: _t(translations.Widgets.EventCodeFrequency.Title, 'EventCodeFrequency widget'),
    eventCodeFrequencySubTitle: _t(translations.Widgets.EventCodeFrequency.SubTitle, 'A eventCodeFrequency widget'),

    faultFrequencyChartTitle: _t(translations.ParetoAnalysis.EventCodeChartTitle, 'Frequency of Event Code'),
    yAxisFaultFrequencyTitle: _t(translations.ParetoAnalysis.EventCodeChartYAxisLabel, 'Count Of Event Number'),
    secondaryYAxisFaultFrequencyTitle: _t(translations.ParetoAnalysis.EventCodeChartSecondaryYAxisLabel, 'Percentage'),
    xAxisFaultFrequencyTitle: _t(translations.ParetoAnalysis.EventCodeChartXAxisLabel, 'Event Number'),
    fault: _t(translations.Widgets.EventCodeFrequency.Fault, 'Fault'),
    faultCount: _t(translations.Widgets.EventCodeFrequency.FaultCount, 'Number of Faults'),
};

/*
 */

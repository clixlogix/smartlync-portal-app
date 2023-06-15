import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    eventCodeFrequencySprTitle: _t(
        translations.Widgets.EventCodeFrequencySpr.WidgetTitle,
        'EventCodeFrequencySpr widget',
    ), // default value
    eventCodeFrequencySprSubTitle: _t(
        translations.Widgets.EventCodeFrequencySpr.SubTitle,
        'A eventCodeFrequencySpr widget',
    ),
    faultFrequencyChartTitle: _t(translations.ParetoAnalysis.EventCodeChartTitle, 'Frequency of Event Code'),
    yAxisFaultFrequencyTitle: _t(translations.ParetoAnalysis.EventCodeChartYAxisLabel, 'Count Of Event Number'),
    secondaryYAxisFaultFrequencyTitle: _t(translations.ParetoAnalysis.EventCodeChartSecondaryYAxisLabel, 'Percentage'),
    xAxisFaultFrequencyTitle: _t(translations.ParetoAnalysis.EventCodeChartXAxisLabel, 'Event Number'),
    fault: _t(translations.Widgets.EventCodeFrequency.Fault, 'Fault'),
    faultCount: _t(translations.Widgets.EventCodeFrequency.FaultCount, 'Number of Faults'),
};

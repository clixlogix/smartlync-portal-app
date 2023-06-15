/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantFaultFrequencySprTitle: _t(
        translations.Widgets.PlantFaultFrequencySpr.WidgetTitle,
        'PlantFaultFrequencySpr widget',
    ), // default value
    plantFaultFrequencySprSubTitle: _t(
        translations.Widgets.PlantFaultFrequencySpr.SubTitle,
        'A plantFaultFrequencySpr widget',
    ), // default value
    faultFrequencyChartTitle: _t(translations.PlantOverview.FaultFrequencyChartTitle, 'Frequencies Of Event Code'),
    yAxisFaultFrequencyTitle: _t(translations.PlantOverview.YAxisFaultFrequencyTitle, 'Count Of Event Number'),
    xAxisFaultFrequencyTitle: _t(translations.PlantOverview.XAxisFaultFrequencyTitle, 'Event Number'),
    fault: _t(translations.PlantOverview.Fault, 'Fault'),
};

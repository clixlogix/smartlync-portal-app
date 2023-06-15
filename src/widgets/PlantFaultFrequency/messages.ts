/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantFaultFrequencyTitle: _t(translations.Widgets.PlantFaultFrequency.Title, 'PlantFaultFrequency widget'),
    plantFaultFrequencySubTitle: _t(translations.Widgets.PlantFaultFrequency.SubTitle, 'A plantFaultFrequency widget'),
    faultFrequencyChartTitle: _t(translations.PlantOverview.FaultFrequencyChartTitle, 'Frequencies Of Event Code'),
    yAxisFaultFrequencyTitle: _t(translations.PlantOverview.YAxisFaultFrequencyTitle, 'Count Of Event Number'),
    xAxisFaultFrequencyTitle: _t(translations.PlantOverview.XAxisFaultFrequencyTitle, 'Event Number'),
    fault: _t(translations.PlantOverview.Fault, 'Fault'),
};

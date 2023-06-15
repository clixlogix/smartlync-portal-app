/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantFaultByOccurenceSprTitle: _t(
        translations.Widgets.PlantFaultByOccurenceSpr.WidgetTitle,
        'PlantFaultByOccurenceSpr widget',
    ), // default value
    plantFaultByOccurenceSprSubTitle: _t(
        translations.Widgets.PlantFaultByOccurenceSpr.SubTitle,
        'A plantFaultByOccurenceSpr widget',
    ), // default value
    faultByOccurrence: _t(translations.PlantOverview.FaultByOccurrence, 'Top 10 Faults with Highest Occurrence'),
    fault: _t(translations.PlantOverview.Fault, 'Fault'),
    occurrences: _t(translations.PlantOverview.Occurrences, 'Occurrences'),
    position: _t(translations.PlantOverview.Position, 'Position'),
    percentageChange: _t(translations.PlantOverview.PercentageChange, '% Change'),
};

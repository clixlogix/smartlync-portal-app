/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantFaultByOccurenceTitle: _t(
        translations.Widgets.PlantFaultByOccurence.WidgetTitle,
        'PlantFaultByOccurence widget',
    ), // default value
    plantFaultByOccurenceSubTitle: _t(
        translations.Widgets.PlantFaultByOccurence.SubTitle,
        'A plantFaultByOccurence widget',
    ),
    faultByOccurrence: _t(translations.PlantOverview.FaultByOccurrence, 'Top 10 Faults with Highest Occurrence'),
    fault: _t(translations.PlantOverview.Fault, 'Fault'),
    occurrences: _t(translations.PlantOverview.Occurrences, 'Occurrences'),
    position: _t(translations.PlantOverview.Position, 'Position'),
    percentageChange: _t(translations.PlantOverview.PercentageChange, '% Change'),
};

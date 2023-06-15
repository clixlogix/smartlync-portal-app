/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantFaultByDurationTitle: _t(translations.Widgets.PlantFaultByDuration.WidgetTitle, 'PlantFaultByDuration widget'), // default value
    plantFaultByDurationSubTitle: _t(
        translations.Widgets.PlantFaultByDuration.SubTitle,
        'A plantFaultByDuration widget',
    ),
    faultByDuration: _t(translations.PlantOverview.FaultByDuration, 'Top 10 Faults with Longest Duration'),
    fault: _t(translations.PlantOverview.Fault, 'Fault'),
    duration: _t(translations.PlantOverview.Duration, 'Duration (mins)'),
    position: _t(translations.PlantOverview.Position, 'Position'),
    percentageChange: _t(translations.PlantOverview.PercentageChange, '% Change'),
};

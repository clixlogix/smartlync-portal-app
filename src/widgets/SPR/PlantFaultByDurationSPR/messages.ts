/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantFaultByDurationSprTitle: _t(
        translations.Widgets.PlantFaultByDurationSpr.WidgetTitle,
        'PlantFaultByDurationSpr widget',
    ), // default value
    plantFaultByDurationSprSubTitle: _t(
        translations.Widgets.PlantFaultByDurationSpr.SubTitle,
        'A plantFaultByDurationSpr widget',
    ), // default value
    faultByDuration: _t(translations.PlantOverview.FaultByDuration, 'Top 10 Faults with Longest Duration'),
    fault: _t(translations.PlantOverview.Fault, 'Fault'),
    duration: _t(translations.PlantOverview.Duration, 'Duration (mins)'),
    position: _t(translations.PlantOverview.Position, 'Position'),
    percentageChange: _t(translations.PlantOverview.PercentageChange, '% Change'),
};

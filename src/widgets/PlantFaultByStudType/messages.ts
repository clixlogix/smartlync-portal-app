/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantFaultByStudTypeTitle: _t(translations.Widgets.PlantFaultByStudType.WidgetTitle, 'PlantFaultByStudType widget'),
    plantFaultByStudTypeSubTitle: _t(
        translations.Widgets.PlantFaultByStudType.SubTitle,
        'A plantFaultByStudType widget',
    ),
    studTypeWithFaults: _t(
        translations.PlantOverview.StudTypeWithFaults,
        'Top 10 Stud Types with Highest Fault Occurrence',
    ),
    fault: _t(translations.PlantOverview.Fault, 'Fault'),
    position: _t(translations.PlantOverview.Position, 'Position'),
    studType: _t(translations.PlantOverview.StudType, 'Stud Type'),
    percentageChange: _t(translations.PlantOverview.PercentageChange, '% Change'),
};

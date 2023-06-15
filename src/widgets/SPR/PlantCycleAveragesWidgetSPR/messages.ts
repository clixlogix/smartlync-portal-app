/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantCycleAveragesWidgetSprTitle: _t(
        translations.Widgets.PlantCycleAveragesWidgetSpr.WidgetTitle,
        'PlantCycleAveragesWidgetSpr widget',
    ), // default value
    plantCycleAveragesWidgetSprSubTitle: _t(
        translations.Widgets.PlantCycleAveragesWidgetSpr.SubTitle,
        'A plantCycleAveragesWidgetSpr widget',
    ), // default value
    noData: _t(translations.General.NoData, 'No data'), // default value
};

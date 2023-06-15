/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    taTableSprTitle: _t(translations.Widgets.TaTableSpr.WidgetTitle, 'TaTableSpr widget'), // default value
    taTableSprSubTitle: _t(translations.Widgets.TaTableSpr.SubTitle, 'A taTableSpr widget'), // default value
    ta: _t(translations.Widgets.TaTable.TotalTa, 'All faults'),
    noData: _t(translations.General.NoData, 'No data'), // default value
};

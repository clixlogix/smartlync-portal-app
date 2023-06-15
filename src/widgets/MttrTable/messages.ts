/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    mttrTableTitle: _t(translations.Widgets.MttrTable.WidgetTitle, 'MttrTable widget'), // default value
    mttrTableSubTitle: _t(translations.Widgets.MttrTable.SubTitle, 'A mttrTable widget'), // default value
    deviceNameOutlet: _t(translations.Widgets.MttrTable.TableDeviceName, 'DeviceName Output'),
    Event_Agnostic_Downtime: _t(translations.Widgets.MttrTable.TotalMttr, 'All faults'),
    noData: _t(translations.General.NoData, 'No data'), // default value
};

/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    ttrTableTitle: _t(translations.Widgets.TtrTable.WidgetTitle, 'TtrTable widget'), // default value
    ttrTableSubTitle: _t(translations.Widgets.TtrTable.SubTitle, 'A ttrTable widget'), // default value
    deviceNameOutlet: _t(translations.Widgets.TtrTable.TableDeviceName, 'DeviceName Output'),
    Event_Agnostic_Downtime: _t(translations.Widgets.TtrTable.TotalTtr, 'All faults'),
};

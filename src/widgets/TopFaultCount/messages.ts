/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    topFaultCountTitle: _t(translations.Widgets.TopFaultCount.Title, 'TopFaultCount widget'), // default value
    topFaultCountSubTitle: _t(translations.Widgets.TopFaultCount.SubTitle, 'A topFaultCount widget'), // default value
    tableColumnDeviceName: _t(translations.Widgets.TopFaultCount.TableColumnDeviceName, 'Device Name'),
    overAllResult: _t(translations.Widgets.TopFaultCount.TotalResult, 'Overall Result'),
};

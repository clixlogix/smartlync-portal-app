/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    taAnalysisTableTitle: _t(translations.Widgets.TaAnalysisTable.WidgetTitle, 'TaAnalysisTable widget'), // default value
    taAnalysisTableSubTitle: _t(translations.Widgets.TaAnalysisTable.SubTitle, 'A taAnalysisTable widget'), // default value
    tableDeviceName: _t(translations.Widgets.TaAnalysisTable.TableDeviceName, 'DeviceName Output / FaultCode'),
    tableTitle: _t(translations.Widgets.TaAnalysisTable.TableTitle, 'TA For Device Name & Output'),
};

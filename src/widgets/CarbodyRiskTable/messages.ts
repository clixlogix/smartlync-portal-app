/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    carBody: _t(translations.Widgets.CarBodyTable.TableColumnCarBodyID, 'CarBody ID'),
    total: _t(translations.Widgets.CarBodyTable.Total, 'Overall Risk'),
    studID: _t(translations.Widgets.CarBodyTable.StudID, 'Stud ID'),
    noData: _t(translations.ReportingViewPage.NoData, 'No Data to display'),
};
export default messages;

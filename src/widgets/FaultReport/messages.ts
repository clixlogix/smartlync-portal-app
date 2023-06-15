/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    faultReportTitle: _t(translations.Widgets.FaultReport.Title, 'Fault Report'),
    faultReportSubTitle: _t(translations.Widgets.FaultReport.SubTitle, 'A fault Report'),
    tableColumnStudType: _t(translations.ReportingViewPage.Table.StudType, 'Stud Type'),
    tableColumnDeviceName: _t(translations.ReportingViewPage.Table.DeviceName, 'Device Name'),
    tableColumnStudId: _t(translations.ReportingViewPage.Table.StudId, 'StudID'),
    datePlaceHolder: (view) => _t(translations.ReportingViewPage.DatePicker[view], '[Date]'),
    noData: _t(translations.ReportingViewPage.NoData, 'No Data to be displayed'),
};

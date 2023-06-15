/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    pageTitle: _t(translations.ReportingViewPage.PageTitle, 'Hubert Reporting view'),
    title: _t(translations.ReportingViewPage.PageTitle, 'Reporting view'),
    tableColumnStudType: _t(translations.ReportingViewPage.Table.StudType, 'Stud Type'),
    tableColumnDeviceName: _t(translations.ReportingViewPage.Table.DeviceName, 'Device Name'),
    tableColumnStudId: _t(translations.ReportingViewPage.Table.StudId, 'StudID'),
    datePlaceHolder: (view) => _t(translations.ReportingViewPage.DatePicker[view], '[Date]'),
    noData: _t(translations.ReportingViewPage.NoData, 'No Data to be displayed'),
    faultCountSum: _t(translations.ReportingViewPage.FaultCountSum, 'Fault Count Sum'),
    PDFTitle: _t(translations.ReportingViewPage.PDFTitle, 'Error Report'),
    PDFFileName: _t(translations.ReportingViewPageB.PDFFileName, 'Error_Report'),
    year: _t(translations.ReportingViewPageB.Year, 'Year'),
    week: _t(translations.ReportingViewPageB.Week, 'Week'),
    faultCode: _t(translations.Filters.FilterByFaultCodeLabel, 'Event Code'),
    expandTooltip: _t(translations.ReportingViewPageB.ExpandTooltip, 'Show \n Events Cycle Ratio & WOPs'),
    collapeTooltip: _t(translations.ReportingViewPageB.CollapeTooltip, 'Show \n Events Cycle Ratio & WOPs'),
    unitSwitchTooltip: _t(translations.ReportingViewPage.UnitSwitchToolTip, 'Event Rate in {{unit}}'),
};

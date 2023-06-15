/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    devicesFaultReportTitle: _t(translations.Widgets.DevicesFaultReport.Title, 'DevicesFaultReport widget'),
    devicesFaultReportSubTitle: _t(translations.Widgets.DevicesFaultReport.SubTitle, 'A devicesFaultReport widget'),
    pageTitle: _t(translations.ReportingViewPageB.PageTitle, 'Hubert Reporting view B'),
    title: _t(translations.ReportingViewPageB.PageTitle, 'Reporting view B'),
    weekDay: _t(translations.ReportingViewPageB.WeekDay, 'WeekDay'),
    all: _t(translations.ReportingViewPageB.All, 'All'),
    deviceName: _t(translations.ReportingViewPageB.DeviceName, 'Device Name'),
    thresholdLabel: _t(translations.Filters.FilterByReportThresholdLabel, 'Reporting Threshold'),
    thresholdRedMarkingNote: _t(
        translations.ReportingViewPageB.ThresholdRedMarkingNote,
        'Red marking for >= 50 errors per day',
    ),
    tableColumnFault: _t(translations.ReportingViewPageB.Table.Fault, 'Fault'),
    tableColumnDescription: _t(translations.ReportingViewPageB.Table.Description, 'Description'),
    overAllResult: _t(translations.ReportingViewPageB.OverAllResult, 'Overall Result'),
    faultAssignment: _t(translations.ReportingViewPageB.FaultAssignment, 'Fault assignment'),
    statusB: _t(translations.ReportingViewPageB.StatusB, 'Status B'),
    statusBVal: _t(translations.ReportingViewPageB.StatusBVal, 'Empty'),
    event: _t(translations.ReportingViewPageB.Event, 'Event'),
    eventVal: _t(translations.ReportingViewPageB.EventVal, 'Fault'),
    studType: _t(translations.ReportingViewPageB.StudType, 'Stud Type'),
    year: _t(translations.ReportingViewPageB.Year, 'Year'),
    week: _t(translations.ReportingViewPageB.Week, 'Week'),
    PDFTitle: _t(translations.ReportingViewPageB.PDFTitle, 'Daily Error Report'),
    PDFFileName: _t(translations.ReportingViewPageB.PDFFileName, 'Error_Report'),
    maintainance: _t(translations.ReportingViewPageB.Maintainance, 'Maintainance'),
    active: _t(translations.ReportingViewPageB.Active, 'Active'),
    datePlaceHolder: (view) => _t(translations.ReportingViewPage.DatePicker[view], '[Date]'),
    noData: _t(translations.ReportingViewPage.NoData, 'No Data to be displayed'),
};

/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    pageTitle: _t(translations.ReportingViewPageB.PageTitle, 'Hubert Reporting view filter panel'),
    title: _t(translations.ReportingViewPageB.PageTitle, 'Reporting view filter panel'),
    fileUpload: _t(translations.ReportingViewPageB.FileUpload, 'File Upload'),
    exportToExcel: _t(translations.ReportingViewPageB.ExportToExcel, 'Export To eXcel'),
    exportToPdf: _t(translations.ReportingViewPageB.ExportToPdf, 'Export To PDF'),
    faultAssignment: _t(translations.ReportingViewPageB.FaultAssignment, 'Fault assignment'),
    faultAssignmentVal: _t(translations.ReportingViewPageB.FaultAssignmentVal, 'Multiple elements '),
    statusB: _t(translations.ReportingViewPageB.StatusB, 'Status B'),
    statusBVal: _t(translations.ReportingViewPageB.StatusBVal, 'Empty'),
    event: _t(translations.ReportingViewPageB.Event, 'Event'),
    eventVal: _t(translations.ReportingViewPageB.EventVal, 'Fault'),
    selectFaultCode: _t(translations.ReportingViewPageB.SelectFaultCode, 'Select Fault #:'),
    filterByStudType: _t(translations.ReportingViewPageB.FilterByStudType, 'Filter By Stud Type'),
    filterByDeviceName: _t(translations.ReportingViewPageB.FilterByDeviceName, 'Filter By Device'),
    filterByFault: _t(translations.ReportingViewPageB.FilterByFault, 'Filter By Fault'),
    filterByStudID: _t(translations.ReportingViewPageB.FilterByStudID, 'Filter By Stud ID'),
    weekDay: _t(translations.ReportingViewPageB.WeekDay, 'WeekDay'),
    all: _t(translations.ReportingViewPageB.All, 'All'),
    deviceName: _t(translations.ReportingViewPageB.DeviceName, 'Device Name'),
    studType: _t(translations.ReportingViewPageB.StudType, 'Stud Type'),
    sunday: _t(translations.ReportingViewPageB.Sunday, 'Sunday'),
    monday: _t(translations.ReportingViewPageB.Monday, 'Monday'),
    tuesday: _t(translations.ReportingViewPageB.Tuesday, 'Tuesday'),
    wednesday: _t(translations.ReportingViewPageB.Wednesday, 'Wednesday'),
    thursday: _t(translations.ReportingViewPageB.Thursday, 'Thursday'),
    friday: _t(translations.ReportingViewPageB.Friday, 'Friday'),
    saturday: _t(translations.ReportingViewPageB.Saturday, 'Saturday'),
    fault: _t(translations.ReportingViewPageB.Fault, 'Fault'),
    info: _t(translations.ReportingViewPageB.Info, 'Info'),
    componentExchange: _t(translations.ReportingViewPageB.ComponentExchange, 'Component Exchange'),
    firmwareUpdate: _t(translations.ReportingViewPageB.FirmwareUpdate, 'Firmware Update'),
    maintainance: _t(translations.ReportingViewPageB.Maintainance, 'Maintainance'),
    active: _t(translations.ReportingViewPageB.Active, 'Active'),
    // @ts-ignore
    events: _t(translations.ReportingViewPageB.Events, []),
};

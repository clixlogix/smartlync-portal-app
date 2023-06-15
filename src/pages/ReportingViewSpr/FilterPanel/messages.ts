/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    pageTitle: _t(translations.ReportingViewPage.PageTitle, 'Hubert Reporting view filter panel'),
    title: _t(translations.ReportingViewPage.PageTitle, 'Reporting view filter panel'),
    fileUpload: _t(translations.ReportingViewPage.FileUpload, 'File Upload'),
    exportToExcel: _t(translations.ReportingViewPage.ExportToExcel, 'Export To eXcel'),
    exportToPdf: _t(translations.ReportingViewPage.ExportToPdf, 'Export To PDF'),
    faultAssignment: _t(translations.ReportingViewPage.FaultAssignment, 'Fault assignment'),
    faultAssignmentVal: _t(translations.ReportingViewPage.FaultAssignmentVal, 'Active'),
    statusB: _t(translations.ReportingViewPage.StatusB, 'Status B'),
    statusBVal: _t(translations.ReportingViewPage.StatusBVal, 'Empty'),
    event: _t(translations.ReportingViewPage.Event, 'Event'),
    eventVal: _t(translations.ReportingViewPage.EventVal, 'Fault'),
    filterByFaultCode: _t(translations.Filters.FilterByFaultCodeLabel, 'Event'),
    filterByStudType: _t(translations.Filters.FilterByStudTypeLabel, 'Stud Type'),
    filterByDeviceName: _t(translations.Filters.FilterByDeviceNameLabel, 'Device'),
    filterByStudID: _t(translations.Filters.FilterByStudIdLabel, 'Stud ID'),
    dataUptodate: _t(translations.ReportingViewPage.DataUptodate, 'Data is up to date. Last updated'),
};

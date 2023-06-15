/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    fleetExpandDeviceTableTitle: _t(
        translations.Widgets.FleetExpandDeviceTable.WidgetTitle,
        'FleetExpandDeviceTable widget',
    ), // default value
    fleetExpandDeviceTableSubTitle: _t(
        translations.Widgets.FleetExpandDeviceTable.SubTitle,
        'A fleetExpandDeviceTable widget',
    ), // default value
    tableColumnFault: _t(translations.ReportingViewPageB.Table.Fault, 'Fault'),
    tableColumnDescription: _t(translations.ReportingViewPageB.Table.Description, 'Description'),
    year: _t(translations.ReportingViewPageB.Year, 'Year'),
    week: _t(translations.ReportingViewPageB.Week, 'Week'),
    noData: _t(translations.ReportingViewPage.NoData, 'No Data to be displayed'),
};

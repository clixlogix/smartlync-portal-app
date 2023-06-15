/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantAppNavBarTitle: _t(translations.Widgets.PlantAppNavBar.WidgetTitle, 'PlantAppNavBar widget'),
    plantAppNavBarSubTitle: _t(translations.Widgets.PlantAppNavBar.SubTitle, 'A plantAppNavBar widget'),
    navBarTitle: _t(translations.PlantOverview.NavBarTitle, 'APPs'),
    maintenanceTitle: _t(translations.PlantOverview.MaintenanceTitle, 'Reporting'),
    maintenanceSubTitle: _t(translations.PlantOverview.MaintenanceSubTitle, 'Maintenance Analysis'),
    systemTitle: _t(translations.PlantOverview.SystemTitle, 'System Health'),
    systemSubTitle: _t(translations.PlantOverview.SystemSubTitle, 'System Health Analytics'),
    uploadTitle: _t(translations.PlantOverview.UploadTitle, 'Upload'),
    uploadSubTitle: _t(translations.PlantOverview.UploadSubTitle, 'File Upload'),
    rcaTitle: _t(translations.PlantOverview.RootCauseAnalysisTitle, 'Root Cause Analysis'),
    rcaSubTitle: _t(translations.PlantOverview.RootCauseAnalysisSubTitle, 'Root Cause Analysis'),
};

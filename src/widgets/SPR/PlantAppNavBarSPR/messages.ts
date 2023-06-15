/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantAppNavBarSprTitle: _t(translations.Widgets.PlantAppNavBarSpr.WidgetTitle, 'PlantAppNavBarSpr widget'), // default value
    plantAppNavBarSprSubTitle: _t(translations.Widgets.PlantAppNavBarSpr.SubTitle, 'A plantAppNavBarSpr widget'), // default value
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

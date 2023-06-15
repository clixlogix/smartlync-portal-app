/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    navBarTitle: _t(translations.PlantOverview.NavBarTitle, 'Applications'), // default value
    maintenanceTitle: _t(translations.PlantOverview.MaintenanceTitle, 'Maintenance Analysis'), // default value
    maintenanceSubTitle: _t(translations.PlantOverview.MaintenanceSubTitle, 'Maintenance Analysis'), // default value
    systemTitle: _t(translations.PlantOverview.SystemTitle, 'System Health'), // default value
    systemSubTitle: _t(translations.PlantOverview.SystemSubTitle, 'System Health Analytics'), // default value
    uploadTitle: _t(translations.PlantOverview.UploadTitle, 'Upload'), // default value
    uploadSubTitle: _t(translations.PlantOverview.UploadSubTitle, 'File Upload'), // default value
};

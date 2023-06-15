/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    fileUploadPageTitle: _t(translations?.FileUpload?.PageTitle, 'Upload View'), // default value
    fileUploadTitle: _t(translations?.FileUpload?.Title, 'Upload View'), // default value
    dropzoneText: _t(translations?.FileUpload?.DropzoneText, 'Drag & drop files or Browse'),
    cyclesLabel: _t(translations?.FileUpload?.UploadCyclesLabel, 'Upload Measurement/Cycle File(s)'),
    sytemEventsLabel: _t(translations?.FileUpload?.UploadSytemEventsLabel, 'Upload System Events File(s)'),
    maintenanceLabel: _t(translations?.FileUpload?.UploadMaintenanceLabel, 'Upload Maintence File(s)'),
    back: _t(translations?.FileUpload?.Back, 'Back'),
    finish: _t(translations?.FileUpload?.Finish, 'Finish'),
};

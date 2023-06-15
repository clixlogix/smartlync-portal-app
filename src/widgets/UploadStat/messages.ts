/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    uploadStatTitle: _t(translations.Widgets.UploadStat.WidgetTitle, 'UploadStat widget'),
    uploadStatSubTitle: _t(translations.Widgets.UploadStat.SubTitle, 'A uploadStat widget'),
    uploadTimeLabel: _t(translations.Widgets.UploadStat.UploadTimeLabel, 'Upload Time'),
    fileSizeLabel: _t(translations.Widgets.UploadStat.FileSizeLabel, 'Total Size'),
    numberOfFilesLabel: _t(translations.Widgets.UploadStat.NumberOfFilesLabel, 'Number of Files'),
    fileNamesLabel: _t(translations.Widgets.UploadStat.FileNamesLabel, 'Filenames'),
};

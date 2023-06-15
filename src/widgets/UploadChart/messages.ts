/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    uploadChartTitle: _t(translations.Widgets.UploadChart.WidgetTitle, 'UploadChart widget'),
    uploadChartSubTitle: _t(translations.Widgets.UploadChart.SubTitle, 'A uploadChart widget'),
    uploadSizeLabel: _t(translations.Widgets.UploadChart.UploadSizeLabel, 'Upload Size'),
    numberOfFilesUploadedLabel: _t(
        translations.Widgets.UploadChart.NumberOfFilesUploadedLabel,
        'Number Of Files Uploaded',
    ),
};

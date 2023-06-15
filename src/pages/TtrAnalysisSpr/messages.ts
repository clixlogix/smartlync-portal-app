/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    ttrAnalysisSprPageTitle: _t(translations.TtrAnalysisSpr.PageTitle, 'TtrAnalysisSpr '), // default value
    ttrAnalysisSprTitle: _t(translations.TtrAnalysisSpr.Title, 'TtrAnalysisSpr '), // default value
};

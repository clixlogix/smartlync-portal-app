/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    taAnalysisPageTitle: _t(translations.TaAnalysis.PageTitle, 'Technical Availability Analysis '), // default value
    taAnalysisTitle: _t(translations.TaAnalysis.Title, 'Technical Availability Analysis '), // default value
    datePlaceHolder: (view) => _t(translations.ReportingViewPage.DatePicker[view], '[Date]'),
};

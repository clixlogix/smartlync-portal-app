/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    varianceAnalysisTitle: _t(translations.Widgets.VarianceAnalysis.Title, 'VarianceAnalysis widget'), // default value
    varianceAnalysisSubTitle: _t(translations.Widgets.VarianceAnalysis.SubTitle, 'A varianceAnalysis widget'), // default value
};

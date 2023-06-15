/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    essentialControlChartPageTitle: _t(translations.EssentialControlChart.PageTitle, 'Essential Control Charts '), // default value
    essentialControlChartTitle: _t(translations.EssentialControlChart.Title, 'Essential Control Charts '), // default value
    layout: _t(translations.General.LayoutLabel, 'Layout '),
};

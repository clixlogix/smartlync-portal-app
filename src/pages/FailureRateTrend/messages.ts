/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    failureRateTrendPageTitle: _t(translations.FailureRateTrend.PageTitle, 'Failure Rate Trend '),
    failureRateTrendTitle: _t(translations.FailureRateTrend.Title, 'Failure Rate Trend '),
    layout: _t(translations.General.LayoutLabel, 'Layout '),
};

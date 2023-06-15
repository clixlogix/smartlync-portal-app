/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    processLogViewSprPageTitle: _t(translations.ProcessLogViewSpr.PageTitle, 'ProcessLogViewSpr '), // default value
    processLogViewSprTitle: _t(translations.ProcessLogViewSpr.Title, 'ProcessLogViewSpr '), // default value
    processLogViewDateFilterBarBtn: _t(translations.ProcessLogView.BtnBarDateFilter, 'Historical'),
};

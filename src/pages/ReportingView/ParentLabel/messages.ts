/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    // someThing: _t(translations.someThing,'default value'),

    year: _t(translations.ReportingViewPage.ParentLabelPage.Year, 'Year'),
    week: _t(translations.ReportingViewPage.ParentLabelPage.Week, 'Week'),
    day: _t(translations.ReportingViewPage.ParentLabelPage.Day, 'Day'),
    hour: _t(translations.ReportingViewPage.ParentLabelPage.Hour, 'Hour'),
};

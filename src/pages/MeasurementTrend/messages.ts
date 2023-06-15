/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    measurementTrendPageTitle: _t(translations.MeasurementTrend.PageTitle, 'Measurement Trend '), // default value
    measurementTrendTitle: _t(translations.MeasurementTrend.Title, 'Measurement Trend '), // default value
    layout: _t(translations.General.LayoutLabel, 'Layout '),
};

/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    dropTimeMeasurementTrendTitle: _t(
        translations.Widgets.DropTimeMeasurementTrend.WidgetTitle,
        'DropTimeMeasurementTrend widget',
    ), // default value
    dropTimeMeasurementTrendSubTitle: _t(
        translations.Widgets.DropTimeMeasurementTrend.SubTitle,
        'A dropTimeMeasurementTrend widget',
    ),
    dropTimeRate: _t(translations.Widgets.DropTimeMeasurementTrend.DropTimeRate, 'Drop Time Rate (deviation average)'),
};

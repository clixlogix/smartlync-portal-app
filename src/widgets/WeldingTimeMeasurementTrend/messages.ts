/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    weldingTimeMeasurementTrendTitle: _t(
        translations.Widgets.WeldingTimeMeasurementTrend.WidgetTitle,
        'WeldingTimeMeasurementTrend widget',
    ), // default value
    weldingTimeMeasurementTrendSubTitle: _t(
        translations.Widgets.WeldingTimeMeasurementTrend.SubTitle,
        'A weldingTimeMeasurementTrend widget',
    ), // default value
    weldingTime: _t(translations.Widgets.WeldingTimeMeasurementTrend.WeldingTime, 'Welding time (deviation average)'),
};

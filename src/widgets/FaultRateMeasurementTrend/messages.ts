/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    faultRateMeasurementTrendTitle: _t(
        translations.Widgets.FaultRateMeasurementTrend.WidgetTitle,
        'FaultRateMeasurementTrend widget',
    ), // default value
    faultRateMeasurementTrendSubTitle: _t(
        translations.Widgets.FaultRateMeasurementTrend.SubTitle,
        'A faultRateMeasurementTrend widget',
    ),
    faultRate: _t(translations.Widgets.FaultRateMeasurementTrend.FaultRate, 'Fault Rate'),
};

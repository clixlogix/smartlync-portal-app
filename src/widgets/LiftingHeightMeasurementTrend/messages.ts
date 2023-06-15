/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    liftingHeightMeasurementTrendTitle: _t(
        translations.Widgets.LiftingHeightMeasurementTrend.WidgetTitle,
        'LiftingHeightMeasurementTrend widget',
    ),
    liftingHeightMeasurementTrendSubTitle: _t(
        translations.Widgets.LiftingHeightMeasurementTrend.SubTitle,
        'A liftingHeightMeasurementTrend widget',
    ),
    liftingHeight: _t(
        translations.Widgets.LiftingHeightMeasurementTrend.LiftingHeight,
        'Lifting height (deviation average)',
    ),
};

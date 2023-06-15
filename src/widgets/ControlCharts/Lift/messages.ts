/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    liftTitle: _t(translations.Widgets.Lift.WidgetTitle, 'Lift'), // default value
    liftSubTitle: _t(translations.Widgets.Lift.SubTitle, 'A lift widget'), // default value
    yAxisTitle: _t(translations.Widgets.Lift.YAxisTitle, 'Lift (mm)'), // default value
    maximum: _t(translations.Widgets.Lift.Maximum, 'Maximum'), // default value
    minimum: _t(translations.Widgets.Lift.Minimum, 'Minimum'), // default value
    actual: _t(translations.Widgets.Lift.Actual, 'Actual'), // default value
};

/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    essentialControlWidgetsTitle: _t(
        translations.Widgets.EssentialControlWidgets.WidgetTitle,
        'EssentialControlWidgets widget',
    ), // default value
    essentialControlWidgetsSubTitle: _t(
        translations.Widgets.EssentialControlWidgets.SubTitle,
        'A essentialControlWidgets widget',
    ), // default value
    penetrationTitle: _t(translations.Widgets.Penetration.WidgetTitle, 'Penetration widget'), // default value
    penetrationSubTitle: _t(translations.Widgets.Penetration.SubTitle, 'A penetration widget'), // default value
    yAxisTitle: _t(translations.Widgets.Penetration.YAxisTitle, 'Penetration (mm)'), // default value
    maximum: _t(translations.Widgets.Penetration.Maximum, 'Maximum'), // default value
    minimum: _t(translations.Widgets.Penetration.Minimum, 'Minimum'), // default value
    actual: _t(translations.Widgets.Penetration.Actual, 'Actual'), // default value
};

/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    weldTimeTitle: _t(translations.Widgets.WeldTime.WidgetTitle, 'WeldTime widget'), // default value
    weldTimeSubTitle: _t(translations.Widgets.WeldTime.SubTitle, 'A weldTime widget'), // default value
    yAxisTitle: _t(translations.Widgets.WeldTime.YAxisTitle, 'Time (ms)'), // default value
    maximum: _t(translations.Widgets.WeldTime.Maximum, 'Maximum'), // default value
    minimum: _t(translations.Widgets.WeldTime.Minimum, 'Minimum'), // default value
    actual: _t(translations.Widgets.WeldTime.Actual, 'Actual'), // default value
};

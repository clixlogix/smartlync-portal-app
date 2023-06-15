/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    voltageTitle: _t(translations.Widgets.Voltage.WidgetTitle, 'Voltage widget'), // default value
    voltageSubTitle: _t(translations.Widgets.Voltage.SubTitle, 'A voltage widget'), // default value
    yAxisTitle: _t(translations.Widgets.Voltage.YAxisTitle, 'Voltage (V)'), // default value
    maximum: _t(translations.Widgets.Voltage.Maximum, 'Maximum'), // default value
    minimum: _t(translations.Widgets.Voltage.Minimum, 'Minimum'), // default value
    actual: _t(translations.Widgets.Voltage.Actual, 'Actual'), // default value
};

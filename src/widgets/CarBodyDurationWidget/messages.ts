/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    carBodyDurationWidgetTitle: _t(
        translations.Widgets.CarBodyDurationWidget.WidgetTitle,
        'CarBodyDurationWidget widget',
    ), // default value
    carBodyDurationWidgetSubTitle: _t(
        translations.Widgets.CarBodyDurationWidget.SubTitle,
        'A carBodyDurationWidget widget',
    ), // default value
};

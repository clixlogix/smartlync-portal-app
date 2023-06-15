/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    faultsPerDeviceHistogramWidgetSprTitle: _t(
        translations.Widgets.FaultsPerDeviceHistogramSpr.WidgetTitle,
        'FaultsPerDeviceHistogramWidgetSpr widget',
    ), // default value
    faultsPerDeviceHistogramWidgetSprSubTitle: _t(
        translations.Widgets.FaultsPerDeviceHistogramSpr.SubTitle,
        'A faultsPerDeviceHistogramWidgetSpr widget',
    ), // default value
    xAxisTitle: _t(translations.Widgets.FaultsPerDeviceHistogramSpr.xAxisTitle, ''),
    yAxisTitle: _t(translations.Widgets.FaultsPerDeviceHistogramSpr.yAxisTitle, ''),
};

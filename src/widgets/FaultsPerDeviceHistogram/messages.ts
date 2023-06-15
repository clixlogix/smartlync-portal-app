/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    faultsPerDeviceHistogramTitle: _t(
        translations.Widgets.FaultsPerDeviceHistogram.WidgetTitle,
        'FaultsPerDeviceHistogram widget',
    ), // default value
    faultsPerDeviceHistogramSubTitle: _t(
        translations.Widgets.FaultsPerDeviceHistogram.SubTitle,
        'A faultsPerDeviceHistogram widget',
    ), // default value
    xAxisTitle: _t(translations.Widgets.FaultsPerDeviceHistogram.xAxisTitle, ''),
    yAxisTitle: _t(translations.Widgets.FaultsPerDeviceHistogram.yAxisTitle, ''),
};

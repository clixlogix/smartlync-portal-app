/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantDeviceByDurationTitle: _t(
        translations.Widgets.PlantDeviceByDuration.WidgetTitle,
        'PlantDeviceByDuration widget',
    ), // default value
    plantDeviceByDurationSubTitle: _t(
        translations.Widgets.PlantDeviceByDuration.SubTitle,
        'A plantDeviceByDuration widget',
    ), // default value
    faultByDuration: _t(translations.PlantOverview.DeviceByDuration, 'Top 10 Devices with Longest Duration'),
    fault: _t(translations.PlantOverview.Fault, 'Fault'),
    duration: _t(translations.PlantOverview.Duration, 'Duration (mins)'),
    position: _t(translations.PlantOverview.Position, 'Position'),
    system: _t(translations.PlantOverview.System, 'System'),
    percentageChange: _t(translations.PlantOverview.PercentageChange, '% Change'),
};

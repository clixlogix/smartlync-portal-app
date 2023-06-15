/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantFaultByDevicesTitle: _t(translations.Widgets.PlantFaultByDevices.WidgetTitle, 'PlantFaultByDevices widget'),
    plantFaultByDevicesSubTitle: _t(translations.Widgets.PlantFaultByDevices.SubTitle, 'A plantFaultByDevices widget'),
    systemWithFaults: _t(translations.PlantOverview.SystemWithFaults, 'Top 10 Devices with Highest Fault Occurrence'),
    fault: _t(translations.PlantOverview.Fault, 'Fault'),
    ratio: _t(translations.PlantOverview.Ratio, 'Ratio'),
    cycle: _t(translations.PlantOverview.Cycle, 'Cycle'),
    system: _t(translations.PlantOverview.System, 'System'),
    position: _t(translations.PlantOverview.Position, 'Position'),
    percentageChange: _t(translations.PlantOverview.PercentageChange, '% Change'),
};

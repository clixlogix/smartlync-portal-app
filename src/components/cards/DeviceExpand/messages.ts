/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    deviceName: _t(translations.Components.DeviceExpand.deviceName, 'Device Name'),
    health: _t(translations.Components.DeviceExpand.health, 'Health'),
    cycles: _t(translations.Components.DeviceExpand.cycles, 'CYCLES'),
    faults: _t(translations.Components.DeviceExpand.faults, 'FAULTS'),
    mtbf: _t(translations.Components.DeviceExpand.mtbf, 'MTBF'),
    mttr: _t(translations.Components.DeviceExpand.mttr, 'MTTR'),
    ta: _t(translations.Components.DeviceExpand.ta, 'TA'),
};

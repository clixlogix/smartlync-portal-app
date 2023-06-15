/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    program: _t(translations.Program.TableColumns.Program, 'Program'),
    devices: _t(translations.Program.TableColumns.Devices, 'Devices'),
    schedule: _t(translations.Program.TableColumns.Schedule, 'Schedule'),
    outlet: _t(translations.Program.TableColumns.Outlet, 'Outlet'),
    feeder: _t(translations.Program.TableColumns.Feeder, 'Feeder'),
    tool: _t(translations.Program.TableColumns.Tool, 'Tool'),
    station: _t(translations.Program.TableColumns.Station, 'Station'),
    lastModifiedBy: _t(translations.Program.TableColumns.LastModifiedBy, 'Last Modified By'),
    lastUpdated: _t(translations.Program.TableColumns.LastUpdated, 'Last Updated'),
};

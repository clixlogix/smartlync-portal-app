/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    fleetOverviewPageTitle: _t(translations.FleetOverview.PageTitle, 'FleetOverview '), // default value
    fleetOverviewTitle: _t(translations.FleetOverview.Title, 'Fleet Overview '), // default value
    allDevices: _t(translations.FleetOverview.AllDevices, 'ALL DEVICES '), // default value
    pinnedDevices: _t(translations.FleetOverview.PinnedDevices, 'PINNED DEVICES '), // default value
    noData: _t(translations.General.NoData, 'No data to display'), // default value
};

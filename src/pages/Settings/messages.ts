/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    settingsPageTitle: _t(translations.SettingsPage.PageTitle, 'Settings '), // default value
    settingsTitle: _t(translations.SettingsPage.PageTitle, 'Settings '), // default value
    settingsOperation: _t(translations.SettingsPage.Operation, 'Operation '),
    addNew: _t(translations.SettingsPage.AddNew, 'Add New'),
    shifts: _t(translations.SettingsPage.Shifts, 'Shifts'),
    breaks: _t(translations.SettingsPage.Breaks, 'Breaks'),
    shiftName: _t(translations.SettingsPage.ShiftName, 'Shift name'),
    breakName: _t(translations.SettingsPage.BreakName, 'Break name'),
    timeFrom: _t(translations.SettingsPage.TimeFrom, 'Time from'),
    timeTo: _t(translations.SettingsPage.TimeTo, 'Time to'),
    dateFrom: _t(translations.SettingsPage.DateFrom, 'Date from'),
    dateTo: _t(translations.SettingsPage.DateTo, 'Date to'),
    delete: _t(translations.SettingsPage.Delete, 'delete'),
    edit: _t(translations.SettingsPage.Edit, 'edit'),
    actions: _t(translations.SettingsPage.Actions, 'Actions'),
};

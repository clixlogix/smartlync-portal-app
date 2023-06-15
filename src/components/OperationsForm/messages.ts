/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    addNew: _t(translations.Components.OperationsForm.AddNew, 'Settings '),
    shift: _t(translations.Components.OperationsForm.Shift, 'Shift '),
    break: _t(translations.Components.OperationsForm.Break, 'Break '),
    time: _t(translations.Components.OperationsForm.Time, 'Time '),
    to: _t(translations.Components.OperationsForm.To, 'To '),
    date: _t(translations.Components.OperationsForm.Date, 'Date '),
    cancel: _t(translations.Components.OperationsForm.Cancel, 'Cancel '),
    add: _t(translations.Components.OperationsForm.Add, 'Add '),
    hour: _t(translations.Components.OperationsForm.Hour, 'Add '),
    minutes: _t(translations.Components.OperationsForm.Minutes, 'Add '),
    edit: _t(translations.SettingsPage.Edit, 'edit'),
};

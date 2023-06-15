/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    programPageTitle: _t(translations.Program.PageTitle, 'Program '), // default value
    programTitle: _t(translations.Program.Title, 'Program '), // default value,
    submitChangeButton: _t(translations.Program.SubmitChangeButton, 'SUBMIT CHNAGE'),
    cancelButton: _t(translations.Program.CancelButton, 'CANCEL'),
    submittedChangeModalTitle: _t(
        translations.Program.ProgramSubmittedChangeModal.Title,
        'Changes Submitted for approval',
    ),
};

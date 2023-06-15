import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    title: _t(translations.Program.ProgramSubmitChangeModal.Title, 'Confirm Changes'),
    subTitle: _t(
        translations.Program.ProgramSubmitChangeModal.SubTitle,
        'You have made changes to the following parameters',
    ),
    previous: _t(translations.Program.ProgramSubmitChangeModal.TableColumns.Previous, 'PREVIOUS'),
    proposed: _t(translations.Program.ProgramSubmitChangeModal.TableColumns.Proposed, 'PROPOSED'),
    additionalDetailTitle: _t(
        translations.Program.ProgramSubmitChangeModal.AdditionalDetail.Title,
        'Please provide any additional details below.',
    ),
    additionalDetailPLaceholder: _t(
        translations.Program.ProgramSubmitChangeModal.AdditionalDetail.Placeholder,
        'Type description here',
    ),
    submitButton: _t(translations.Program.ProgramSubmitChangeModal.ActionableButtons.Submit, 'SUBMIT FOR APPROVAL'),
    cancelButton: _t(translations.Program.ProgramSubmitChangeModal.ActionableButtons.Cancel, 'CANCEL'),
    passwordChangeButton: _t(
        translations.Program.ProgramSubmitChangeModal.ActionableButtons.PasswordChange,
        'PASSWORD OVERRIDE',
    ),
    submittedChangeModalTitle: _t(
        translations.Program.ProgramSubmittedChangeModal.Title,
        'Changes Submitted for approval',
    ),
    submittedChangeModalParamChangeTitle: _t(
        translations.Program.ProgramSubmittedChangeModal.TitleParameterChange,
        'Parameter change pushed',
    ),
    closeButton: _t(translations.Program.ProgramSubmittedChangeModal.CloseButton, 'CLOSE'),
    passwordOverrideTitle: _t(translations.Program.ProgramPasswordOverrideModal.Title, 'Enter admin password'),
    applyButton: _t(translations.Program.ProgramPasswordOverrideModal.ApplyButton, 'APPLY CHANGES'),
    passwordOverrideInputPlaceholder: _t(
        translations.Program.ProgramPasswordOverrideModal.TextfieldPlaceholder,
        'Please enter the administrative password to apply changes',
    ),
};

/**
 *
 * ProgramSubmitChangeModal
 *
 */
import { memo, useState } from 'react';
import { useTranslation, TFunction } from 'react-i18next';
import omit from 'lodash/omit';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import withStyles from '@mui/styles/withStyles';
//import { useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import get from 'lodash/get';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import DialogContentText from '@mui/material/DialogContentText';
// import Input from '@mui/material/Input';
// import InputAdornment from '@mui/material/InputAdornment';
// import FormHelperText from '@mui/material/FormHelperText';
// import FormControl from '@mui/material/FormControl';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

//import { programActions } from 'services/program/program-reducer';
import {
    ProgramParameter as ProgramParameterType,
    // ProgramParameterDetail as ProgramParameterDetailType,
    EditedProgramParameter,
} from 'models';
import { messages } from './messages';

interface Props {
    className?: string;
    data: ProgramParameterType | {};
    programName: string;
    isEditMode: boolean;
    editedParameter: EditedProgramParameter;
    submitChangeModelOpen: boolean;
    setSubmitChangeModalOpen: (modalState: boolean) => void;
    setIsSubmittedForApproval: (aprrovalState: boolean) => void;
    isSubmittedForApproval: boolean;
    setIsPasswordOverrideModalOpen: (modalState: boolean) => void;
    isPasswordOverrideModalOpen: boolean;
    successActionTitle: string;
    setSuccessActionTitle: (title: string) => void;
}

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

const headCells = (t: TFunction): readonly HeadCell[] => [
    {
        id: 'previous',
        numeric: false,
        disablePadding: true,
        label: t(messages.previous),
    },
    {
        id: 'Proposed',
        numeric: false,
        disablePadding: false,
        label: t(messages.proposed),
    },
];
const primary = '#FFDB0A';
const StyledTextField = withStyles(() => ({
    root: {},
}))(TextField);

const StyledButton = withStyles(() => ({
    root: {
        color: primary,
    },
}))(Button);

const StyledContainedButton = withStyles((theme) => {
    return {
        root: {
            backgroundColor: primary,
            color: '#000',
            '&:hover': {
                backgroundColor: primary,
            },
            height: 30,
        },
    };
})(Button);

interface PasswordState {
    password: string;
    showPassword: boolean;
    error: string;
}

export const ProgramSubmitChangeModal = memo((props: Props) => {
    const {
        data,
        editedParameter,
        submitChangeModelOpen,
        setSubmitChangeModalOpen,
        isSubmittedForApproval,
        setIsSubmittedForApproval,
        isPasswordOverrideModalOpen,
        setIsPasswordOverrideModalOpen,
        successActionTitle,
        setSuccessActionTitle,
    } = props;
    const { t } = useTranslation();
    //const dispatch = useDispatch();

    const [passwordData, setPasswordData] = useState<PasswordState>({
        password: '',
        showPassword: false,
        error: '',
    });

    const { data: editedParamData, editedFields /*isSaved*/ } = editedParameter;
    const pData = omit(data, 'id');

    const handleSubmitForApprovalButtonClick = () => {
        setSubmitChangeModalOpen(false);
        setIsSubmittedForApproval(true);
    };

    const handlePasswordChange = (prop: keyof PasswordState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [prop]: event.target.value });
    };

    // const handleClickShowPassword = () => {
    //     setPasswordData({
    //         ...passwordData,
    //         showPassword: !passwordData.showPassword,
    //     });
    // };

    // const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     event.preventDefault();
    // };
    const handleApplyChangesButtonClick = () => {
        setSubmitChangeModalOpen(false);
        setIsPasswordOverrideModalOpen(false);
        setIsSubmittedForApproval(true);
    };
    const handlePasswordChangeButtonClick = () => {
        setIsPasswordOverrideModalOpen(true);
        setSuccessActionTitle(t(messages.submittedChangeModalParamChangeTitle));
    };
    const handleConfirmChangeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {};
    const renderActionSuccessDialog = () => (
        <Dialog
            className="dialog"
            PaperProps={{
                style: {
                    backgroundColor: '#1e1e1e',
                    width: 600,
                },
            }}
            open={isSubmittedForApproval}
            onClose={() => setIsSubmittedForApproval(false)}
        >
            <DialogTitle style={{ fontSize: 24, color: '#fff', textAlign: 'center' }}>{successActionTitle}</DialogTitle>
            <DialogContent sx={{ justifyContent: 'center', display: 'flex' }}>
                <CheckCircleIcon color="success" style={{ fontSize: '67px' }} className="edit-icon" />
            </DialogContent>
            <DialogActions>
                <StyledButton variant="text" onClick={() => setIsSubmittedForApproval(false)}>
                    {t(messages.closeButton)}
                </StyledButton>
            </DialogActions>
        </Dialog>
    );
    return (
        <div className="x-cls-program-submit-change-Modal">
            <Dialog
                className="dialog"
                PaperProps={{
                    style: {
                        backgroundColor: '#1e1e1e',
                        width: 600,
                    },
                }}
                open={submitChangeModelOpen}
                onClose={() => setSubmitChangeModalOpen(false)}
            >
                <DialogTitle id="modal-modal-title">{t(messages.title)}</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle2" component="div">
                        {t(messages.subTitle)}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2} mt={1}>
                            {headCells(t).map((headCell) => (
                                <Grid item xs={6} key={headCell.id}>
                                    <Typography component="div" variant="subtitle2">
                                        {headCell.label}
                                    </Typography>
                                </Grid>
                            ))}
                            {(editedFields || []).map((editedField: keyof ProgramParameterType) => {
                                const itemStyle = { display: 'flex', alignItems: 'center' };
                                const emptyData = '--';
                                return (
                                    <>
                                        <Grid item container xs={6} sx={itemStyle}>
                                            <Box mr={2} flex={2}>
                                                <Typography component={'div'} variant="subtitle2">
                                                    {editedField}
                                                </Typography>
                                            </Box>
                                            <Box mr={2} flex={1}>
                                                <Chip
                                                    className="td-chip"
                                                    label={`Min ${get(pData, [editedField, 'minimum']) || emptyData}`}
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            </Box>
                                            <Box mr={2} flex={1}>
                                                <Chip
                                                    color="primary"
                                                    className="td-chip"
                                                    label={`Max ${get(pData, [editedField, 'maximum']) || emptyData}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6} sx={itemStyle}>
                                            <Box mr={2} flex={2}>
                                                <Typography component="div" variant="subtitle2">
                                                    {editedField}
                                                </Typography>
                                            </Box>
                                            <Box mr={2} flex={1}>
                                                <Chip
                                                    color="primary"
                                                    className="td-chip"
                                                    label={`Min ${
                                                        get(editedParamData, [editedField, 'minimum']) || emptyData
                                                    }`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                            <Box mr={2} flex={1}>
                                                <Chip
                                                    color="primary"
                                                    className="td-chip"
                                                    label={`Max ${
                                                        get(editedParamData, [editedField, 'maximum']) || emptyData
                                                    }`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Grid>
                                    </>
                                );
                            })}
                        </Grid>
                    </Box>
                    <Box mt={2}>
                        <Typography component="div" variant="subtitle2">
                            {t(messages.additionalDetailTitle)}
                        </Typography>
                    </Box>

                    <StyledTextField
                        autoComplete="off"
                        margin="dense"
                        variant="standard"
                        placeholder={t(messages.additionalDetailPLaceholder)}
                        fullWidth
                        InputProps={{
                            style: { color: '#fff' },
                        }}
                        // color="primary"
                        onChange={handleConfirmChangeInputChange}
                        //value={confirmChangeInput}
                    />
                </DialogContent>
                <DialogActions>
                    <Grid container spacing={3} display="flex">
                        <Grid item flex={1}>
                            <StyledButton variant="text" onClick={handleSubmitForApprovalButtonClick}>
                                {t(messages.submitButton)}
                            </StyledButton>
                            <StyledButton variant="text" onClick={() => setSubmitChangeModalOpen(false)}>
                                {t(messages.cancelButton)}
                            </StyledButton>
                        </Grid>
                        <Grid item>
                            <StyledContainedButton variant="text" onClick={handlePasswordChangeButtonClick}>
                                {t(messages.passwordChangeButton)}
                            </StyledContainedButton>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <Dialog
                className="dialog"
                PaperProps={{
                    style: {
                        backgroundColor: '#1e1e1e',
                        width: 600,
                    },
                }}
                open={isPasswordOverrideModalOpen}
                onClose={() => setIsPasswordOverrideModalOpen(false)}
            >
                <Box style={{ color: '#FFFFFF8F', display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        aria-label="admin-password-back"
                        onClick={() => setIsPasswordOverrideModalOpen(false)}
                        size="large"
                    >
                        <ArrowBackIcon fontSize="medium" color="inherit" />
                    </IconButton>
                    <DialogTitle color="inherit" style={{ fontSize: 24, color: '#fff' }}>
                        {t(messages.passwordOverrideTitle)}
                    </DialogTitle>
                </Box>
                <Divider style={{ background: '#242424' }} />
                <DialogContent>
                    <DialogContentText>{t(messages.passwordOverrideInputPlaceholder)}</DialogContentText>
                    <StyledTextField
                        autoComplete="off"
                        margin="dense"
                        variant="standard"
                        type="password"
                        value={passwordData.password}
                        onChange={handlePasswordChange('password')}
                        fullWidth
                        //placeholder="Password"
                        InputProps={{
                            style: { color: '#fff' },
                        }}
                    />
                    {/* <StyledInput
                        id="standard-adornment-password"
                        type={passwordData.showPassword ? 'text' : 'password'}
                        value={passwordData.password}
                        onChange={handlePasswordChange('password')}
                        fullWidth
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {passwordData.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    /> */}
                </DialogContent>
                <DialogActions>
                    <StyledButton variant="text" onClick={() => setIsPasswordOverrideModalOpen(false)}>
                        {t(messages.cancelButton)}
                    </StyledButton>
                    <StyledContainedButton onClick={handleApplyChangesButtonClick}>
                        {t(messages.applyButton)}
                    </StyledContainedButton>
                </DialogActions>
            </Dialog>
            {renderActionSuccessDialog()}
        </div>
    );
});

export default ProgramSubmitChangeModal;

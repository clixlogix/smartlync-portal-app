/**
 *
 * ProgramParameter
 *
 */
import { memo, ChangeEvent } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTranslation, TFunction } from 'react-i18next';
import keys from 'lodash/keys';
import omit from 'lodash/omit';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import withStyles from '@mui/styles/withStyles';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';

import { programActions } from 'services/program/program-reducer';
import {
    ProgramParameter as ProgramParameterType,
    ProgramParameterDetail as ProgramParameterDetailType,
    EditedProgramParameter,
} from 'models';
import { messages } from './messages';

import 'scss/main.scss';
import './ProgramParameter.scss';

interface Props {
    className?: string;
    data: ProgramParameterType | {};
    programName: string;
    isEditMode: boolean;
    editedParameter: EditedProgramParameter;
}

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    align: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

const headCells = (t: TFunction): readonly HeadCell[] => [
    {
        id: 'parameter',
        numeric: false,
        disablePadding: true,
        label: t(messages.parameter),
        align: 'left',
    },
    {
        id: 'reference',
        numeric: false,
        disablePadding: false,
        label: t(messages.reference),
        align: 'right',
    },
    {
        id: 'minimum',
        numeric: false,
        disablePadding: false,
        label: t(messages.minimum),
        align: 'right',
    },
    {
        id: 'maximum',
        numeric: true,
        disablePadding: false,
        label: t(messages.maximum),
        align: 'right',
    },
];
const primary = '#FFDB0A';
const StyledTextField = withStyles((theme) => ({
    root: {},
}))(TextField);

export const ProgramParameter = memo((props: Props) => {
    const { className = '', data, isEditMode, editedParameter } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { data: editedParamData /*isSaved*/ } = editedParameter;
    const programId = get(data, 'programId');

    const handleParameterChange = (
        e: ChangeEvent<HTMLInputElement>,
        rowName: string,
        columnName: keyof ProgramParameterDetailType,
    ) => {
        const newValue = e.currentTarget.value;
        dispatch(programActions.setEditedProgramParameter({ newValue, rowName, columnName, programId }));
    };

    const renderTextFiled = (
        rowName: string,
        columnName: keyof ProgramParameterDetailType,
        // programId: number,
        value: string,
    ) => {
        return (
            <>
                {isEditMode ? (
                    <TableCell align="right">
                        <StyledTextField
                            // disabled={columnName === 'reference'}
                            autoComplete="off"
                            className="parameter-edit"
                            value={value || ''}
                            id="outlined-basic"
                            variant="outlined"
                            //type="number"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleParameterChange(e, rowName, columnName)
                            }
                        />
                    </TableCell>
                ) : (
                    <TableCell align="right">{value || emptyStr}</TableCell>
                )}
            </>
        );
    };

    const pData = editedParamData ? omit(editedParamData, 'id') : omit(data, ['id', 'programId']);
    const emptyStr = '--';
    return (
        <div className={`${className} x-cls-program-parameter`}>
            <Typography className="header header-title" sx={{ mt: 4, mb: 2 }} variant="subtitle1" component="div">
                {t(messages.title)}
            </Typography>
            <Typography className="header" sx={{ mt: 4, mb: 2 }} variant="subtitle2" component="div">
                {t(messages.subTitle)}
            </Typography>
            <TableContainer style={{ overflowY: 'hidden' }} component={Paper} className="program-parameter-table">
                <Table aria-label="programParameter table" size="small">
                    <TableHead>
                        <TableRow>
                            {headCells(t).map((headCell) => (
                                <TableCell align={headCell.align}> {headCell.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {keys(pData).map((parameterKey: keyof ProgramParameterType) => {
                            const rowData = pData[parameterKey];
                            return (
                                <TableRow style={{ height: 33 }}>
                                    <TableCell component="th" scope="row">
                                        {parameterKey}
                                    </TableCell>
                                    <TableCell align="right">{rowData.reference || emptyStr}</TableCell>
                                    {renderTextFiled(parameterKey, 'minimum', rowData.minimum)}
                                    {renderTextFiled(parameterKey, 'maximum', rowData.maximum)}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
});

export default ProgramParameter;

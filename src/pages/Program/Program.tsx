/**
 *
 * Program
 *
 */

import { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import get from 'lodash/get';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import withStyles from '@mui/styles/withStyles';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { programActions, programReducer, programKey } from 'services/program/program-reducer';
import {
    selectPrograms,
    selectProgramIsLoading,
    selectProgramDetail,
    selectProgramParameter,
    selectProgram,
    selectEditedProgramParameters,
} from 'services/program/program-selectors';
import { getAllProgramsSaga } from 'services/program/sagas/program-saga-get-all';
import { ProcessLogProperty } from 'widgets';
import Breadcrumb from 'components/Breadcrumb';
import { buildFiltersFromData } from 'utils';
import { Page, PageProps } from 'pages';
import { messages } from './messages';
import Collapsible from 'components/programTable/CollapsibleProgramTable';
//import ProgramDetailComponent from 'components/programTable/ProgramDetailTable';
import ProgramDetailTableNew from 'components/programTable/programDetailTable/ProgramDetailTableNew';
import ProgramParameter from 'components/programTable/programParameter/ProgramParameter';
import ProgramDevices from 'components/programTable/programDevices/ProgramDevices';
import ProgramSubmitChangeModal from 'components/programTable/programSubmitChangeModal/ProgramSubmitChangeModal';
import {
    FilterNames,
    Filters,
    Programs as ProgramsType,
    ProgramDetail,
    Program as ProgramType,
    ProgramParameter as ProgramParameterType,
} from 'models';

import 'scss/main.scss';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import './Program.scss';

interface ProgramProps extends PageProps {}
type Order = 'asc' | 'desc';

const pageFilters = [...(ProcessLogProperty.defaultFilters || [])];

const primary = '#FFDB0A';
const StyledContainedButton = withStyles(() => ({
    root: {
        backgroundColor: primary,
        color: '#000000',
        '&:hover': {
            backgroundColor: primary,
        },
        height: 30,
    },
}))(Button);
// const StyledButton = withStyles(() => ({
//     root: {
//         color: primary,
//     },
// }))(Button);

// const StyledSnackbar = withStyles(() => ({
//     root: {
//         backgroundColor: '#323232',
//         color: primary,
//         '& .SnackbarItem-variantSuccess': {
//             backgroundColor: primary,
//         },
//     },
// }))(Snackbar);

export const Program: Page<ProgramProps> = memo((_props: ProgramProps) => {
    useInjectReducer({ key: programKey, reducer: programReducer });

    useInjectSaga({ key: programKey, saga: getAllProgramsSaga });

    const { plantId } = useSelector(selectBreadcrumbFilters);
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof ProgramType>('programName');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [detailPanelOpen, setOpendetailPanel] = useState<boolean>(false);
    const [activeRowId, setActiveRowId] = useState<number>(0);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    //const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
    //const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [submitChangeModelOpen, setSubmitChangeModalOpen] = useState<boolean>(false);
    const [isSubmittedForApproval, setIsSubmittedForApproval] = useState<boolean>(false);
    const [isPasswordOverrideModalOpen, setIsPasswordOverrideModalOpen] = useState<boolean>(false);
    const [successActionTitle, setSuccessActionTitle] = useState<string>('');

    const { t } = useTranslation();
    const [filters, setFilters] = useState<Filters>({
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: 'SWS',
    });

    const selectedProgramData = useSelector(selectProgram);
    const programData: ProgramsType = useSelector(selectPrograms) || [];
    const programDetail: ProgramDetail = useSelector(selectProgramDetail) || {};
    const programParameter: ProgramParameterType | {} = useSelector(selectProgramParameter) || {};
    const programIsLoading: boolean = useSelector(selectProgramIsLoading);
    const programId = get(selectedProgramData, ['id'], '');
    const editedProgramParameters = useSelector(selectEditedProgramParameters);

    useEffect(() => {
        dispatch(programActions.getAllPrograms(filters));
    }, [dispatch, filters]);

    const onFilterChange = (filter: Filters) => {
        setFilters({ ...filters, ...filter });
    };

    const crumbs = [
        { name: FilterNames.plantId, label: `Plant : ${plantId}` },
        { name: FilterNames.systemType, menu: filters[FilterNames.systemType], options: ['SWS', 'SPR', 'SAT'] },
    ];
    const onBreadcrumbChange = (crumb: string | Filters) => {
        if (typeof crumb === 'string') {
            // a link was selected to route to page
        }
        // a filter was selected so update filters
        onFilterChange({ ...(crumb as Filters) } as any);
    };

    if (filters[FilterNames.deviceName]) {
        crumbs.push(filters[FilterNames.deviceName]);
    }
    const handleProgramRowTableClick = (detailPanelState: boolean, programRowId: number) => {
        setOpendetailPanel(detailPanelState);
        setActiveRowId(programRowId);
        detailPanelState && dispatch(programActions.setProgram(programRowId));
        detailPanelState && dispatch(programActions.setProgramParameter(programRowId));
        setIsEditMode(false);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof ProgramType) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleProgramDetailEditClick = () => {
        setIsEditMode(true);
        dispatch(
            programActions.setEditedProgramParameterDefaultValues(programParameter as Required<ProgramParameterType>),
        );
    };
    // const handleSaveButtonClick = () => {
    //     dispatch(
    //         programActions.saveEditedProgramParameter({
    //             isSaved: true,
    //             programId,
    //         }),
    //     );
    //     setIsSnackbarOpen(true);
    // };
    const handleSubmitButtonClick = () => {
        setSubmitChangeModalOpen(true);
        setSuccessActionTitle(t(messages.submittedChangeModalTitle));
    };

    const programName = get(selectedProgramData, ['programName'], '');
    const programDetailTitle = detailPanelOpen ? `${programName} Details` : 'Program Details';
    const selectedProgramParamater = detailPanelOpen ? programParameter : {};
    const selectedProgramDetail = detailPanelOpen ? programDetail : {};
    const selectedDevices = detailPanelOpen ? get(selectedProgramData, ['devices'], []) : [];
    return <>
        <Helmet>
            <title>{t(messages.programPageTitle)}</title>
            <meta name="description" content="Description of Program" />
        </Helmet>
        {/* <StyledSnackbar
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            open={isSnackbarOpen}
            autoHideDuration={3000}
            onClose={() => setIsSnackbarOpen(false)}
            message={snackbarMessage}
        /> */}
        <Div className={'x-cls-program-body x-cls-data-panel-container'}>
            <div className="program-breadcrumb">
                <Breadcrumb crumbs={crumbs} onClick={onBreadcrumbChange} />
            </div>
            {programIsLoading ? (
                <div className="x-cls-program-loader-container">
                    <CircularProgress className="x-cls-program-loader" />
                </div>
            ) : (
                <div className="x-cls-program-container">
                    <Collapsible
                        data={programData}
                        activeRowId={activeRowId}
                        openDetailPanel={handleProgramRowTableClick}
                        page={page}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        handleRequestSort={handleRequestSort}
                        order={order}
                        orderBy={orderBy}
                        rowCount={programData.length}
                        rowsPerPage={rowsPerPage}
                    />
                    {/* {detailPanelOpen && (
                        <ProgramDetailComponent
                            programName={programName}
                            data={programDetail}
                        />
                    )} */}
                    <Box className="edit-program-container">
                        <Typography className="detail-title" variant="h6">
                            {programDetailTitle}
                        </Typography>
                        {detailPanelOpen &&
                            (!isEditMode ? (
                                <IconButton
                                    aria-label="Edit Program Detail"
                                    onClick={handleProgramDetailEditClick}
                                    size="large">
                                    <EditIcon fontSize="small" className="edit-icon" />
                                </IconButton>
                            ) : (
                                <Box className="submit-button-container">
                                    {/* <StyledButton variant="text" onClick={handleSaveButtonClick}>
                                        {t(messages.cancelButton)}
                                    </StyledButton> */}
                                    <StyledContainedButton variant="contained" onClick={handleSubmitButtonClick}>
                                        {t(messages.submitChangeButton)}
                                    </StyledContainedButton>
                                </Box>
                            ))}
                    </Box>
                    <Box className="detail-parameter-container" sx={{ display: 'flex' }}>
                        <ProgramDetailTableNew programName={programName} data={selectedProgramDetail} />
                        <ProgramParameter
                            isEditMode={isEditMode}
                            programName={programName}
                            data={selectedProgramParamater}
                            editedParameter={detailPanelOpen ? get(editedProgramParameters, [programId], {}) : {}}
                        />
                        <ProgramDevices programName={programName} data={selectedDevices} />
                    </Box>
                    {detailPanelOpen && (
                        <ProgramSubmitChangeModal
                            isEditMode={isEditMode}
                            programName={programName}
                            data={selectedProgramParamater}
                            editedParameter={detailPanelOpen ? get(editedProgramParameters, [programId], {}) : {}}
                            submitChangeModelOpen={submitChangeModelOpen}
                            setSubmitChangeModalOpen={setSubmitChangeModalOpen}
                            isSubmittedForApproval={isSubmittedForApproval}
                            setIsSubmittedForApproval={setIsSubmittedForApproval}
                            isPasswordOverrideModalOpen={isPasswordOverrideModalOpen}
                            setIsPasswordOverrideModalOpen={setIsPasswordOverrideModalOpen}
                            successActionTitle={successActionTitle}
                            setSuccessActionTitle={setSuccessActionTitle}
                        />
                    )}
                </div>
            )}
        </Div>
    </>;
});

const Div = styled.div``;

export default Program;

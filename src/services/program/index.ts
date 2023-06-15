import { CustomError } from 'utils/error';
import { Filters, Program, Programs, ProgramDetail, ProgramParameter, EditedProgramParameters } from 'models';

/* --- STATE --- */
export interface ProgramsState {
    programs: Programs;
    program: Program | {};
    programsFilteredByRules: Programs;
    filters: Filters;
    programDetail: ProgramDetail;
    programParameter: ProgramParameter | {};
    editedProgramParameters: EditedProgramParameters;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default ProgramsState;

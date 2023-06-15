/*
 * Program Reducer
 */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import set from 'lodash/set';
import get from 'lodash/get';
import includes from 'lodash/includes';

import { CustomError } from 'utils/error';
import { Filters, Program, Programs, ProgramDetail, ProgramParameterDetail, ProgramParameter } from 'models';
import { ProgramsState } from '.';
import { programDetail, programParameter } from './sagas/data';

// import { filterByRule } from 'utils/filterByRule';
// import { Rule } from 'components/panels/RulesPanel/RulesPanel';

// The initial state of the Program page
export const initialState: ProgramsState = {
    programs: [],
    program: {},
    programsFilteredByRules: [],
    filters: {},
    programDetail: programDetail,
    programParameter: {},
    editedProgramParameters: {},
    error: undefined,
    isLoading: false,
};

export interface SetEditedProgramParameterPaylod {
    newValue: string;
    rowName: string;
    columnName: keyof ProgramParameterDetail;
    programId: number;
}

export interface SaveEditedProgramParameterPaylod {
    isSaved: boolean;
    programId: number;
}

/*
 *
 *
 */
const programsSlice = createSlice({
    name: 'programs',
    initialState,
    reducers: {
        getAllPrograms(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllPrograms(state, action: PayloadAction<Programs>) {
            state.programs = action.payload;
        },

        setProgram(state, action: PayloadAction<number>) {
            const selectedProgram = state.programs.find(({ id }) => id === action.payload) as Program;
            state.program = selectedProgram;
        },

        setProgramDetail(state, action: PayloadAction<ProgramDetail>) {
            state.programDetail = action.payload;
        },
        setProgramParameter(state, action: PayloadAction<number>) {
            state.programParameter = { ...programParameter, programId: action.payload };
        },

        setEditedProgramParameter(state, action: PayloadAction<SetEditedProgramParameterPaylod>) {
            const { columnName, newValue, programId, rowName } = action.payload;
            const path = [programId, 'data', rowName, columnName];
            const newState = { ...state.editedProgramParameters };
            set(newState, path, newValue);
            const editedFields = get(newState, [programId, 'editedFields'], []);
            if (!includes(editedFields, rowName)) {
                set(newState, [programId, 'editedFields'], [...editedFields, rowName]);
            }

            state.editedProgramParameters = newState;
        },
        setEditedProgramParameterDefaultValues(state, action: PayloadAction<ProgramParameter>) {
            const programId = action.payload.programId;
            if (!state.editedProgramParameters[programId]) {
                state.editedProgramParameters = {
                    ...state.editedProgramParameters,
                    [programId]: {
                        data: action.payload,
                    },
                };
            }
        },
        saveEditedProgramParameter(state, action: PayloadAction<SaveEditedProgramParameterPaylod>) {
            const { isSaved, programId } = action.payload;
            const newState = { ...state.editedProgramParameters };
            set(newState, [programId, 'isSaved'], isSaved);
            state.editedProgramParameters = newState;
        },
        // filterProgramsByRules(state, action: PayloadAction<Rule[]>) {
        //     state.programsFilteredByRules = filterByRule(state.programs, action.payload);
        // },

        error(state, action: PayloadAction<CustomError>) {
            state.error = action.payload;
        },
        loading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        clear(state) {
            state = { ...initialState };
        },
    },
});

export const { actions: programActions, reducer: programReducer, name: programKey } = programsSlice;

import { CustomError } from 'utils/error';
import { /* StudTypes, */ Filters } from 'models';
import {} from 'pages/ReportingView/FilterPanel';

/* --- STATE --- */
export interface StudTypesState {
    studTypes: any; // StudTypes // -model
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default StudTypesState;

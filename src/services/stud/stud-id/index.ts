import { CustomError } from 'utils/error';
import { /* StudIds, */ Filters } from 'models';
import {} from 'pages/ReportingView/FilterPanel';

/* --- STATE --- */
export interface StudIdsState {
    studIds: any; // StudIds // -model
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default StudIdsState;

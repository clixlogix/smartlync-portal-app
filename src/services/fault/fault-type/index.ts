import { CustomError } from 'utils/error';
import { /* FaultTypes, */ Filters } from 'models';
import {} from 'pages/ReportingView/FilterPanel';

/* --- STATE --- */
export interface FaultTypesState {
    faultTypes: any; // FaultTypes // -model
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default FaultTypesState;

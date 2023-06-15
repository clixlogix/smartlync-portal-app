import { CustomError } from 'utils/error';
import { /* FaultCodes, */ Filters } from 'models';
import {} from 'pages/ReportingView/FilterPanel';

/* --- STATE --- */
export interface FaultCodesState {
    faultCodes: any; // FaultCodes // -model
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default FaultCodesState;

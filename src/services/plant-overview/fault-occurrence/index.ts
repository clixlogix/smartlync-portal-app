import { CustomError } from 'utils/error';
import { Filters, FaultOccurrence, FaultOccurrences } from 'models';

/* --- STATE --- */
export interface FaultOccurrencesState {
    faultOccurrences?: FaultOccurrences;
    faultOccurrence?: FaultOccurrence | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default FaultOccurrencesState;

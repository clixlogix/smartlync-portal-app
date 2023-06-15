import { CustomError } from 'utils/error';
import { Filters, DurationOfFaults, DurationOfFault } from 'models';

/* --- STATE --- */
export interface DurationOfFaultsState {
    durationOfFaults?: DurationOfFaults;
    durationOfFault?: DurationOfFault | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default DurationOfFaultsState;

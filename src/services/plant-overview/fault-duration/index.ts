import { CustomError } from 'utils/error';
import { Filters, FaultDuration, FaultDurations } from 'models';

/* --- STATE --- */
export interface FaultDurationsState {
    faultDurations?: FaultDurations;
    faultDuration?: FaultDuration | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default FaultDurationsState;

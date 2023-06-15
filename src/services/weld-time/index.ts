import { CustomError } from 'utils/error';
import { Filters, WeldTimes } from 'models';

/* --- STATE --- */
export interface WeldTimesState {
    weldTimes?: WeldTimes;
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default WeldTimesState;

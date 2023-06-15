import { CustomError } from 'utils/error';
import { Filters, Lifts } from 'models';

/* --- STATE --- */
export interface LiftsState {
    lifts?: Lifts;
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default LiftsState;

import { CustomError } from 'utils/error';
import { Filters } from 'models';

/* --- STATE --- */
export interface TotalCyclesState {
    totalCycle: any;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default TotalCyclesState;

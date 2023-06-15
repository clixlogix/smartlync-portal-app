import { CustomError } from 'utils/error';
import { Filters, Plants } from 'models';

/* --- STATE --- */
export interface PlantsState {
    plants: Plants;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default PlantsState;

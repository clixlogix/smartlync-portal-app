import { CustomError } from 'utils/error';
import { Filters, Voltages } from 'models';

/* --- STATE --- */
export interface VoltagesState {
    voltages?: Voltages;
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default VoltagesState;

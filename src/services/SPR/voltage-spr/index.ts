import { CustomError } from 'utils/error';
import { Filters, VoltageSprs } from 'models';

/* --- STATE --- */
export interface VoltageSprsState {
    voltageSprs?: VoltageSprs;
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default VoltageSprsState;

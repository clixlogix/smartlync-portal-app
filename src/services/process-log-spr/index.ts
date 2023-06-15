import { CustomError } from 'utils/error';
import { Filters, ProcessLogSpr, ProcessLogSprs, OperationItem, OperationItems } from 'models';

/* --- STATE --- */
export interface ProcessLogSprsState {
    processLogSprs?: OperationItems;
    processLogSpr?: OperationItem | undefined;
    filters: Filters;
    filterValues: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default ProcessLogSprsState;

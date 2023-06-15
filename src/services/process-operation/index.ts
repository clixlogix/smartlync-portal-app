import { CustomError } from 'utils/error';
import { Filters, OperationItem, OperationItems } from 'models';

/* --- STATE --- */
export interface ProcessOperationsState {
    operationItems: OperationItems;
    operationItem?: OperationItem | undefined;
    filters: Filters;
    filterValues: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default ProcessOperationsState;

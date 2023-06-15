import { CustomError } from 'utils/error';
import { Filters, SystemFault, SystemFaults } from 'models';

/* --- STATE --- */
export interface SystemFaultsState {
    systemFaults?: SystemFaults;
    systemFault?: SystemFault | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default SystemFaultsState;

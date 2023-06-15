import { CustomError } from 'utils/error';
import { Filters, StudIdFault, StudIdFaults } from 'models';

/* --- STATE --- */
export interface StudIdFaultsState {
    studIdFaults?: StudIdFaults;
    studIdFault?: StudIdFault | undefined;
    filters: Filters;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default StudIdFaultsState;

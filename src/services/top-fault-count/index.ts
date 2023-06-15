import { CustomError } from 'utils/error';
import { Filters, TopFaultCount, TopFaultCounts } from 'models';

/* --- STATE --- */
export interface TopFaultCountsState {
    topFaultCounts?: TopFaultCounts;
    topFaultCount?: TopFaultCount | undefined;
    filters: Filters;
    topFaultCountsColumns?: [];

    error: CustomError | undefined;
    isLoading: boolean;
}

export default TopFaultCountsState;

import { CustomError } from 'utils/error';
import { Filters, EventRateCycleCount, EventRateCycleCounts } from 'models';

/* --- STATE --- */
export interface EventRateCycleCountsState {
    eventRateCycleCounts?: EventRateCycleCounts;
    eventRateCycleCount?: EventRateCycleCount | undefined;
    filters: Filters;
    filterValues: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default EventRateCycleCountsState;

import { CustomError } from 'utils/error';
import { Filters, EventRateCycleCountSpr, EventRateCycleCountSprs } from 'models';

/* --- STATE --- */
export interface EventRateCycleCountSprsState {
    eventRateCycleCountSprs?: EventRateCycleCountSprs;
    eventRateCycleCountSpr?: EventRateCycleCountSpr | undefined;
    filters: Filters;
    filterValues: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default EventRateCycleCountSprsState;

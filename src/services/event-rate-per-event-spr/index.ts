import { CustomError } from 'utils/error';
import { Filters, EventRatePerEventSpr, EventRatePerEventSprs, ChartData } from 'models';

/* --- STATE --- */
export interface EventRatePerEventSprsState {
    eventRatePerEventSprs?: EventRatePerEventSprs;
    eventRatePerEventSpr?: EventRatePerEventSpr | undefined;
    filters?: Filters;
    filterValues?: any;
    categories?: string[];
    defaultValues?: ChartData[];
    error?: CustomError | undefined;
    isLoading: boolean;
}

export default EventRatePerEventSprsState;

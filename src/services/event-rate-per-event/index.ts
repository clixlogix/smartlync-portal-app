import { CustomError } from 'utils/error';
import { Filters, EventRatePerEvent, EventRatePerEvents, ChartData } from 'models';

/* --- STATE --- */
export interface EventRatePerEventsState {
    eventRatePerEvents?: EventRatePerEvents;
    eventRatePerEvent?: EventRatePerEvent | undefined;
    filters: Filters;
    filterValues: any;
    categories?: string[];
    defaultValues?: ChartData[];

    error: CustomError | undefined;
    isLoading: boolean;
}

export default EventRatePerEventsState;

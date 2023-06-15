import { CustomError } from 'utils/error';
import { Filters, EventCountDailyFrequency, EventCountDailyFrequencys } from 'models';

/* --- STATE --- */
export interface EventCountDailyFrequencysState {
    eventCountDailyFrequencys?: EventCountDailyFrequencys;
    eventCountDailyFrequency?: EventCountDailyFrequency | undefined;
    eventCountDailyGraphFrequency?: any[];
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default EventCountDailyFrequencysState;

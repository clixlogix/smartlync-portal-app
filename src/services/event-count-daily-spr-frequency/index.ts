import { CustomError } from 'utils/error';
import { Filters, EventCountDailyFrequencySpr, EventCountDailyFrequencySprs } from 'models';

/* --- STATE --- */
export interface EventCountDailySprFrequencysState {
    eventCountDailyFrequencySprs?: EventCountDailyFrequencySprs;
    eventCountDailyFrequencySpr?: EventCountDailyFrequencySpr | undefined;
    eventCountDailyGraphFrequencySpr?: any[];
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default EventCountDailySprFrequencysState;

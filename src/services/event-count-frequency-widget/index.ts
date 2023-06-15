import { CustomError } from 'utils/error';
import { Filters, EventCountFrequency, EventCountFrequencies } from 'models';

/* --- STATE --- */
export interface EventCountFrequencyWidgetsState {
    eventCountFrequencyWidgets?: EventCountFrequencies;
    eventCountFrequencyWidget?: EventCountFrequency | undefined;
    eventCountFrequencyGraphWidgets?: any[];
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default EventCountFrequencyWidgetsState;

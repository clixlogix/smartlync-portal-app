import { CustomError } from 'utils/error';
import { Filters, EventCountFrequencySprs, EventCountFrequencySpr } from 'models';

/* --- STATE --- */
export interface EventCountFrequencySprWidgetsState {
    eventCountFrequencySprWidgets?: EventCountFrequencySprs;
    eventCountFrequencySprWidget?: EventCountFrequencySpr | undefined;
    eventCountFrequencyGraphSprWidgets: any[];
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default EventCountFrequencySprWidgetsState;

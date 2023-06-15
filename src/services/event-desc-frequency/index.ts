import { CustomError } from 'utils/error';
import { Filters, EventDescFrequency, EventDescFrequencys } from 'models';

/* --- STATE --- */
export interface EventDescFrequencysState {
    eventDescFrequencys?: EventDescFrequencys;
    eventDescFrequency?: EventDescFrequency | undefined;
    eventDescGraphFrequency?: any[];
    filters: Filters;
    filterValues: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default EventDescFrequencysState;

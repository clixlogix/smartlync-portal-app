import { CustomError } from 'utils/error';
import { Filters, EventDescFrequencySprs } from 'models';

/* --- STATE --- */
export interface EventDescFrequencySprsState {
    eventDescFrequencySprs?: EventDescFrequencySprs;
    eventDescGraphFrequencySprs?: any[];
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default EventDescFrequencySprsState;

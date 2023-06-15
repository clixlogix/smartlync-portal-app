import { CustomError } from 'utils/error';
import { Filters, Event, Events } from 'models';

/* --- STATE --- */
export interface EventsState {
    events?: Events;
    event?: Event | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default EventsState;

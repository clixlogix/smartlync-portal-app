import { CustomError } from 'utils/error';
import { Filters, TimeZoneSpr } from 'models';

/* --- STATE --- */
export interface TimeZoneSprsState {
    timeZoneSprs?: TimeZoneSpr;
    // timeZoneSpr?: TimeZoneSpr | undefined;
    // timeZoneSprsFilteredByRules: TimeZoneSprs;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default TimeZoneSprsState;

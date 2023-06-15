import { CustomError } from 'utils/error';
import { Filters, TimeZone, TimeZones } from 'models';

/* --- STATE --- */
export interface TimeZonesState {
    timeZones?: TimeZones;
    timeZone?: TimeZone | undefined;
    timeZonesFilteredByRules: TimeZones;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default TimeZonesState;

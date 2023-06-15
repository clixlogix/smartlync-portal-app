import { CustomError } from 'utils/error';
import { Filters, StationAvailabilityTrend, StationAvailabilityTrends } from 'models';

/* --- STATE --- */
export interface StationAvailabilityTrendsState {
    stationAvailabilityTrends?: StationAvailabilityTrends;
    stationAvailabilityTrend?: StationAvailabilityTrend | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default StationAvailabilityTrendsState;

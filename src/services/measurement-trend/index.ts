import { CustomError } from 'utils/error';
import { Filters, MeasurementTrend, MeasurementTrends } from 'models';

/* --- STATE --- */
export interface MeasurementTrendsState {
    measurementTrends?: MeasurementTrends;
    measurementTrend?: MeasurementTrend | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default MeasurementTrendsState;

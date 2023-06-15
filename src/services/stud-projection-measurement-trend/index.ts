import { CustomError } from 'utils/error';
import { Filters, StudProjectionMeasurementTrend, StudProjectionMeasurementTrends } from 'models';

/* --- STATE --- */
export interface StudProjectionMeasurementTrendsState {
    studProjectionMeasurementTrends?: StudProjectionMeasurementTrends;
    studProjectionMeasurementTrend?: StudProjectionMeasurementTrend | undefined;
    filters: Filters;
    defaultValues: [];
    filterValues: {};
    error: CustomError | undefined;
    isLoading: boolean;
}

export default StudProjectionMeasurementTrendsState;

import { CustomError } from 'utils/error';
import { Filters, PenetrationMeasurementTrend, PenetrationMeasurementTrends } from 'models';

/* --- STATE --- */
export interface PenetrationMeasurementTrendsState {
    penetrationMeasurementTrends?: PenetrationMeasurementTrends;
    penetrationMeasurementTrend?: PenetrationMeasurementTrend | undefined;
    filters: Filters;
    defaultValues: [];
    filterValues: {};
    error: CustomError | undefined;
    isLoading: boolean;
}

export default PenetrationMeasurementTrendsState;

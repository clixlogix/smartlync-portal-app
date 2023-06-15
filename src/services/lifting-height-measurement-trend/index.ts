import { CustomError } from 'utils/error';
import { Filters, LiftingHeightMeasurementTrend, LiftingHeightMeasurementTrends } from 'models';

/* --- STATE --- */
export interface LiftingHeightMeasurementTrendsState {
    liftingHeightMeasurementTrends?: LiftingHeightMeasurementTrends;
    liftingHeightMeasurementTrend?: LiftingHeightMeasurementTrend | undefined;
    filters: Filters;
    defaultValues: [];
    filterValues: {};
    error: CustomError | undefined;
    isLoading: boolean;
}

export default LiftingHeightMeasurementTrendsState;

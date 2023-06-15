import { CustomError } from 'utils/error';
import { Filters, DropTimeMeasurementTrend, DropTimeMeasurementTrends } from 'models';

/* --- STATE --- */
export interface DropTimeMeasurementTrendsState {
    dropTimeMeasurementTrends?: DropTimeMeasurementTrends;
    dropTimeMeasurementTrend?: DropTimeMeasurementTrend | undefined;
    filters: Filters;
    defaultValues: [];
    filterValues: {};
    error: CustomError | undefined;
    isLoading: boolean;
}

export default DropTimeMeasurementTrendsState;

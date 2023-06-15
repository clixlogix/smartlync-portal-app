import { CustomError } from 'utils/error';
import { Filters, FaultRateMeasurementTrend, FaultRateMeasurementTrends } from 'models';

/* --- STATE --- */
export interface FaultRateMeasurementTrendsState {
    faultRateMeasurementTrends?: FaultRateMeasurementTrends;
    faultRateMeasurementTrend?: FaultRateMeasurementTrend | undefined;
    filters: Filters;
    categories: number[];
    graphData: any[];

    error: CustomError | undefined;
    isLoading: boolean;
}

export default FaultRateMeasurementTrendsState;

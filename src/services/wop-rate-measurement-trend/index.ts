import { CustomError } from 'utils/error';
import { Filters, WopRateMeasurementTrend, WopRateMeasurementTrends } from 'models';

/* --- STATE --- */
export interface WopRateMeasurementTrendsState {
    wopRateMeasurementTrends?: WopRateMeasurementTrends;
    wopRateMeasurementTrend?: WopRateMeasurementTrend | undefined;
    filters: Filters;
    categories: number[];
    graphData: any[];
    error: CustomError | undefined;
    isLoading: boolean;
}

export default WopRateMeasurementTrendsState;

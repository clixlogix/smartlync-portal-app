import { CustomError } from 'utils/error';
import { Filters, WeldingTimeMeasurementTrend, WeldingTimeMeasurementTrends } from 'models';

/* --- STATE --- */
export interface WeldingTimeMeasurementTrendsState {
    weldingTimeMeasurementTrends?: WeldingTimeMeasurementTrends;
    weldingTimeMeasurementTrend?: WeldingTimeMeasurementTrend | undefined;
    filters: Filters;
    defaultValues: [];
    filterValues: {};
    error: CustomError | undefined;
    isLoading: boolean;
}

export default WeldingTimeMeasurementTrendsState;

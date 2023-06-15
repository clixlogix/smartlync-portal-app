import { CustomError } from 'utils/error';
import { Filters, DailyFaultTrend, DailyFaultTrends } from 'models';

/* --- STATE --- */
export interface DailyFaultTrendsState {
    dailyFaultTrends?: DailyFaultTrends;
    dailyFaultTrend?: DailyFaultTrend | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default DailyFaultTrendsState;

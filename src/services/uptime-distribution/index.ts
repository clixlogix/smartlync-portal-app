import { CustomError } from 'utils/error';
import { Filters, UptimeDistribution, UptimeDistributions } from 'models';

/* --- STATE --- */
export interface UptimeDistributionsState {
    uptimeDistributions?: UptimeDistributions;
    uptimeDistribution?: UptimeDistribution | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default UptimeDistributionsState;

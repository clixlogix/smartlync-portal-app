import { CustomError } from 'utils/error';
import { Filters, OverviewAnalysis, OverviewAnalysiss } from 'models';

/* --- STATE --- */
export interface OverviewAnalysissState {
    overviewAnalysiss?: OverviewAnalysiss;
    overviewAnalysis?: OverviewAnalysis | undefined;
    overviewAnalysissFilteredByRules: OverviewAnalysiss;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default OverviewAnalysissState;

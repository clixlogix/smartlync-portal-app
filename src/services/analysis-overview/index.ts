import { CustomError } from 'utils/error';
import { Filters, AnalysisOverview, AnalysisOverviews } from 'models';

/* --- STATE --- */
export interface AnalysisOverviewsState {
    analysisOverviews?: AnalysisOverviews;
    analysisOverview?: AnalysisOverview | undefined;
    analysisOverviewsFilteredByRules: AnalysisOverviews;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default AnalysisOverviewsState;

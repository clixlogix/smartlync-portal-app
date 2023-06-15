import { CustomError } from 'utils/error';
import { Filters, OpportunityAnalysis, OpportunityAnalysiss } from 'models';

/* --- STATE --- */
export interface OpportunityAnalysissState {
    opportunityAnalysiss?: OpportunityAnalysiss;
    opportunityAnalysis?: OpportunityAnalysis | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default OpportunityAnalysissState;

import { CustomError } from 'utils/error';
import { Filters, VarianceAnalysis, VarianceAnalysiss } from 'models';

/* --- STATE --- */
export interface VarianceAnalysissState {
    varianceAnalysiss?: VarianceAnalysiss;
    varianceAnalysis?: VarianceAnalysis | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default VarianceAnalysissState;

import { CustomError } from 'utils/error';
import { Filters, TaAnalysisTable, TaAnalysisTables } from 'models';

/* --- STATE --- */
export interface TaAnalysisTablesState {
    taAnalysisTables?: TaAnalysisTables;
    taAnalysisTable?: TaAnalysisTable | undefined;
    filters: Filters;
    filterValues?: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default TaAnalysisTablesState;

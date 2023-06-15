import { CustomError } from 'utils/error';
import { Filters, MtbfAnalysisTable, MtbfAnalysisTables } from 'models';

/* --- STATE --- */
export interface MtbfAnalysisTablesState {
    mtbfAnalysisTables?: MtbfAnalysisTables;
    mtbfAnalysisTable?: MtbfAnalysisTable | undefined;
    defaultValue?: MtbfAnalysisTables;
    filters: Filters;
    columns?: string[];
    mtbfData?: any[][];
    error: CustomError | undefined;
    isLoading: boolean;
    // finalData: any[];
}

export default MtbfAnalysisTablesState;

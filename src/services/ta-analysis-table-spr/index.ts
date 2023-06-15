import { CustomError } from 'utils/error';
import { Filters, TaAnalysisTablesSpr, TaAnalysisTableSpr } from 'models';

/* --- STATE --- */
export interface TaAnalysisTableSprsState {
    taAnalysisTablesSpr?: TaAnalysisTablesSpr;
    taAnalysisTableSpr?: TaAnalysisTableSpr | undefined;
    filters: Filters;
    filterValues?: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default TaAnalysisTableSprsState;

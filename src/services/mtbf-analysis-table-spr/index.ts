import { CustomError } from 'utils/error';
import { Filters, MtbfAnalysisTableSpr, MtbfAnalysisTableSprs } from 'models';

/* --- STATE --- */
export interface MtbfAnalysisTableSprsState {
    mtbfAnalysisTableSprs?: MtbfAnalysisTableSprs;
    mtbfAnalysisTableSpr?: MtbfAnalysisTableSpr | undefined;
    defaultValue?: MtbfAnalysisTableSprs;
    filters: Filters;
    columns?: string[];
    mtbfData?: any[][];
    error: CustomError | undefined;
    isLoading: boolean;
}

export default MtbfAnalysisTableSprsState;

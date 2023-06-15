import { CustomError } from 'utils/error';
import { Filters, CycleGapMetaData, CycleGapMetaDatas } from 'models';

/* --- STATE --- */
export interface CycleGapMetaDatasState {
    cycleGapMetaDatas?: CycleGapMetaDatas | any;
    cycleGapMetaData?: CycleGapMetaData | undefined;
    cycleGapMetaDatasFilteredByRules: CycleGapMetaDatas;
    filters: Filters;
    pins: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default CycleGapMetaDatasState;

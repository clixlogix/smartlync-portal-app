import { CustomError } from 'utils/error';
import { Filters, CycleGapMetaDataSpr, CycleGapMetaDataSprs } from 'models';

/* --- STATE --- */
export interface CycleGapMetaDataSprsState {
    cycleGapMetaDataSprs?: CycleGapMetaDataSprs | any;
    cycleGapMetaDataSpr?: CycleGapMetaDataSpr | undefined;
    cycleGapMetaDataSprsFilteredByRules: CycleGapMetaDataSprs;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default CycleGapMetaDataSprsState;

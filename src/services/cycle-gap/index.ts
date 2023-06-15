import { CustomError } from 'utils/error';
import { Filters, CycleGap, CycleGaps, CycleGapLocalFilter } from 'models';

/* --- STATE --- */
export interface CycleGapsState {
    cycleGaps?: CycleGaps;
    cycleGap?: CycleGap | undefined;
    filters: Filters;
    formattedCycleGaps?: [];
    defaultValues?: [];
    filterValues: any;
    formattedCycleGapEvents?: [];
    defaultEventValues?: [];
    error: CustomError | undefined;
    isLoading: boolean;
    localFilters: CycleGapLocalFilter;
}

export default CycleGapsState;

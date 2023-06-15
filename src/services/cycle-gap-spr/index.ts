import { CustomError } from 'utils/error';
import { Filters, CycleGapSprLocalFilter } from 'models';

/* --- STATE --- */
export interface CycleGapSprsState {
    filters: Filters;
    formattedCycleGaps?: [];
    defaultValues?: [];
    filterValues: any;
    formattedCycleGapEvents?: [];
    defaultEventValues?: [];
    error: CustomError | undefined;
    isLoading: boolean;
    localFilters: CycleGapSprLocalFilter;
}

export default CycleGapSprsState;

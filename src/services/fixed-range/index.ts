import { CustomError } from 'utils/error';
import { Filters, FixedRange, FixedRanges } from 'models';

/* --- STATE --- */
export interface FixedRangesState {
    fixedRanges?: FixedRanges;
    fixedRange?: FixedRange | undefined;
    initialFixedRange?: FixedRange | undefined;
    fixedRangesFilteredByRules: FixedRanges;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default FixedRangesState;

import { CustomError } from 'utils/error';
import { Filters, Penetrations } from 'models';

/* --- STATE --- */
export interface PenetrationsState {
    penetrations?: Penetrations;
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default PenetrationsState;

import { CustomError } from 'utils/error';
import { Filters, Mtbf, Mtbfs } from 'models';

/* --- STATE --- */
export interface MtbfsState {
    mtbfs?: Mtbfs;
    mtbf?: Mtbf;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default MtbfsState;

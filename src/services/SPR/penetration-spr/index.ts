import { CustomError } from 'utils/error';
import { Filters, PenetrationSprs } from 'models';

/* --- STATE --- */
export interface PenetrationSprsState {
    penetrationSprs?: PenetrationSprs;
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default PenetrationSprsState;

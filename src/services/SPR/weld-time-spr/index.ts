import { CustomError } from 'utils/error';
import { Filters, WeldTimeSprs } from 'models';

/* --- STATE --- */
export interface WeldTimeSprsState {
    weldTimeSprs?: WeldTimeSprs;
    filterValues: any;
    filters: Filters;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default WeldTimeSprsState;

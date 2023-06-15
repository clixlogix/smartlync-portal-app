import { CustomError } from 'utils/error';
import { Filters, DurationOfFaultsSprs } from 'models';

/* --- STATE --- */
export interface DurationOfFaultsSprsState {
    durationOfFaultsSprs?: DurationOfFaultsSprs;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default DurationOfFaultsSprsState;

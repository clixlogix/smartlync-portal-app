import { CustomError } from 'utils/error';
import { Filters, GetLastUpdated, GetLastUpdateds } from 'models';

/* --- STATE --- */
export interface GetLastUpdatedsState {
    getLastUpdateds?: GetLastUpdateds;
    getLastUpdated?: GetLastUpdated | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default GetLastUpdatedsState;

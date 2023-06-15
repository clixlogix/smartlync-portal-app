import { CustomError } from 'utils/error';
import { Filters /* SystemOverview */ } from 'models';

/* --- STATE --- */
export interface SystemOverviewsState {
    systemOverviews: any; // SystemOverviews // -model
    systemOverviewsFilteredByRule: any;
    pinSystemOverviews: any;
    filters: Filters;

    filterValues: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default SystemOverviewsState;

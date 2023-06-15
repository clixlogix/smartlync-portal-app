import { CustomError } from 'utils/error';
import { Filters } from 'models';

/* --- STATE --- */
export interface BreadcrumbsState {
    breadcrumbs?: any[];
    breadcrumb?: any | undefined;
    breadcrumbsFilteredByRules: any[];
    filters: Filters;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default BreadcrumbsState;

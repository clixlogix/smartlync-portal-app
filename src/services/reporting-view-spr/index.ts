import { CustomError } from 'utils/error';
import { Filters, ReportingViewSpr, ReportingViewSprs } from 'models';

/* --- STATE --- */
export interface ReportingViewSprsState {
    reportingViewSprs?: ReportingViewSprs;
    reportingViewSpr?: ReportingViewSpr | undefined;
    reportingViewSprsFilteredByRules: ReportingViewSprs;
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default ReportingViewSprsState;

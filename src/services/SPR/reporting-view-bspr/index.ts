import { CustomError } from 'utils/error';
import { Filters, ReportingViewBsprs } from 'models';

/* --- STATE --- */
export interface ReportingViewBsprsState {
    faultCounts: ReportingViewBsprs;
    faultReports: any[];
    totalFaultCounts: { [key: string]: number };
    filters: Filters;
    filterValues: {};
    error: CustomError | undefined;
    isLoading: boolean;
}

export default ReportingViewBsprsState;

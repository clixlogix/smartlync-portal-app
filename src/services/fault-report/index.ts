import { CustomError } from 'utils/error';
import { Filters, FaultReportItem, FaultReports } from 'models';

/* --- STATE --- */
export interface FaultReportsState {
    faultReports?: FaultReports;
    faultReport?: FaultReportItem | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default FaultReportsState;

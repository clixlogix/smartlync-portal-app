import { CustomError } from 'utils/error';
import { FaultCounts, Filters } from 'models';
import {} from 'pages/ReportingView/FilterPanel';

/* --- STATE --- */
export interface FaultCountsState {
    faultCounts: FaultCounts;
    faultReports: any[];
    totalFaultCounts: { [key: string]: number };
    filters: Filters;
    filterValues: {};

    error: CustomError | undefined;
    isLoading: boolean;
}

export default FaultCountsState;

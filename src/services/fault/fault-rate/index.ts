import { CustomError } from 'utils/error';
import { FaultRates, Filters } from 'models';
import {} from 'pages/ReportingView/FilterPanel';

/* --- STATE --- */
export interface FaultRatesState {
    faultRates: FaultRates;
    filters: Filters;
    filterValues: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default FaultRatesState;

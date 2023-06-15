import { CustomError } from 'utils/error';
import { Filters, HistoricalDiagnostic, HistoricalDiagnostics } from 'models';

/* --- STATE --- */
export interface HistoricalDiagnosticsState {
    historicalDiagnostics?: HistoricalDiagnostics;
    historicalDiagnostic?: HistoricalDiagnostic | undefined;
    historicalDiagnosticsFilteredByRules: HistoricalDiagnostics;
    filters: Filters;
    historicalSpr: HistoricalDiagnostics;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default HistoricalDiagnosticsState;

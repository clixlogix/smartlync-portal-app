import { CustomError } from 'utils/error';
import { Filters, HistoricalDiagnosticGraph, HistoricalDiagnosticGraphs } from 'models';

/* --- STATE --- */
export interface HistoricalDiagnosticGraphsState {
    historicalDiagnosticGraphs?: HistoricalDiagnosticGraphs;
    historicalDiagnosticGraph?: HistoricalDiagnosticGraph | undefined;
    historicalDiagnosticGraphsFilteredByRules: HistoricalDiagnosticGraphs;
    filters: Filters;
    historicalSprGraphs: HistoricalDiagnosticGraphs;
    error: CustomError | undefined;
    isLoading: boolean;
    pins: any;
}

export default HistoricalDiagnosticGraphsState;

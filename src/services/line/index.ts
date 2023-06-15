import { CustomError } from 'utils/error';
import { /* Lines, */ Filters } from 'models';
import {} from 'pages/ReportingView/FilterPanel';

/* --- STATE --- */
export interface LinesState {
    lines: any; // LinesIds // -model
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default LinesState;

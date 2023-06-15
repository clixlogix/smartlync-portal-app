import { CustomError } from 'utils/error';
import { Filters } from 'models';

/* --- STATE --- */
export interface ReportThresholdsState {
    reportThreshold?: number;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default ReportThresholdsState;

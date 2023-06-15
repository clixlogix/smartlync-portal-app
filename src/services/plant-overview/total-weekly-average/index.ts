import { CustomError } from 'utils/error';
import { Filters, TotalWeeklyAverage, TotalWeeklyAverages } from 'models';

/* --- STATE --- */
export interface TotalWeeklyAveragesState {
    totalWeeklyAverages?: TotalWeeklyAverages;
    totalWeeklyAverage?: TotalWeeklyAverage;
    filters: Filters;
    filterValues: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default TotalWeeklyAveragesState;

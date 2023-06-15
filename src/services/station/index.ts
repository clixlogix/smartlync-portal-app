import { CustomError } from 'utils/error';
import { /* Stations, */ Filters } from 'models';
import {} from 'pages/ReportingView/FilterPanel';

/* --- STATE --- */
export interface StationsState {
    stations: any; // StationsIds // -model
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default StationsState;

import { CustomError } from 'utils/error';
import { /* DeviceNames, */ Filters } from 'models';
import {} from 'pages/ReportingView/FilterPanel';

/* --- STATE --- */
export interface DeviceNamesState {
    deviceNames: any; // DeviceNames // -model
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default DeviceNamesState;

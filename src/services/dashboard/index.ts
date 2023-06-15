import { CustomError } from 'utils/error';
import { RouteItems } from './routes';

/* --- STATE --- */
export interface DashboardsState {
    dashboards: RouteItems;
    filters: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default DashboardsState;

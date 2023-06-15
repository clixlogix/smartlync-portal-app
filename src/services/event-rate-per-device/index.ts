import { CustomError } from 'utils/error';
import { Filters, EventRatePerDevice, EventRatePerDevices, ChartData } from 'models';

/* --- STATE --- */
export interface EventRatePerDevicesState {
    eventRatePerDevices?: EventRatePerDevices | object;
    eventRatePerDevice?: EventRatePerDevice | undefined;
    filters: Filters;
    filterValues?: any;
    categories?: string[];
    defaultValues?: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default EventRatePerDevicesState;

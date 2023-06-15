import { CustomError } from 'utils/error';
import { Filters, EventRatePerDeviceSpr, EventRatePerDeviceSprs } from 'models';

/* --- STATE --- */
export interface EventRatePerDeviceSprsState {
    eventRatePerDeviceSprs?: EventRatePerDeviceSprs | object;
    eventRatePerDeviceSpr?: EventRatePerDeviceSpr | undefined;
    filters: Filters;
    filterValues?: any;
    categories?: string[];
    defaultValues?: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default EventRatePerDeviceSprsState;

import { CustomError } from 'utils/error';
import { Filters, DeviceAreaGraph, DeviceAreaGraphs } from 'models';

/* --- STATE --- */
export interface DeviceAreaGraphsState {
    deviceAreaGraphs?: DeviceAreaGraphs;
    deviceAreaGraph?: DeviceAreaGraph | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default DeviceAreaGraphsState;

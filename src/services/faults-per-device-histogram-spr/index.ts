import { CustomError } from 'utils/error';
import { Filters, FaultsPerDeviceHistogramSpr, FaultsPerDeviceHistogramSprs, ChartData } from 'models';

/* --- STATE --- */
export interface FaultsPerDeviceHistogramSprsState {
    faultsPerDeviceHistogramSprs?: FaultsPerDeviceHistogramSprs;
    faultsPerDeviceHistogramSpr?: FaultsPerDeviceHistogramSpr | undefined;
    faultsPerDeviceHistogramSprsFilteredByRules: FaultsPerDeviceHistogramSprs;
    filters: Filters;
    filterValues: any;
    categories?: any;
    defaultValues?: ChartData[];
    error: CustomError | undefined;
    isLoading: boolean;
}

export default FaultsPerDeviceHistogramSprsState;

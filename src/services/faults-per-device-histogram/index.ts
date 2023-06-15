import { CustomError } from 'utils/error';
import { Filters, FaultsPerDeviceHistogram, FaultsPerDeviceHistograms, ChartData } from 'models';

/* --- STATE --- */
export interface FaultsPerDeviceHistogramsState {
    faultsPerDeviceHistograms?: FaultsPerDeviceHistograms;
    faultsPerDeviceHistogram?: FaultsPerDeviceHistogram | undefined;
    faultsPerDeviceHistogramsFilteredByRules: FaultsPerDeviceHistograms;
    filters: Filters;
    filterValues: any;
    categories?: any;
    defaultValues?: ChartData[];
    error: CustomError | undefined;
    isLoading: boolean;
}

export default FaultsPerDeviceHistogramsState;

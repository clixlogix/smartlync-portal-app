import { CustomError } from 'utils/error';
import { Filters } from 'models';

/* --- STATE --- */
export interface FaultFrequencysState {
    faultFrequencys?: any[];
    faultFrequency?: any | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default FaultFrequencysState;

import { CustomError } from 'utils/error';
import { Filters, ProbabilityDensityFunction, ProbabilityDensityFunctions } from 'models';

/* --- STATE --- */
export interface ProbabilityDensityFunctionsState {
    probabilityDensityFunctions?: ProbabilityDensityFunctions;
    probabilityDensityFunction?: ProbabilityDensityFunction | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default ProbabilityDensityFunctionsState;

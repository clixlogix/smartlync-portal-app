import { CustomError } from 'utils/error';
import { Filters /* RecommendedActionSubmit */ } from 'models';

/* --- STATE --- */
export interface RecommendedActionSubmitsState {
    recommendedActionSubmits: any; // RecommendedActionSubmits // -model
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default RecommendedActionSubmitsState;

import { CustomError } from 'utils/error';

/* --- STATE --- */
export interface RecommendedActionsState {
    recommendedActions: any; // RecommendedActions // -model
    filters: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default RecommendedActionsState;

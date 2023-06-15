import { CustomError } from 'utils/error';
import { Filters, FaultActions, FaultAction } from 'models';

/* --- STATE --- */
export interface RecommendedActionsHistorysState {
    recommendedActionsHistorys?: FaultActions;
    getOriginalHistory?: FaultActions;
    recommendedActionsHistory?: FaultAction | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default RecommendedActionsHistorysState;

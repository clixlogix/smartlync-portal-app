import { CustomError } from 'utils/error';
import { Filters, LiftSprs } from 'models';

/* --- STATE --- */
export interface LiftSprsState {
    liftSprs?: LiftSprs;
    // liftSpr?: LiftSpr | undefined;
    // liftSprsFilteredByRules: LiftSprs;
    filters: Filters;
    filterValues: any;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default LiftSprsState;

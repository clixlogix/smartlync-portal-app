import { CustomError } from 'utils/error';
import { Filters, TopFaultCountSpr, TopFaultCountSprs } from 'models';

/* --- STATE --- */
export interface TopFaultCountSprsState {
    topFaultCountSprs?: TopFaultCountSprs;
    topFaultCountSpr?: TopFaultCountSpr | undefined;
    filters: Filters;
    topFaultCountSprColumns?: [];
    error: CustomError | undefined;
    isLoading: boolean;
}

export default TopFaultCountSprsState;

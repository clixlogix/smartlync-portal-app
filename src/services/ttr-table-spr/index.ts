import { CustomError } from 'utils/error';
import { Filters, TtrTableSpr, TtrTableSprs } from 'models';

/* --- STATE --- */
export interface TtrTableSprsState {
    ttrTableSprs?: TtrTableSprs;
    ttrTableSpr?: TtrTableSpr | undefined;
    ttrTableSprsFilteredByRules: TtrTableSprs;
    defaultValue?: TtrTableSprs;
    filters: Filters;
    columns?: string[];
    ttrData?: any[][];

    error: CustomError | undefined;
    isLoading: boolean;
}

export default TtrTableSprsState;

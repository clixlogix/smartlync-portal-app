import { CustomError } from 'utils/error';
import { Filters, TaTableSpr, TaTableSprs } from 'models';

/* --- STATE --- */
export interface TaTableSprsState {
    taTableSprs?: TaTableSprs;
    taTableSpr?: TaTableSpr | undefined;
    defaultValue?: TaTableSprs;
    filters: Filters;
    columns?: string[];
    taData?: any[][];

    error: CustomError | undefined;
    isLoading: boolean;
}

export default TaTableSprsState;

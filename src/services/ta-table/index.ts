import { CustomError } from 'utils/error';
import { Filters, TaTable, TaTables } from 'models';

/* --- STATE --- */
export interface TaTablesState {
    taTables?: TaTables;
    taTable?: TaTable | undefined;
    defaultValue?: TaTables;
    filters: Filters;
    columns?: string[];
    taData?: any[][];

    error: CustomError | undefined;
    isLoading: boolean;
}

export default TaTablesState;

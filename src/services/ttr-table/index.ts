import { CustomError } from 'utils/error';
import { Filters, TtrTable, TtrTables } from 'models';

export interface TtrTablesState {
    ttrTables?: TtrTables;
    ttrTable?: TtrTable | undefined;
    ttrTablesFilteredByRules: TtrTables;
    defaultValue?: TtrTables;
    filters: Filters;
    columns?: string[];
    ttrData?: any[][];

    error: CustomError | undefined;
    isLoading: boolean;
}

export default TtrTablesState;

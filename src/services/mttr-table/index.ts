import { CustomError } from 'utils/error';
import { Filters, MttrTable, MttrTables } from 'models';

/* --- STATE --- */
export interface MttrTablesState {
    mttrTables?: MttrTables;
    mttrTable?: MttrTable | undefined;
    defaultValue?: MttrTables;
    filters: Filters;
    columns?: string[];
    mttrData?: any[][];

    error: CustomError | undefined;
    isLoading: boolean;
}

export default MttrTablesState;

import { CustomError } from 'utils/error';
import { Filters, SaTable, SaTables } from 'models';

/* --- STATE --- */
export interface SaTablesState {
    saTables?: SaTables;
    saTable?: SaTable | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default SaTablesState;

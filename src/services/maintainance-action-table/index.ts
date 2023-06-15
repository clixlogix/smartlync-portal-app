import { CustomError } from 'utils/error';
import { Filters, MaintainanceActionTable, MaintainanceActionTables } from 'models';

/* --- STATE --- */
export interface MaintainanceActionTablesState {
    maintainanceActionTables?: MaintainanceActionTables;
    maintainanceActionTable?: MaintainanceActionTable | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default MaintainanceActionTablesState;

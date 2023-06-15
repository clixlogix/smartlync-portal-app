import { CustomError } from 'utils/error';
import { Filters, CarBodyTable, CarBodyTables } from 'models';

/* --- STATE --- */
export interface CarBodyTablesState {
    carBodyTables?: CarBodyTables;
    carBodyTable?: CarBodyTable | undefined;
    columns?: RiskTableHeadValue[];
    filters: Filters;
    unfilteredData?: CarBodyTables;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default CarBodyTablesState;

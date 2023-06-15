import { CustomError } from 'utils/error';
import { Filters, SelectAggregateColumn, SelectAggregateColumns } from 'models';

/* --- STATE --- */
export interface SelectAggregateColumnsState {
    selectAggregateColumns?: SelectAggregateColumns;
    selectAggregateColumn?: SelectAggregateColumn | undefined;
    selectAggregateColumnsFilteredByRules: SelectAggregateColumns;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default SelectAggregateColumnsState;

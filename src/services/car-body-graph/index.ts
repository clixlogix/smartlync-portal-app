import { CustomError } from 'utils/error';
import { Filters, CarBodyGraph, CarBodyGraphs } from 'models';

/* --- STATE --- */
export interface CarBodyGraphsState {
    carBodyGraphs?: CarBodyGraphs;
    carBodyGraph?: CarBodyGraph | undefined;
    filters: Filters;
    filterValues?: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default CarBodyGraphsState;

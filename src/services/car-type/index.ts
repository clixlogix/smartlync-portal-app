import { CustomError } from 'utils/error';
import { Filters, CarType, CarTypes } from 'models';

/* --- STATE --- */
export interface CarTypesState {
    carTypes?: CarTypes;
    carType?: CarType | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default CarTypesState;

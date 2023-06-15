import { CustomError } from 'utils/error';
import { Filters, MeasurementsSprWidgets } from 'models';

export interface MeasurementsSprWidgetsState {
    measurementsSprWidgets?: MeasurementsSprWidgets;
    measurementsSprWidgetsFilteredByRules: MeasurementsSprWidgets;
    filters: Filters;
    filterValues: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default MeasurementsSprWidgetsState;

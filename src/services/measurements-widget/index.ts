import { CustomError } from 'utils/error';
import { Filters, MeasurementsWidget, MeasurementsWidgets } from 'models';

/* --- STATE --- */
export interface MeasurementsWidgetsState {
    measurementsWidgets?: MeasurementsWidgets;
    measurementsWidget?: MeasurementsWidget | undefined;
    measurementsWidgetsFilteredByRules: MeasurementsWidgets;
    filters: Filters;
    defaultValues?: [];
    filterValues: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default MeasurementsWidgetsState;

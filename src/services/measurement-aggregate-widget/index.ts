import { CustomError } from 'utils/error';
import { Filters, MeasurementAggregateWidget, MeasurementAggregateWidgets } from 'models';

/* --- STATE --- */
export interface MeasurementAggregateWidgetsState {
    measurementAggregateWidgets?: any;
    measurementAggregateWidget?: MeasurementAggregateWidget | undefined;
    measurementAggregateWidgetsFilteredByRules: MeasurementAggregateWidgets;
    formattedCycleGapEvents?: [];
    defaultEventValues?: [];
    filters: Filters;
    defaultValues: Object;
    filterValues: {};
    error: CustomError | undefined;
    isLoading: boolean;
    localFilters: any;
}

export default MeasurementAggregateWidgetsState;

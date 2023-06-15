import { CustomError } from 'utils/error';
import { Filters, MeasurementAggregateWidgetSpr, MeasurementAggregateWidgetSprs } from 'models';

/* --- STATE --- */
export interface MeasurementAggregateWidgetSprsState {
    measurementAggregateWidgetSprs?: any;
    measurementAggregateWidgetSpr?: MeasurementAggregateWidgetSpr | undefined;
    measurementAggregateWidgetSprsFilteredByRules: MeasurementAggregateWidgetSprs;
    formattedCycleGapEvents?: [];
    defaultEventValues?: [];
    filters: Filters;
    defaultValues: Object;
    filterValues: {};
    error: CustomError | undefined;
    isLoading: boolean;
    localFilters: any;
}

export default MeasurementAggregateWidgetSprsState;

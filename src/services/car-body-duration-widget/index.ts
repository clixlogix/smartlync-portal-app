import { CustomError } from 'utils/error';
import { Filters, CarBodyDurationWidget, CarBodyDurationWidgets } from 'models';

/* --- STATE --- */
export interface CarBodyDurationWidgetsState {
    carBodyDurationWidgets?: CarBodyDurationWidgets;
    carBodyDurationWidget?: CarBodyDurationWidget | undefined;
    filters: Filters;
    categories: string[];
    graphData: any[];
    secondaryGraphData: any[];

    error: CustomError | undefined;
    isLoading: boolean;
}

export default CarBodyDurationWidgetsState;

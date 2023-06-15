import { CustomError } from 'utils/error';
import { Filters, DReportWidget, DReportWidgets } from 'models';

/* --- STATE --- */
export interface DReportWidgetsState {
    dReportWidgets?: DReportWidgets | any;
    dReportWidget?: DReportWidget | undefined;
    dReportWidgetsFilteredByRules: DReportWidgets;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default DReportWidgetsState;

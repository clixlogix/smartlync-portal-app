import { CustomError } from 'utils/error';
import { Filters, EssentialControlWidgets, EssentialControlWidgetss } from 'models';

/* --- STATE --- */
export interface EssentialControlWidgetssState {
    essentialControlWidgetss?: any;
    essentialControlWidgets?: EssentialControlWidgets | undefined;
    essentialControlWidgetssFilteredByRules: EssentialControlWidgetss;
    filters: Filters;
    formattedEssentialControlEvents?: [];
    defaultEventValues?: [];
    defaultValues: Object;
    filterValues: {};
    error: CustomError | undefined;
    isLoading: boolean;
    localFilters: any;
}

export default EssentialControlWidgetssState;

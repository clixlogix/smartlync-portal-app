import { FilterNames, Filters } from 'models';
import SelectFilterLoader from './SelectFilterNew/Loadable';
import SelectFaultCodeFilterLoader from './SelectFaultCodeFilterNew/Loadable';
import SelectStudTypeFilterLoader from './SelectStudTypeFilterNew/Loadable';
import SelectStudIdFilterLoader from './SelectStudIdFilterNew/Loadable';
import SelectDeviceNameFilterLoader from './SelectDeviceNameFilterNew/Loadable';
import ReportThresholdFilterLoader from './ReportThresholdFilter/Loadable';
import SelectEventTypeFilterLoader from './SelectEventTypeFilterNew/Loadable';
import MuiDateRangePicker from './MuiDateRangePicker';
import { SelectFieldLabelPos } from 'components/formFields';

export * from './SelectFilterNew';
export * from './SelectFaultCodeFilterNew';
export * from './SelectEventTypeFilterNew';
export * from './SelectStudTypeFilterNew';
export * from './SelectStudIdFilterNew';
export * from './SelectDeviceNameFilterNew';
export * from './ReportThresholdFilter';

export {
    SelectFilterLoader,
    SelectFaultCodeFilterLoader,
    SelectStudTypeFilterLoader,
    SelectDeviceNameFilterLoader,
    SelectStudIdFilterLoader,
    SelectEventTypeFilterLoader,
    ReportThresholdFilterLoader,
    MuiDateRangePicker,
};

export enum FilterActions {
    None = 'NoAction',
    FileUpload = 'FileUpload',
    ExportExcel = 'ExportExcel',
    ExportToPDF = 'ExportToPDF',
    ClearFilters = 'ClearFilters',
}

export interface SelectFilterProps {
    name: FilterNames;
    className?: string;
    label?: string;
    placeholder?: string;
    filters?: Filters;
    disabled?: boolean;
    labelPos?: SelectFieldLabelPos;
    data?: any; // filter data for each filter type
    options?: string[];
    faultCodeDefault?: string;
    multiple?: boolean;
    isStartcase?: boolean;
    languageControl?: string[]; // set here a name of filter which must to react on language switch

    onChange?(filters: any): void;
    onFilterAction?(action: FilterActions);
}

export enum DateRangeFormat {
    ANNUAL = '[Year] YYYY',
    WEEKLY = '[Week] W',
    DAILY = 'ddd',
    HOURLY = 'YYYYMMDD HH:MM:ss',
}

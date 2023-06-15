import { CustomError } from 'utils/error';
import { Filters, MttrTableSpr, MttrTableSprs } from 'models';

/* --- STATE --- */
export interface MttrTableSprsState {
    mttrTableSprs?: MttrTableSprs;
    mttrTableSpr?: MttrTableSpr | undefined;
    defaultValue?: MttrTableSprs;
    filters: Filters;
    columns?: string[];
    mttrData?: any[][];

    error: CustomError | undefined;
    isLoading: boolean;
}

export default MttrTableSprsState;

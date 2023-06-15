import { CustomError } from 'utils/error';
import { Filters, UploadListItem, UploadListItems } from 'models';

/* --- STATE --- */
export interface UploadStatsState {
    uploadListItems?: UploadListItems;
    uploadListItem?: UploadListItem | undefined;
    filters: Filters;
    filterValues: any;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default UploadStatsState;

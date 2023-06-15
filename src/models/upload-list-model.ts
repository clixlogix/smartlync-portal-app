import { Moment } from 'moment';
/**
 *
 *
 * @export
 * @interface UploadListItem
 */
export interface UploadListItem {
    dateTime: Moment;
    size: number;
    count: number;
    name: string;
}

export type UploadListItems = UploadListItem[];

export default UploadListItem;

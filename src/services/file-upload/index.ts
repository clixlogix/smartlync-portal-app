import { CustomError } from 'utils/error';
import { Filters /* FileUpload */ } from 'models';
import { FileObject } from 'material-ui-dropzone';

export type FileUpload = { [key: string]: Map<string, FileObject> };

export type FileObjects = Array<FileObject>;

export enum FileProgress {
    START = 'START',
    INPROGRESS = 'INPROGRESS',
    FINISHED = 'FINISHED',
    ERROR = 'ERROR',
    DONE = 'DONE',
}

/* --- STATE --- */
export interface FileUploadsState {
    files: FileUpload;
    uploadProgress: any;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default FileUploadsState;

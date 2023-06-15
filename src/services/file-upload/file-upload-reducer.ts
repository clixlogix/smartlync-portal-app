/*
 * Msg Slice
 *
 * Here we define:
 * - The shape of our auth container's slice of Redux store,
 * - All the actions which can be triggered for this slice, including their effects on the store.
 *
 * Note that, while we are using dot notation in our reducer, we are not actually mutating the state
 * manually. Under the hood, we use immer to apply these updates to a new copy of the state.
 * Please see https://immerjs.github.io/immer/docs/introduction for more information.
 *
 */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { Filters } from 'models';
import { FileProgress, FileUploadsState } from '.';
import { FileObject } from 'material-ui-dropzone';

// The initial state of the FileUpload page
export const initialState: FileUploadsState = {
    files: {}, // new Map<string, FileObject>(),
    uploadProgress: {},
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const fileUploadsSlice = createSlice({
    name: 'fileUploads',
    initialState,
    reducers: {
        addFiles(state, action: PayloadAction<any>) {
            const { key = 'default', files = [] } = action.payload;

            if (!state.files[key]) {
                state.files[key] = new Map<string, FileObject>();
            }

            files.forEach((file: FileObject) => {
                const { name = '' } = file.file;

                state.files[key].set(name, file);
                state.uploadProgress[key] = {};
                state.uploadProgress[key][name] = {};
            });
        },
        delFiles(state, action: PayloadAction<FileObject[]>) {
            // state.files = state.files.filter((file) => !action.payload.some((f) => f.file.name === file.file.name));
        },
        fileUploads(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        uploadProgress(state, action: PayloadAction<any>) {
            const {
                key = '',
                name = '',
                progress = FileProgress.START,
                total = 0,
                loaded = 0,
                timeStamp = 0,
                percentCompleted = 0,
            } = action.payload;

            if (name === '*') {
                if (state.uploadProgress[key]) {
                    Object.keys(state.uploadProgress[key]).forEach((item) => {
                        state.uploadProgress[key][item] = {
                            key,
                            name,
                            progress,
                            total,
                            loaded,
                            startTime: timeStamp,
                            timeStamp,
                            percentCompleted,
                        } as any;
                    });
                }
            } else {
                if (!state.uploadProgress[key] || !state.uploadProgress[key][name]) {
                    state.uploadProgress[key][name] = {
                        key,
                        name,
                        progress,
                        total,
                        loaded,
                        startTime: timeStamp,
                        timeStamp,
                        timeSpan: timeStamp,
                        percentCompleted,
                    } as any;
                }

                if (state.uploadProgress[key] && state.uploadProgress[key][name]) {
                    const startTime = !state.uploadProgress[key][name].startTime
                        ? timeStamp
                        : state.uploadProgress[key][name].startTime;
                    const timeSpan = timeStamp - state.uploadProgress[key][name].timeStamp;
                    const chunk = loaded - state.uploadProgress[key][name].loaded;
                    state.uploadProgress[key][name] = {
                        key,
                        name,
                        progress: loaded > total ? progress : FileProgress.FINISHED,
                        total,
                        chunk,
                        loaded,
                        startTime,
                        timeStamp,
                        timeSpan,
                        percentCompleted,
                    } as any;
                }
            }
        },
        setFileUploads(state, action: PayloadAction<any /* FileUpload */>) {
            state.files = action.payload;
        },
        error(state, action: PayloadAction<CustomError>) {
            state.error = action.payload;
        },
        loading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        clear(state, action: PayloadAction<string>) {
            const key = action.payload || 'default';

            if (state.files[key]) {
                state.files[key].clear();
            }
        },
    },
});

export const { actions: fileUploadsActions, reducer: fileUploadsReducer, name: fileUploadsKey } = fileUploadsSlice;

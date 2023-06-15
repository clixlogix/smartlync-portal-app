import Constant from 'constants/index';
import { FilterNames, Filters } from 'models';
import { eventChannel } from 'redux-saga';
import { call, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { getFilterParams, getLineFromCarclass } from 'utils';
import { request } from 'utils/request';
import { FileObjects, FileProgress } from '.';
import { fileUploadsActions } from './file-upload-reducer';
import { selectFileUploads, selectFileUploadsFilters } from './file-upload-selectors';

function createUploader(key: string, fileWithUrls, options) {
    let emit;
    const chan = eventChannel((emitter) => {
        emit = emitter;
        return () => {}; // it's necessarily. event channel should
        // return unsubscribe function. In our case
        // it's empty function
    });

    const promises = fileWithUrls.map(async (file) =>
        request({
            method: 'PUT',
            url: file.url,
            data: file.file,
            noauth: true,
            onUploadProgress: (event) => {
                if (event.loaded.total === 1) {
                    emit({ progressEvent: event, progress: FileProgress.FINISHED, key, name: file.file.name });
                }

                emit({ progressEvent: event, progress: FileProgress.INPROGRESS, key, name: file.file.name });
            },
        }).catch((e) => {
            emit({ error: e, progressEvent: undefined, progress: FileProgress.ERROR, key, name: file.file.name });
        }),
    );

    return [Promise.all(promises), chan];
}

/**
 *  repos request/response handler
 */
export function* getFileUploads(action) {
    const key = action.payload.fileType;

    const files: FileObjects = (yield select(selectFileUploads))(key);

    try {
        // Call our request helper (see 'utils/request')
        yield put(fileUploadsActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const paramNames: FilterNames[] = [FilterNames.plantId, FilterNames.systemType, FilterNames.fileType];
        const { ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectFileUploadsFilters)) }),
        );

        if (!!token) {
            yield put(
                fileUploadsActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.fileUploads,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params },
        };

        const filelist = files.map((file) => ({ originalname: file.file.name }));

        const URL = params?.systemType === 'SWS' ? Constant.getUploadUrl : Constant.getUploadUrlSpr;

        const uploadUrls: any[] = yield call(request, {
            ...options,
            method: 'POST',
            url: URL,
            data: { files: filelist },
        });

        const fileWithUrls = files.map((file, i) => ({
            ...file,
            ...filelist[i],
            ...uploadUrls[i],
        }));

        yield put(
            fileUploadsActions.uploadProgress({
                key: '*',
                name: '*',
                progress: FileProgress.START,
            }),
        );
        const [uploadPromise, chan] = createUploader(key, fileWithUrls, options);
        yield fork(watchOnProgress, chan);

        yield call(() => uploadPromise);
    } catch (err: any) {
        console.warn('getFileUploads.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                fileUploadsActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                fileUploadsActions.error({
                    name: 'error',
                    message: 'Getting fileUploads failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(fileUploadsActions.loading(false));
}

function* watchOnProgress(chan) {
    while (true) {
        const { progressEvent = {}, ...rest } = yield take(chan);
        const { total, loaded, timeStamp } = progressEvent;
        const percentCompleted = total === 0 ? 0 : Math.round((loaded * 100) / total);

        yield put(fileUploadsActions.uploadProgress({ ...rest, total, loaded, timeStamp, percentCompleted }));
    }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* fileUploadsSaga() {
    // Watches for getFileUploads actions and calls getFileUploads when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(fileUploadsActions.fileUploads.type, getFileUploads);
}

export default fileUploadsSaga;

/**
 *
 * FileUpload
 *
 */

import { UploadPanel } from 'components/panels/UploadPanel';
import { Page, PageProps } from 'pages';
import { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fileUploadsKey, fileUploadsReducer } from 'services/file-upload/file-upload-reducer';
import { fileUploadsSaga } from 'services/file-upload/file-upload-saga';
import { selectFileUploads /*, selectFileUploadsIsLoading*/ } from 'services/file-upload/file-upload-selectors';
import styled from 'styled-components/macro';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { messages } from './messages';

import './FileUpload.scss';

interface FileUploadProps extends PageProps { }

export const FileUpload: Page<FileUploadProps> = memo((props: FileUploadProps) => {
    useInjectReducer({ key: fileUploadsKey, reducer: fileUploadsReducer });
    useInjectSaga({ key: fileUploadsKey, saga: fileUploadsSaga });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fileUploads = useSelector(selectFileUploads);
    // const fileUploadsIsLoading: boolean = useSelector(selectFileUploadsIsLoading);
    const { systemType = 'NA', plantId = 'NA' } = useSelector(selectBreadcrumbFilters);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dispatch = useDispatch();
    const history = useHistory();

    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t(messages.fileUploadPageTitle)}</title>
                <meta name="description" content="Description of FileUpload" />
            </Helmet>

            <Div className={' main-content-container '}>
                <Div className={' stanleyRow upload-panels '}>
                    <UploadPanel
                        fileType={'MeasurementData'}
                        title={t(messages.cyclesLabel)}
                        dropzoneText={t(messages.dropzoneText)}
                        systemType={systemType}
                        plantId={plantId}
                    />

                    <UploadPanel
                        fileType={'Events'}
                        title={t(messages.sytemEventsLabel)}
                        dropzoneText={t(messages.dropzoneText)}
                        systemType={systemType}
                        plantId={plantId}
                    />

                    <UploadPanel
                        fileType={'Other'}
                        title={t(messages.maintenanceLabel)}
                        dropzoneText={t(messages.dropzoneText)}
                        systemType={systemType}
                        plantId={plantId}
                    />
                </Div>
            </Div>
        </>
    );
});

const Div = styled.div``;

export default FileUpload;

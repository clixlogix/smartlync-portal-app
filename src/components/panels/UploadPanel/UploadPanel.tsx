/**
 *
 * UploadPanel
 *
 */
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { fileUploadsActions, fileUploadsReducer, fileUploadsKey } from 'services/file-upload/file-upload-reducer';
import { selectFileUploads, selectUploadProgress } from 'services/file-upload/file-upload-selectors';

import { fileUploadsSaga } from 'services/file-upload/file-upload-saga';
import { FileObjects } from 'services/file-upload';
// import { formatFileSize, useQueryParam } from 'utils';
import { Plants } from 'models';
import Constants from 'constants/index';
import { Images } from 'constants/index';
import { messages } from './messages';
import { selectPlants } from 'services/plant/plant-selectors';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

import './UploadPanel.scss';

interface Props {
    title?: string;
    className?: string;
    dropzoneText?: string;
    fileType?: string;
    plantId: string;
    systemType: string;
}

export const UploadPanel = memo((props: Props) => {
    useInjectReducer({ key: fileUploadsKey, reducer: fileUploadsReducer });
    useInjectSaga({ key: fileUploadsKey, saga: fileUploadsSaga });

    const { t } = useTranslation();
    const { fileType = 'default', title = 'Upload', dropzoneText = t(messages.dropzoneText) } = props;

    const systemTypeOptions = ['SWS', 'SPR'];
    const [systemType, setSystemType] = useState<string>(props.systemType);
    const [plantId, setPlantId] = useState<string>(props.plantId);

    const files = useSelector(selectFileUploads)(fileType);
    const uploadProgress = useSelector(selectUploadProgress)(fileType);

    const plants: Plants = useSelector(selectPlants);

    const inprogress = Object.values(uploadProgress as any[]).filter((f) => f.total !== f.loaded).length;

    const dispatch = useDispatch();

    const onFilesAdded = (files: FileObjects) => {
        dispatch(fileUploadsActions.addFiles({ key: fileType, files }));
    };

    const onUploadFiles = () => {
        dispatch(fileUploadsActions.fileUploads({ fileType, plantId, systemType }));
    };

    const renderProgress = (file: File) => {
        const { /* chunk = 0, timeSpan = 0.0,*/ percentCompleted = 0.0 } = uploadProgress[file?.name] || ({} as any);

        // const [size = 0, units = 'Bytes'] = formatFileSize(chunk, 3);

        // const rate = !timeSpan ? 0 : (size as number) / timeSpan;

        return (
            <LinearProgress
                variant="determinate"
                value={percentCompleted}
                sx={{
                    backgroundColor: `rgba(18, 18, 18, 1)`,
                }}
            />
        );
    };

    const onClearFiles = () => {
        dispatch(fileUploadsActions.clear(fileType));
    };

    const onHandlePlantIdChange = (e) => {
        setPlantId(e.target?.value);
    };

    const onHandleSystemTypeChange = (e) => {
        setSystemType(e.target?.value);
    };

    const renderPlantIdSelect = () => {
        return (
            <FormControl variant="standard" fullWidth>
                <InputLabel
                    id="demo-simple-select-standard-label"
                    disabled={!(files.length > 0)}
                    sx={{
                        color: 'rgba(255, 255, 255, 1) !important',
                        // backgroundColor: 'rgba(255, 219, 10, 1) !important',
                        '&: disabled': {
                            color: 'rgba(255, 255, 255, 0.5) !important',
                            // backgroundColor: 'rgba(255, 255, 255, 0.12) !important',
                        },
                    }}
                >
                    {'*Plant ID'}
                </InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={plantId}
                    onChange={onHandlePlantIdChange}
                    label="*Plant ID"
                    disabled={!(files.length > 0)}
                    sx={{
                        color: 'rgba(255, 219, 10, 1) !important',
                        // backgroundColor: 'rgba(255, 219, 10, 1) !important',
                        '&: disabled': {
                            color: 'rgba(255, 255, 255, 0.5) !important',
                            // backgroundColor: 'rgba(255, 255, 255, 0.12) !important',
                        },
                    }}
                >
                    {plants.map((item) => {
                        return <MenuItem value={item?.id}>{item?.id}</MenuItem>;
                    })}
                </Select>
            </FormControl>
        );
    };

    const renderSystemTypeSelect = () => {
        return (
            <FormControl variant="standard" fullWidth>
                <InputLabel
                    id="demo-simple-select-standard-label"
                    disabled={!(files.length > 0)}
                    sx={{
                        color: 'rgba(255, 255, 255, 1) !important',
                        // backgroundColor: 'rgba(255, 219, 10, 1) !important',
                        '&: disabled': {
                            color: 'rgba(255, 255, 255, 0.5) !important',
                            // backgroundColor: 'rgba(255, 255, 255, 0.12) !important',
                        },
                    }}
                >
                    {'*System Type'}
                </InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={systemType}
                    onChange={onHandleSystemTypeChange}
                    label="*System Type"
                    disabled={!(files.length > 0)}
                    sx={{
                        color: 'rgba(255, 219, 10, 1) !important',
                        // backgroundColor: 'rgba(255, 219, 10, 1) !important',
                        '&: disabled': {
                            color: 'rgba(255, 255, 255, 0.5) !important',
                            // backgroundColor: 'rgba(255, 255, 255, 0.12) !important',
                        },
                    }}
                >
                    {systemTypeOptions.map((item) => {
                        return <MenuItem value={item}>{item}</MenuItem>;
                    })}
                </Select>
            </FormControl>
        );
    };

    const dropAreaOptions: any = {
        acceptedFiles: Constants.uploadAcceptedFiles,
        maxFileSize: 5000000000000,
        filesLimit: 200,
        onAdd: (fileObjs) => onFilesAdded(fileObjs),
        multiple: true,
        showAlerts: true,
        showPreviews: true,
        dropzoneText,
    };

    return (
        <Container
            sx={{
                background: 'rgba(18, 18, 18, 1)',
                height: '100%',
                minWidth: '25% !important',
                width: '30% !important',
                border: files.length > 0 ? '1px solid #FFF' : undefined,
                borderRadius: '4px',
                paddingTop: '16px',
                paddingBottom: '24px',
            }}
        >
            <Stack spacing={2} sx={{ height: '100%' }}>
                <Box>
                    <Typography variant="h6" component="div" sx={{ color: '#FFF !important' }}>
                        {title}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        backgorund: 'rgba(255,255,255,0.04)',
                        border: '1px dashed rgba(255,255,255,0.23)',
                        borderRadius: '4px',
                    }}
                >
                    <DropzoneAreaBase {...dropAreaOptions} />
                </Box>

                <Box
                    sx={{
                        backgorund: 'rgba(255,255,255,0.04)',
                        border: '1px dashed rgba(255,255,255,0.23)',
                        borderRadius: '4px',
                        padding: '16px',
                        // height: '206px',
                        height: '30%',
                        maxHeight: '30%',
                    }}
                >
                    <Stack spacing={2}>
                        <Stack spacing={2} direction={'row'}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: files.length > 0 ? '#FFF !important' : 'rgba(255,255,255,0.7) !important',
                                }}
                            >
                                {'Upload Status'}
                            </Typography>
                        </Stack>
                        <Box
                            sx={{
                                height: 130,
                                maxHeight: 130,
                                overflow: 'hidden',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: !(files.length > 0) ? 'center' : undefined,
                                alignItems: !(files.length > 0) ? 'center' : undefined,
                            }}
                        >
                            {files?.map((obj: FileObject) => {
                                const { file } = obj;

                                return (
                                    <Box
                                        sx={{
                                            backgorund: 'rgba(255,255,255,0.04)',
                                            border: '1px dashed rgba(255,255,255,0.23)',
                                            borderRadius: '4px',
                                            padding: '4px',
                                            width: '100%',
                                        }}
                                    >
                                        <Stack>
                                            <Box
                                                key={file.name}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Typography variant="body1" sx={{ color: '#FFF !important' }}>
                                                    {file.name}
                                                </Typography>
                                                <RestoreFromTrashIcon
                                                    sx={{ color: 'rgba(255,255,255,0.56)' }}
                                                    onClick={() => onClearFiles()}
                                                />
                                            </Box>
                                            {renderProgress(file)}
                                        </Stack>
                                    </Box>
                                );
                            })}
                            {!(files.length > 0) && <img src={Images.Empty} alt={'logo'} />}
                        </Box>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        backgorund: 'rgba(255,255,255,0.04)',
                        border: '1px dashed rgba(255,255,255,0.23)',
                        borderRadius: '4px',
                        padding: '16px',
                        height: '33%',
                        maxHeight: '33%',
                    }}
                >
                    <Stack spacing={2}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: files.length > 0 ? '#FFF !important' : 'rgba(255,255,255,0.7) !important',
                            }}
                        >
                            {'File Details'}
                        </Typography>
                        <Box>
                            <Stack direction={'row'} spacing={2}>
                                {renderPlantIdSelect()}
                                {renderSystemTypeSelect()}
                            </Stack>
                        </Box>
                    </Stack>
                </Box>

                <Button
                    variant="contained"
                    disabled={!(files.length > 0)}
                    onClick={onUploadFiles}
                    sx={{
                        color: 'rgba(0, 0, 0, 0.87) !important',
                        backgroundColor: 'rgba(255, 219, 10, 1) !important',
                        '&: disabled': {
                            color: 'rgba(255, 255, 255, 0.3) !important',
                            backgroundColor: 'rgba(255, 255, 255, 0.12) !important',
                        },
                    }}
                >
                    {'Apply'}
                </Button>
            </Stack>
        </Container>
    );
});

export default UploadPanel;

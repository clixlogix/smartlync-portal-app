import React, { useEffect, useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import useMediaQuery from '@mui/material/useMediaQuery';
import { isDemoTenant, isHidden } from 'utils';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { faultCodesActions, faultCodesReducer, faultCodesKey } from 'services/fault/fault-code/fault-code-reducer';
import { studTypesReducer, studTypesKey } from 'services/stud/stud-type/stud-type-reducer';
import { deviceNamesReducer, deviceNamesKey } from 'services/device/device-name/device-name-reducer';
import {
    getLastUpdatedActions,
    getLastUpdatedReducer,
    getLastUpdatedKey,
} from 'services/get-last-updated/get-last-updated-reducer';
import { selectDeviceNames } from 'services/device/device-name/device-name-selectors';
import { selectStudTypes } from 'services/stud/stud-type/stud-type-selectors';
import { faultCodesSaga } from 'services/fault/fault-code/fault-code-saga';
import { studTypesSaga } from 'services/stud/stud-type/stud-type-saga';
import { deviceNamesSaga } from 'services/device/device-name/device-name-saga';
import { getAllGetLastUpdatedsSaga } from 'services/get-last-updated/sagas/get-last-updated-saga-get-all';
import { selectFaultCodes } from 'services/fault/fault-code/fault-code-selectors';
import CheckIcon from '@mui/icons-material/Check';
import { selectGetLastUpdateds } from 'services/get-last-updated/get-last-updated-selectors';
import { ReadLabelValue } from 'components/ReadLabelValue';
import { Filters, FaultCodes, StudTypes, DeviceNames } from 'models';
import moment from 'moment';
import { messages } from './messages';

import './FilterPanel.scss';

export enum FilterActions {
    None = 'NoAction',
    FileUpload = 'FileUpload',
    ExportExcel = 'ExportExcel',
    ExportToPDF = 'ExportToPDF',
    ClearFilters = 'ClearFilters',
}

interface FilterPanelProps {
    filters?: Filters;
    className?: string;
    disabled?: boolean;
    studIdShown?: boolean;

    status?: string | React.ReactNode;
    faultCodeDefault?: string;
    onChange?(filters: any): void;
    onFilterAction?(action: FilterActions);
}

export function FilterPanel(props: FilterPanelProps) {
    const [params] = useState({ ...props.filters });

    const { t, i18n } = useTranslation();

    useInjectReducer({ key: faultCodesKey, reducer: faultCodesReducer });
    useInjectSaga({ key: faultCodesKey, saga: faultCodesSaga });

    useInjectReducer({ key: studTypesKey, reducer: studTypesReducer });
    useInjectSaga({ key: studTypesKey, saga: studTypesSaga });

    useInjectReducer({ key: deviceNamesKey, reducer: deviceNamesReducer });
    useInjectSaga({ key: deviceNamesKey, saga: deviceNamesSaga });

    useInjectReducer({ key: getLastUpdatedKey, reducer: getLastUpdatedReducer });
    useInjectSaga({ key: getLastUpdatedKey, saga: getAllGetLastUpdatedsSaga });

    const dispatch = useDispatch();
    const { studType, deviceName, eventType, eventCode } = props.filters as any;
    const { className, onFilterAction, status, faultCodeDefault } = props;

    // temporary fix to show first value
    let value = eventCode?.split(',')?.[0] || faultCodeDefault;
    let screenSize;
    if (useMediaQuery('(max-width:1499px)')) {
        screenSize = true;
    }

    const faultCodes: FaultCodes = useSelector(selectFaultCodes);
    const studTypes: StudTypes = useSelector(selectStudTypes);
    const deviceNames: DeviceNames = useSelector(selectDeviceNames);

    const lastUpdatedTime: any = useSelector(selectGetLastUpdateds);
    const dataUptodate = moment(lastUpdatedTime).format('DD/MM/YYYY HH:mm a');

    useEffect(() => {
        dispatch(faultCodesActions.faultCodes(params));
        // dispatch(studTypesActions.studTypes(params));
        // dispatch(deviceNamesActions.deviceNames(params));
        dispatch(getLastUpdatedActions.getAllGetLastUpdateds({}));
    }, [dispatch, params]);

    const onHandleFilterActions = (action: FilterActions) => {
        if (onFilterAction) {
            onFilterAction(action);
        }
    };

    let descriptionFaultcode: string[] = [];
    if (faultCodes) {
        faultCodes.forEach((item, index) => {
            const faultCode = item.eventNumber ? item.eventNumber : item;
            const descp = item.description ? item.description : '';
            descriptionFaultcode.push(`${faultCode} ${descp}`);
        });
    }

    if (descriptionFaultcode.length > 0) {
        descriptionFaultcode.forEach((data) => {
            const fc = data.split(' ', 1)[0];
            if (value === fc) {
                value = data;
            }
        });
    }

    const fCodeMatch = descriptionFaultcode.find((s) => s.startsWith(eventCode))?.match(/(^\d+) (.*)/);

    const checker = (value, label) => {
        let checkVar = false;
        switch (label) {
            case 'eventCode':
                if (value.split(',').length === faultCodes.length) {
                    checkVar = true;
                    return checkVar;
                }
                break;
            case 'studType':
                if (value.split(',').length === studTypes.length) {
                    checkVar = true;
                    return checkVar;
                }
                break;
            case 'deviceName':
                if (value.split(',').length === deviceNames.length) {
                    checkVar = true;
                    return checkVar;
                }
                break;
            default:
                return checkVar;
        }
    };

    return (
        <Fragment>
            <Div className={`${className} stanleyRow`}>
                {!screenSize && (
                    <Div className={'selectors stanleyCol'}>
                        <Div>
                            {eventCode && (
                                <ReadLabelValue
                                    checkIfAll={checker(eventCode, 'eventCode')}
                                    label={t(messages.filterByFaultCode)}
                                    // temporary fix to show first value
                                    value={eventCode?.split(',')?.[0]}
                                    description={fCodeMatch?.[2]}
                                />
                            )}
                            {studType && (
                                <ReadLabelValue
                                    checkIfAll={checker(studType, 'studType')}
                                    label={t(messages.filterByStudType)}
                                    // temporary fix to show first value
                                    value={studType}
                                />
                            )}
                            {deviceName && (
                                <ReadLabelValue
                                    checkIfAll={checker(deviceName, 'deviceName')}
                                    label={t(messages.filterByDeviceName)}
                                    // temporary fix to show first value
                                    value={deviceName}
                                />
                            )}
                        </Div>
                    </Div>
                )}
                <Div className={'info-panel stanleyCol '}>
                    {status && (
                        <Div className={'status-message'}>
                            <CheckIcon style={{ color: '#149B74', fontSize: '20px' }}></CheckIcon>
                            {t(messages.dataUptodate)}
                            &nbsp;
                            {dataUptodate}.
                        </Div>
                    )}
                    <Div className={'project-info stanleyRow'}>
                        <Div className="info">
                            <span className="label">{t(messages.faultAssignment)}</span>
                            <span className="value">{t(messages.faultAssignmentVal)}</span>
                        </Div>
                        <Div className="info">
                            <span className="label">{t(messages.event)}</span>
                            <span className="value">
                                {eventType && eventType !== '' ? eventType : t(messages.eventVal)}
                            </span>
                        </Div>
                    </Div>
                    <Div className={'download-options stanleyRow'}>
                        {!isHidden(['volvo', 'daimler', 'jlr', 'demo', 'demoStage', 'rivian']) && (
                            <Div
                                className="download-option"
                                onClick={() => onHandleFilterActions(FilterActions.FileUpload)}
                            >
                                <span className="label">{t(messages.fileUpload)}</span>
                                <i className="fa fa-upload fileUpload"></i>
                            </Div>
                        )}
                        {/* {!isHidden(['v1daimler', 'volvo', 'daimler']) && (
                            <>
                                <Div
                                    className="download-option"
                                    onClick={() => onHandleFilterActions(FilterActions.ExportExcel)}
                                >
                                    <span className="label">{t(messages.exportToExcel)}</span>
                                    <i className="fa fa-file-excel-o"></i>
                                </Div>
                            </>
                        )} */}
                        {!isHidden(['volvo', 'daimler']) && (
                            <>
                                <Div
                                    className="download-option"
                                    onClick={() => onHandleFilterActions(FilterActions.ExportToPDF)}
                                >
                                    <span className="label">{t(messages.exportToPdf)}</span>
                                    <i className="fa fa-file-pdf-o"></i>
                                </Div>
                            </>
                        )}
                    </Div>
                </Div>
            </Div>
        </Fragment>
    );
}

const Div = styled.div``;

export default FilterPanel;

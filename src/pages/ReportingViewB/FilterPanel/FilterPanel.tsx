import React, { Fragment, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Filters } from 'models';
import styled from 'styled-components/macro';
import Box from '@mui/material/Box';
import { ReadLabelValue } from 'components/ReadLabelValue';
import { deviceNamesKey, deviceNamesReducer } from 'services/device/device-name/device-name-reducer';
import deviceNamesSaga from 'services/device/device-name/device-name-saga';
import { studTypesActions } from 'services/stud/stud-type/stud-type-reducer';
import { deviceNamesActions } from 'services/device/device-name/device-name-reducer';
import { studTypesKey, studTypesReducer } from 'services/stud/stud-type/stud-type-reducer';
import studTypesSaga from 'services/stud/stud-type/stud-type-saga';
import { useInjectReducer, useInjectSaga } from 'utils';
import SelectField from 'components/formFields/SelectFieldNew';
import moment from 'moment';
import { messages } from './messages';

import './FilterPanel.scss';

export enum FilterActions {
    None = 'NoAction',
    FileUpload = 'FileUpload',
    ExportExcel = 'ExportExcel',
    ExportToPDF = 'ExportToPDF',
    CalenderDateChange = 'CalenderDateChange',
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
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    useInjectReducer({ key: studTypesKey, reducer: studTypesReducer });
    useInjectSaga({ key: studTypesKey, saga: studTypesSaga });

    useInjectReducer({ key: deviceNamesKey, reducer: deviceNamesReducer });
    useInjectSaga({ key: deviceNamesKey, saga: deviceNamesSaga });

    const { studType, deviceName, event, eventCode } = props.filters as any;
    const { className, onChange, onFilterAction } = props;

    const faultAssignments: string[] = useMemo(
        () => [`${t(messages.maintainance)}`, `${t(messages.active)}`, `${t(messages.all)}`],
        [t],
    );
    const events: any[] = t(messages.events).split(',');

    const weekDays = useMemo(() => {
        return moment.weekdays(true);
    }, [i18n.language]);

    const weekDay = useMemo(
        () => (props.filters?.weekDayNo ? weekDays[props.filters?.weekDayNo] : props.filters?.weekDay),
        [props.filters, weekDays],
    );

    const faultAssignment = useMemo(() => faultAssignments[props.filters?.faultAssignment], [
        props.filters,
        faultAssignments,
    ]);

    useEffect(() => {
        const params: any = { ...props.filters };

        dispatch(studTypesActions.studTypes(params));
        dispatch(deviceNamesActions.deviceNames(params));
    }, [dispatch, props.filters]);

    const onHandleFilterActions = (action: FilterActions) => {
        if (onFilterAction) {
            onFilterAction(action);
        }
    };

    const onHandleOnChange = (value: Filters) => {
        if (onChange) {
            if (value.weekDay) {
                value.weekDayNo = weekDays.indexOf(value.weekDay);
            }
            if (value.faultAssignment) {
                value.faultAssignment = faultAssignments.indexOf(value.faultAssignment);
            }
            if (!value?.weekDay) value.weekDayNo = undefined;
            onChange(value);
        }
    };

    return (
        <Fragment>
            <Div className="filter-panel-B">
                <Div className={`${className} filter-panel-reportB stanleyRow`}>
                    <Div className={'div-flex-auto'}>
                        <Div className={'project-info-reportB column'}>
                            <Div className="stanleyRow">
                                <Div className={'div-flex-row'}>
                                    <Box sx={{ display: 'flex' }}>
                                        <SelectField
                                            id="FilterByFaultAssignment"
                                            className={'x-cls-filter-fault-assignment'}
                                            label={t(messages.faultAssignment)}
                                            options={faultAssignments}
                                            value={faultAssignment}
                                            onChange={(value) => onHandleOnChange({ faultAssignment: value })}
                                            placeholder={t(messages.all)}
                                            disableClearable={true}
                                        />
                                        <SelectField
                                            id="FilterByWeekDay"
                                            className={'x-cls-filter-week-day'}
                                            label={t(messages.weekDay)}
                                            options={weekDays}
                                            value={weekDay}
                                            onChange={(value) => onHandleOnChange({ weekDay: value })}
                                            placeholder={t(messages.all)}
                                        />
                                        <SelectField
                                            id="FilterByEvent"
                                            className={'x-cls-filter-event'}
                                            label={t(messages.event)}
                                            options={events}
                                            value={event}
                                            onChange={(value) => onHandleOnChange({ event: value })}
                                            placeholder={t(messages.all)}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}></Box>
                                </Div>
                                <Div className={'row-reverse'}>
                                    <Div
                                        className="download-option-reportB"
                                        onClick={() => onHandleFilterActions(FilterActions.ExportToPDF)}
                                    >
                                        <Span className="label">{t(messages.exportToPdf)}</Span>
                                        <i
                                            className="fa fa-file-pdf-o"
                                            style={{ fontSize: '16px', color: '#FFDB0A' }}
                                        ></i>
                                    </Div>
                                </Div>
                            </Div>
                            <Div className="stanleyColumn filterRow">
                                {studType && (
                                    <ReadLabelValue
                                        label={t(messages.filterByStudType)}
                                        // temporary fix to show first value
                                        value={studType}
                                    />
                                )}
                                {deviceName && (
                                    <ReadLabelValue
                                        label={t(messages.filterByDeviceName)}
                                        // temporary fix to show first value
                                        value={deviceName}
                                    />
                                )}
                                {eventCode && (
                                    <ReadLabelValue
                                        label={t(messages.filterByFault)}
                                        // temporary fix to show first value
                                        value={eventCode}
                                    />
                                )}
                            </Div>
                        </Div>
                    </Div>
                </Div>
            </Div>
        </Fragment>
    );
}

const Div = styled.div``;
const Span = styled.span``;

export default FilterPanel;

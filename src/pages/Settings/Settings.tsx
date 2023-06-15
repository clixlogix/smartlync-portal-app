/**
 *
 * Settings
 *
 */
import React, { useState, memo, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import Container from '@mui/material/Container';
import moment, { Moment } from 'moment';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { settingsActions, settingsReducer, settingsKey } from 'services/settings/settings-reducer';
import { selectSettingss } from 'services/settings/settings-selectors';
import { getAllSettingssSaga } from 'services/settings/sagas/settings-saga-get-all';
import { OperationsForm } from 'components/OperationsForm/OperationsForm';
import { selectOpenForm } from 'services/operations-form/operations-form-selectors';
import { formatDate } from 'utils/formatDate';
import { Operation } from './Operation';
import { Settingss } from 'models';
import { Page, PageProps } from 'pages';
import { messages } from './messages';
import { actions, newOperation, reducer as openReducer } from 'services/operations-form/operations-form-reducer';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import './Settings.scss';

interface SettingsProps extends PageProps {}

export interface OperationSchema {
    id?: string;
    type: string;
    operationName: string;
    startTime?: Moment;
    endTime?: Moment;
    startDate?: Moment;
    endDate?: Moment;
}

export interface OperationsSchema {
    shift: OperationSchema[];
    break: OperationSchema[];
}

export enum FormType {
    ADD = 'add',
    EDIT = 'edit',
}

const initialFormValues = {
    type: '',
    operationName: '',
    startTime: moment(),
    endTime: moment(),
    startDate: moment(),
    endDate: moment(),
};

export const Settings: Page<SettingsProps> = memo((props: SettingsProps) => {
    useInjectReducer({ key: settingsKey, reducer: settingsReducer });
    useInjectReducer({ key: newOperation, reducer: openReducer });

    useInjectSaga({ key: settingsKey, saga: getAllSettingssSaga });

    const settingss: Settingss | undefined = useSelector(selectSettingss);
    const isOpen = useSelector(selectOpenForm);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [formType, setFormType] = useState<string>(FormType.ADD);

    const [formattedOperations] = useMemo(() => {
        let obj: any = {
            shift: [],
            break: [],
        };

        (settingss || []).forEach((setting) => {
            return setting.type?.toLowerCase() === 'break' ? obj.break.push(setting) : obj.shift.push(setting);
        });
        return [obj];
    }, [settingss]);

    const getOperation = (operation: OperationSchema) => {
        const [start, end] = formatDate(operation.startTime, operation.endTime, operation.startDate, operation.endDate);

        const formattedOperation: OperationSchema = {
            ...operation,
            id: `1-${moment().valueOf()}`,
            startDate: start,
            endDate: end,
        };

        dispatch(settingsActions.setOperation(formattedOperation));
    };

    const editOperation = (fields) => {
        dispatch(settingsActions.editOperation(fields));
    };

    const [formValues, setFormValues] = useState(initialFormValues);

    const handleOpenForm = (id = null) => {
        if (id) {
            const newFormValues = settingss?.filter((item) => item.id === id) || initialFormValues;
            setFormValues(newFormValues?.[0]);
        } else {
            setFormValues(initialFormValues);
        }
        dispatch(actions.isOpen());
    };

    return (
        <>
            <Helmet>
                <title>{t(messages.settingsPageTitle)}</title>
                <meta name="description" content="Description of Settings" />
            </Helmet>

            <Container maxWidth="xl" className="x-cls-settings-container">
                {isOpen && (
                    <OperationsForm
                        getOperation={getOperation}
                        editOperation={editOperation}
                        values={formValues}
                        formType={formType}
                    />
                )}
                <Div className={'x-cls-settings-body x-cls-data-panel-container'}>
                    <Div className="toolbar-section">
                        <Div className="left-section"></Div>
                        <Div className="right-section"></Div>
                    </Div>

                    <Div className="x-cls-settings-container opertions-wrapper">
                        <Div className="top-wrapper">
                            <span className="operations-title">{t(messages.settingsOperation)}</span>
                            <button
                                className="operations-button"
                                onClick={() => {
                                    setFormType(FormType.ADD);
                                    handleOpenForm();
                                }}
                            >
                                <span className="plus" style={{ color: 'yellow' }}>
                                    &#43;
                                </span>
                                <span className="add">{t(messages.addNew)}</span>
                            </button>
                        </Div>
                        <Div className="operation-block">
                            <span className="operation-name">{t(messages.shifts)}</span>
                            <Div className="operation-table">
                                <Div className="operation-table-header">
                                    <span>{t(messages.shiftName)}</span>
                                    <span>{t(messages.timeFrom)}</span>
                                    <span>{t(messages.timeTo)}</span>
                                    <span>{t(messages.dateFrom)}</span>
                                    <span>{t(messages.dateTo)}</span>
                                    <span>{t(messages.actions)}</span>
                                </Div>
                                {formattedOperations.shift.map((item) => {
                                    return (
                                        <Operation
                                            key={item.id}
                                            operation={item}
                                            handleClick={() => {
                                                setFormType(FormType.EDIT);
                                                handleOpenForm(item.id);
                                            }}
                                        />
                                    );
                                })}
                            </Div>
                        </Div>
                        <Div className="operation-block">
                            <span className="operation-name">{t(messages.breaks)}</span>
                            <Div className="operation-table">
                                <Div className="operation-table-header">
                                    <span>{t(messages.breakName)}</span>
                                    <span>{t(messages.timeFrom)}</span>
                                    <span>{t(messages.timeTo)}</span>
                                    <span>{t(messages.dateFrom)}</span>
                                    <span>{t(messages.dateTo)}</span>
                                    <span>{t(messages.actions)}</span>
                                </Div>
                                {formattedOperations.break.map((item) => {
                                    return (
                                        <Operation
                                            key={item.id}
                                            operation={item}
                                            handleClick={() => {
                                                setFormType(FormType.EDIT);
                                                handleOpenForm(item.id);
                                            }}
                                        />
                                    );
                                })}
                            </Div>
                        </Div>
                    </Div>
                </Div>
            </Container>
        </>
    );
});

const Div = styled.div``;

export default Settings;

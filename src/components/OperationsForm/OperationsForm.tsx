import React, { memo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import './OperationsForm.scss';
import TimeRangePicker from 'components/formFields/TimePicker/TimeRangePicker';
import moment, { Moment } from 'moment';
import { useDispatch } from 'react-redux';
import { actions } from 'services/operations-form/operations-form-reducer';
import { FormType, OperationSchema } from 'pages/Settings/Settings';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { useEffect } from 'react';
import { formatDate } from 'utils/formatDate';

export interface DateRange {
    startDate?: Moment;
    endDate?: Moment;
}

interface OperationsFormProps {
    getOperation: (operation: OperationSchema) => void;
    editOperation: (changedFields: any) => void;
    values?: OperationSchema;
    formType: string;
}

const initialValues = {
    type: '',
    operationName: '',
    startTime: moment(),
    endTime: moment(),
    startDate: moment(),
    endDate: moment(),
};

export const OperationsForm = memo(({ values, getOperation, editOperation, formType }: OperationsFormProps) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [formValues, setFormValues] = useState(values || initialValues);

    useEffect(() => {
        values && setFormValues(values);
    }, [values]);

    const timeDescriptor = {
        hour: t(messages.hour),
        minutes: t(messages.minutes),
    };

    const onSubmit = (values, { resetForm }) => {
        if (formType === FormType.EDIT) {
            const [start, end] = formatDate(values.startTime, values.endTime, values.startDate, values.endDate);

            const changedFields = {
                id: values.id,
                type: values.type,
                operationName: values.operationName,
                from: start,
                to: end,
            };

            editOperation(changedFields);
        } else {
            getOperation(values);
        }

        resetForm();
        dispatch(actions.isOpen());
    };

    const onValidate = ({ type, operationName, startTime, startDate, endTime, endDate }) => {
        const errors: any = {};
        if (!type) {
            errors.type = '*Please select the operation type';
        }
        if (!operationName) {
            errors.operationName = 'Required';
        }
        if (moment(startTime).valueOf() > moment(endTime).valueOf()) {
            errors.startTime = '"to" time must be bigger than "from" time';
        }

        if (moment(startDate).valueOf() > moment(endDate).valueOf()) {
            errors.startDate = '"to" date must be bigger than "from" date';
        }
        return errors;
    };

    return (
        <div className="operations-form-wrapper">
            <Formik initialValues={formValues as any} onSubmit={onSubmit} validate={onValidate}>
                {({ values, handleSubmit, handleChange }) => {
                    return (
                        <Form onSubmit={handleSubmit}>
                            <div className="form-header">
                                <h2>{t(messages.addNew)}</h2>
                                <span onClick={() => dispatch(actions.isOpen())}>&times;</span>
                            </div>
                            <div className="checkbox-wrapper">
                                <label htmlFor="checkbox-shift" className="checkbox-label">
                                    <Field
                                        id="checkbox-shift"
                                        className="checkbox"
                                        type="radio"
                                        name="type"
                                        value="shift"
                                    />
                                    {t(messages.shift)}
                                </label>
                                <label htmlFor="checkbox-break" className="checkbox-label">
                                    <Field
                                        id="checkbox-break"
                                        className="checkbox"
                                        type="radio"
                                        name="type"
                                        value="break"
                                    />
                                    {t(messages.break)}
                                </label>
                                <ErrorMessage name="type" className="type-error-message" component="div" />
                                <div className="form-group">
                                    <Field
                                        id="operationName"
                                        name="operationName"
                                        className="input"
                                        placeholder="Shift/Break Name"
                                        autoComplete="operationName"
                                        onChange={handleChange}
                                        required
                                    />
                                    <ErrorMessage name="operationName" className="error-message" component="div" />
                                </div>
                            </div>
                            <span className="datepickers-title">{t(messages.time)}:</span>
                            <div className="datepickers-wrapper">
                                <TimeRangePicker
                                    showTimeSelectOnly
                                    timeDescriptor={timeDescriptor}
                                    name="startTime"
                                    dateFormat="HH:mm"
                                    value={formValues?.startDate}
                                />
                                <span className="to">{t(messages.to)}</span>
                                <TimeRangePicker
                                    showTimeSelectOnly
                                    timeDescriptor={timeDescriptor}
                                    name="endTime"
                                    dateFormat="HH:mm"
                                    value={formValues?.endDate}
                                />
                            </div>
                            <ErrorMessage name="startTime" className="date-error-message" component="div" />
                            <span className="datepickers-title">{t(messages.date)}:</span>
                            <div className="datepickers-wrapper">
                                <TimeRangePicker
                                    showTimeSelect={false}
                                    placeholder="Select Start Date"
                                    name="startDate"
                                    dateFormat="dd.MM.yyyy"
                                />
                                <span className="to">{t(messages.to)}</span>
                                <TimeRangePicker
                                    showTimeSelect={false}
                                    placeholder="Select End Date"
                                    name="endDate"
                                    dateFormat="dd.MM.yyyy"
                                />
                            </div>
                            <ErrorMessage name="startDate" className="date-error-message" component="div" />
                            <hr className="underline" />
                            <div className="button-group">
                                <button onClick={() => dispatch(actions.isOpen())} className="button">
                                    {t(messages.cancel)}
                                </button>
                                {formType === FormType.ADD && (
                                    <button type="submit" className="button">
                                        {t(messages.add)}
                                    </button>
                                )}
                                {formType === FormType.EDIT && (
                                    <button type="submit" className="button">
                                        {t(messages.edit)}
                                    </button>
                                )}
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
});

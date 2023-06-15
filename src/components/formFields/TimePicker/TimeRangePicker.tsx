/**
 *
 * TimeRangePicker
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import DatePicker from 'react-datepicker';
import './TimeRangePicker.scss';
import { useField, useFormikContext } from 'formik';
import { Moment } from 'moment';

export interface DateRange {
    startDate?: Moment;
    endDate?: Moment;
}

interface Props {
    className?: string;
    field?: any;
    value?: Moment | DateRange;
    startDate?: any;
    endDate?: any;
    icon?: string;
    placeholder?: string;
    startDatePlaceholder?: string;
    endDatePlaceholder?: string;
    locale?: string;
    showWeekNumbers?: boolean;
    showTimeSelect?: boolean;
    showTimeInput?: boolean;
    timeFormat?: string;
    timeIntervals?: number;
    minDate?: Moment;
    customInput?: React.ReactNode;
    startDateCustomInput?: React.ReactNode;
    endDateCustomInput?: React.ReactNode;
    disabled?: boolean;
    onChange?(date: Moment, timePeriod: string);
    showTimeSelectOnly?: boolean;
    timeDescriptor?: { hour: string; minutes: string };
    timePeriod?: string;
    dateFormat?: string;
    name?: string;
}

export const TimeRangePicker = memo((props: Props) => {
    const DateInput = (className = 'date-picker-field-btn filter-btn') => ({ value = '1', onClick = () => {} }) => {
        const [leftPart, rightPart] = value.split(':');
        return (
            <Div className={`placeholder filter-btn ${className}`} onClick={onClick}>
                <span className="custom-input-value">
                    {value ? (
                        <span>
                            {leftPart}
                            {value.includes(':') && <span className="colon">:</span>}
                            {rightPart}
                        </span>
                    ) : (
                        placeholder
                    )}
                </span>
            </Div>
        );
    };

    const {
        placeholder,
        startDatePlaceholder = `${placeholder || '[Date][\n]DD.MM.YYYY HH:mm'}`,
        icon = 'calendar',
        className = '',
        // @ts-ignore
        locale = 'en',
        showTimeSelect = true,
        value,
        startDateCustomInput,
        customInput,
        showWeekNumbers = false,
        timeFormat = 'HH:mm',
        timeIntervals = 60,
        minDate,
        disabled = false,
        onChange,
        timeDescriptor,
        showTimeSelectOnly = false,
        timePeriod,
        dateFormat,
        name,
        ...rest
    } = props;

    const StartDateInputCmp = DateInput(startDatePlaceholder);

    const startDateCustomCmp = startDateCustomInput || customInput || <StartDateInputCmp />;

    const commonOptions = {
        isClearable: false,
        showTimeSelect,
        showTimeSelectOnly,
        showWeekNumbers,
        timeFormat,
        timeIntervals,
        locale,
        disabled,
        timeCaption: 'time',
        popperPlacement: 'top-end',
        popperModifiers: {
            offset: {
                enabled: true,
                offset: '5px, 10px',
            },
            preventOverflow: {
                enabled: true,
                escapeWithReference: false,
                boundariesElement: 'viewport',
            },
        },
        ...rest,
    };

    const { setFieldValue } = useFormikContext();
    const [field] = useField(props as any);

    return (
        <div>
            {timeDescriptor && (
                <div className="time-description">
                    <span>{timeDescriptor.hour}</span>
                    <span>{timeDescriptor.minutes}</span>
                </div>
            )}
            <Div className={`${className} x-cls-time-range-picker stanleyRow`}>
                {icon && <Div className={`icon fa fa-${icon}`}></Div>}
                <DatePicker
                    customInput={startDateCustomCmp}
                    {...commonOptions}
                    {...field}
                    value={value}
                    selected={(field.value && new Date(field.value)) || value || new Date()}
                    onChange={(value) => {
                        setFieldValue(field.name, value);
                    }}
                    timeIntervals={5}
                    dateFormat={dateFormat}
                    name={name}
                />
            </Div>
        </div>
    );
});

const Div = styled.div``;

export default TimeRangePicker;

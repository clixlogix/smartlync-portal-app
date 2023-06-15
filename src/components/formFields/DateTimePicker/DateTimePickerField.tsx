import React, { SyntheticEvent } from 'react';
import DateTimePicker from 'react-datepicker';
import { Moment } from 'moment';
import './DateTimePicker.scss';

interface DateTimePickerFieldProps {
    field?: any;
    form?: any;
    value: Moment | null | undefined;
    startDate?: any;
    endDate?: any;
    icon?: string;
    placeholder?: string;
    className?: string;
    showWeekNumbers?: boolean;
    todayButton?: string;
    isClearable?: boolean;
    showTimeSelect?: boolean;
    timeFormat?: string;
    timeIntervals?: number;
    timeCaption?: string;
    dateFormat?: string;
    customInput?: React.ReactNode;

    onChange: (date: Moment, event?: SyntheticEvent<any, Event> | null | undefined) => void;
}

export const DateTimePickerField: React.FC<DateTimePickerFieldProps> = React.memo((props: DateTimePickerFieldProps) => {
    const DateInput = (
        placeholder: string = 'Date',
        icon: string = 'fa-calendar',
        className = 'date-picker-field-btn filter-btn',
    ) => ({ value = '', onClick = () => {} }) => (
        <button className={`filter-btn ${className}`} onClick={onClick}>
            <span className={`icon fa fa-calendar fa-fw ${icon}`}></span>
            {value && <span className={`value`}>{value}</span>}
            <span className={`placeholder ${value ? 'value' : ''}`}>{placeholder}</span>
        </button>
    );

    const { placeholder, icon, className, startDate, endDate, value, ...rest } = props;

    const DateInputCmp = DateInput(placeholder, icon, className);

    const { customInput = <DateInputCmp /> } = props;

    return (
        // TODO: Fix datepicker onChange type
        // @ts-ignore
        <DateTimePicker
            className={'react-datepicker__header'}
            todayButton={'Today'}
            isClearable
            showTimeSelect
            showWeekNumbers
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat={'MMM d,yyy h:mmaa'}
            selected={value}
            customInput={customInput}
            {...rest}
        />
    );
});

export default DateTimePickerField;

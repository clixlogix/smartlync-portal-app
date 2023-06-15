import { Filters } from 'models';
import moment, { Moment } from 'moment';
import React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import endOfWeek from 'date-fns/endOfWeek';
import isSameDay from 'date-fns/isSameDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import startOfWeek from 'date-fns/startOfWeek';
import { Avatar } from '@mui/material';

interface DateRange {
    fromTime: Moment;
    toTime: Moment;
}

interface DateFilterProps {
    filters: Filters;
    onChange(range: DateRange);
}

export const DateFilter = ({ onChange, filters: { toTime } }: DateFilterProps) => {
    const handleDateChange = (date: Moment | null) => {
        const fromTime = moment(date).startOf('day');
        const toTime = moment(date).endOf('day');
        onChange({ fromTime, toTime });
    };

    const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
        const value = moment(date).startOf('day').toDate();
        const isFirstDayOfWeek = date.isoWeekday() === 1 ? date.isoWeek() : false;
        if (!value) {
            return (
                <div style={{ position: 'relative' }}>
                    {isFirstDayOfWeek && <Avatar className="avatar__absolute">{isFirstDayOfWeek}</Avatar>}
                    <PickersDay {...pickersDayProps} />
                </div>
            );
        }

        const start = startOfWeek(value);
        const end = endOfWeek(value);

        const dayIsBetween = isWithinInterval(date, { start, end });
        const isFirstDay = isSameDay(date, start);
        const isLastDay = isSameDay(date, end);

        return (
            <div style={{ position: 'relative' }}>
                {isFirstDayOfWeek && <Avatar className="avatar__absolute">{isFirstDayOfWeek}</Avatar>}
                <PickersDay
                    {...pickersDayProps}
                    disableMargin
                    dayIsBetween={dayIsBetween}
                    isFirstDay={isFirstDay}
                    isLastDay={isLastDay}
                />
            </div>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
                label={'Date'}
                value={toTime}
                onChange={handleDateChange}
                renderInput={(params) => <TextField fullWidth {...params} />}
                maxDate={moment()}
                renderDay={renderWeekPickerDay}
            />
        </LocalizationProvider>
    );
};

/**
 *
 * MuiDateTime
 *
 */
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { SelectFilterProps } from 'components/filters';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import React, { memo, useState, useEffect } from 'react';
import { Filters } from 'models';
import { Box, Button } from '@mui/material';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import endOfWeek from 'date-fns/endOfWeek';
import isSameDay from 'date-fns/isSameDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import startOfWeek from 'date-fns/startOfWeek';
import { Avatar } from '@mui/material';

interface Props extends SelectFilterProps {
    className?: string;
    children?: React.ReactNode | React.ReactNode[];
    filters: Filters;
}

export const MuiDateTime = memo((props: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onChange, filters } = props;
    const [dateValue, setValue] = useState(moment(filters?.fromTime).valueOf());

    const onHandleOnChange = (value) => {
        if (onChange) {
            onChange(value);
        }
    };

    const handleChange = (value: any) => {
        if (value) {
            setValue(value);
        }
    };

    const onChangeRange = (value) => {
        if (value) {
            onHandleOnChange({
                fromTime: moment(value),
                toTime: moment(value).add(1, 'hour'),
            });
        }
    };
    useEffect(() => {
        if (!moment(filters?.fromTime)) return;
        setValue(moment(filters?.fromTime).valueOf());
    }, [filters.fromTime]);

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
        <Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateTimePicker
                    label="Date&Time picker"
                    value={dateValue}
                    onChange={handleChange}
                    renderDay={renderWeekPickerDay}
                    renderInput={(params) => <TextField sx={{ width: '100%' }} {...params} />}
                />
            </LocalizationProvider>
            <Button
                variant="contained"
                sx={{ marginTop: '10px', width: '100%' }}
                onClick={() => onChangeRange(dateValue)}
            >
                Change Date & Time
            </Button>
        </Box>
    );
});
export default MuiDateTime;

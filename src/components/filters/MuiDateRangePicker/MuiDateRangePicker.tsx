/**
 *
 * MuiDateRangePicker
 *
 */

import { Avatar, Box, Button, styled } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DateRange } from '@mui/x-date-pickers-pro';
import { AdapterMoment } from '@mui/x-date-pickers-pro/AdapterMoment';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SelectFilterProps } from 'components/filters';
import { Filters } from 'models';
import { DateRangePickerDay as MuiDateRangePickerDay } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import moment, { Moment } from 'moment';
import React, { memo, useEffect, useState } from 'react';
import './daterange.styles.scss';

interface Props extends SelectFilterProps {
    className?: string;
    isFixedRange?: boolean;
    fixedRangeValue?: moment.DurationInputArg1;
    fixedRangePeriod?: moment.DurationInputArg2;
    children?: React.ReactNode | React.ReactNode[];
    minDate?: Moment;
    maxDate?: Moment;
    validation?: boolean;
    nos?: number;
    period?: string;
    startText?: string;
    endText?: string;
    inputFormat?: string;
}

const DateRangePickerDay = styled(MuiDateRangePickerDay)(
    ({ theme, isHighlighting, isStartOfHighlighting, isEndOfHighlighting }) => ({
        ...(isStartOfHighlighting && {
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%',
            backgroundColor: theme.palette.primary.main,
        }),
        ...(isEndOfHighlighting && {
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
        }),
        ...(isHighlighting && {
            color: theme.palette.common.white,
            '&:hover, &:focus': {
                backgroundColor: theme.palette.primary.dark,
            },
        }),
    }),
);

export const MuiDateRangePicker = memo((props: Props) => {
    const {
        onChange,
        filters,
        data,
        validation = false,
        nos = 3,
        period = 'days',
        startText = 'From Time',
        endText = 'To Time',
        inputFormat = 'MM/DD/YYYY',
    } = props;
    const { isStartEndWeekAutoSelect } = data;
    const onHandleOnChange = (value: Filters) => {
        if (onChange) {
            onChange(value);
        }
    };
    const [dateValue, setDateValue] = useState<DateRange<Moment>>([moment(filters?.fromTime), moment(filters?.toTime)]);

    const dateIsValid = (date) => {
        return !Number.isNaN(moment(date).valueOf());
    };

    const handleDateChange = (value: any) => {
        if (!value) return;
        if (isStartEndWeekAutoSelect) {
            setDateValue([moment(value[0].startOf('isoWeek')), moment(value[1]).endOf('isoWeek')]);
        } else {
            setDateValue(value);
        }
    };
    const onChangeRange = (value: DateRange<Moment>) => {
        if (!dateIsValid(value)) {
            if (value[1] && value[0]) {
                if (isStartEndWeekAutoSelect) {
                    onHandleOnChange({
                        toTime: moment(value[1]).endOf('isoWeek'),
                        fromTime: moment(value[0]).startOf('isoWeek'),
                    });
                } else {
                    onHandleOnChange({
                        toTime: moment(value[1]).endOf('day'),
                        fromTime: moment(value[0]).startOf('day'),
                    });
                }
            }
        }
    };
    useEffect(() => {
        if (!moment(filters?.fromTime) && moment(filters?.toTime)) return;
        setDateValue([moment(filters?.fromTime), moment(filters?.toTime)]);
    }, [filters?.fromTime, filters?.toTime]);

    const renderWeekPickerDay = (date, dateRangePickerDayProps) => {
        const isFirstDayOfWeek = date.isoWeekday() === 1 ? date.isoWeek() : false;
        return (
            <div style={{ position: 'relative' }}>
                {isFirstDayOfWeek && <Avatar className="avatar__absolute">{isFirstDayOfWeek}</Avatar>}
                <DateRangePickerDay {...dateRangePickerDayProps} />
            </div>
        );
    };

    return (
        <Box className="date-range-picker-mui">
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateRangePicker
                    startText={startText}
                    endText={endText}
                    value={dateValue}
                    onChange={handleDateChange}
                    renderDay={renderWeekPickerDay}
                    inputFormat={inputFormat}
                    renderInput={(startProps, endProps) => (
                        <>
                            <TextField
                                {...startProps}
                                sx={{ marginRight: '5px' }}
                                error={validation && !(dateValue[1]?.diff(dateValue[0], period) < nos)}
                                helperText={
                                    validation && !(dateValue[1]?.diff(dateValue[0], period) < nos)
                                        ? `More than ${nos} ${period} not allowed`
                                        : undefined
                                }
                            />
                            <TextField
                                {...endProps}
                                sx={{ marginLeft: '5px' }}
                                error={validation && !(dateValue[1]?.diff(dateValue[0], period) < nos)}
                            />
                        </>
                    )}
                />
            </LocalizationProvider>
            <Button
                variant="contained"
                disabled={validation && !(dateValue[1]?.diff(dateValue[0], period) < nos)}
                sx={{ marginTop: '10px', width: '100%' }}
                onClick={() => onChangeRange(dateValue)}
            >
                Change Date
            </Button>
        </Box>
    );
});

export default MuiDateRangePicker;

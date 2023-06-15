import { Avatar, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import RestoreIcon from '@mui/icons-material/Restore';
import moment from 'moment';
import * as React from 'react';
import MyToolbar from './MyToolbar';
import './WeekPicker.scss';

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
    ...(dayIsBetween && {
        borderRadius: 0,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.primary.dark,
        },
    }),
    ...(isFirstDay && {
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
    }),
    ...(isLastDay && {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
    }),
}));

const FixedRangePicker = (props) => {
    const { filters } = props;
    const defaultDate = props?.defaultDate || props?.filters?.toTime;
    const [selectedDate, setSelectedDates] = React.useState(defaultDate);

    const getDateRange = (date) => {
        let defaultVal = defaultDate;

        defaultVal = date || selectedDate || defaultVal;
        let start = moment(defaultVal).subtract(1, 'year').startOf('isoWeek');
        let end = moment(defaultVal).endOf('isoWeek');

        return { start, end };
    };

    React.useEffect(() => {
        if (!props?.filters?.toTime) return;
        if (!moment(filters?.toTime)) return;
        setSelectedDates(moment(filters?.toTime));
    }, [filters?.toTime]);

    const handleChange = (value) => {
        setSelectedDates(moment(value));
        const { start, end } = getDateRange(moment(value));
        props.weekValueSelected({ fromTime: start, toTime: end });
    };

    const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
        const isFirstDayOfWeek = date.isoWeekday() === 1 ? date.isoWeek() : false;
        if (!selectedDate) {
            return <PickersDay showDaysOutsideCurrentMonth={true} {...pickersDayProps} />;
        }
        let { start, end } = getDateRange(selectedDates[0]);
        date = moment(date);
        const dayIsBetween = date.isBetween(start, end, null, []);
        const isFirstDay = date.isSame(start, 'day');
        const isLastDay = date.isSame(end, 'day');

        return (
            <div style={{ position: 'relative' }}>
                {isFirstDayOfWeek && <Avatar className="avatar__absolute">{isFirstDayOfWeek}</Avatar>}
                <CustomPickersDay
                    {...pickersDayProps}
                    disableMargin
                    dayIsBetween={dayIsBetween}
                    isFirstDay={isFirstDay}
                    isLastDay={isLastDay}
                />
            </div>
        );
    };

    const formatWeekSelectLabel = (invalidLabel) => {
        let date = selectedDate;
        let { start, end } = getDateRange(selectedDate);
        date = moment(date);

        const dateClone = date;
        const weeknumberStart = start.isoWeek();
        const weeknumberEnd = end.isoWeek();
        const yearStart = start.year();
        const yearEnd = end.year();
        const dn =
            dateClone && dateClone.isValid()
                ? `[Week]${weeknumberStart} of ${yearStart} - [Week]${weeknumberEnd} of ${yearEnd}`
                : invalidLabel;
        return dn;
    };

    const RenderToolbar = (data) => {
        const { start, end } = getDateRange(selectedDate);
        return <MyToolbar dataToComponent={data} start={start} date={selectedDate} end={end} {...props} />;
    };

    const InputText = (params) => {
        return (
            <TextField
                sx={{ width: `${props.isNineWeekView ? '100%' : 'auto'}`, maxWidth: '315px' }}
                InputProps={{ readOnly: true }}
                {...params}
            />
        );
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                    displayStaticWrapperAs="desktop"
                    value={selectedDate}
                    onChange={handleChange}
                    renderDay={renderWeekPickerDay}
                    renderInput={(params) => InputText(params)}
                    ToolbarComponent={(props) => <RenderToolbar {...props} />}
                    showToolbar={true}
                    inputFormat={`${formatWeekSelectLabel()}`}
                />
            </LocalizationProvider>
            {!props.data && defaultDate?.format('LL') !== selectedDate?.format('LL') && (
                <Chip
                    onClick={() => handleChange(defaultDate)}
                    icon={<RestoreIcon />}
                    label="Reset Time"
                    sx={{
                        cursor: 'pointer',
                        marginLeft: '10px',
                    }}
                />
            )}
        </Box>
    );
};
export default React.memo(FixedRangePicker);

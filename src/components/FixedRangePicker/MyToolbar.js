import React from 'react';
import { createStyles } from '@mui/styles';
import { Toolbar, Button, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import moment from 'moment';

export const styles = (theme) =>
    createStyles({
        toolbar: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
        },
    });

const MyToolbar = function (props) {
    let { date, isNineWeekView, setOpenView, start, end } = props;
    date = moment(date);

    if (isNineWeekView) {
        const weeknumberStart = start.isoWeek();
        const weeknumberEnd = end.isoWeek();
        const yearStart = start.year();
        const yearEnd = end.year();
        const monthStart = start.format('MMM');
        const monthEnd = end.format('MMM');

        const fromDate = start.startOf('isoWeek').date();
        const toDate = end.endOf('isoWeek').date();

        return (
            <Toolbar className="MuiToolbar-root MuiToolbar-regular MuiPickersToolbar-toolbar MuiPickersDatePickerRoot-toolbar MuiToolbar-gutters">
                <Button onClick={(e) => setOpenView('year')} sx={{ padding: 0 }}>
                    <span className="MuiPickersToolbar-label">
                        <Typography>
                            {yearStart} W{weeknumberStart} - {yearEnd} W{weeknumberEnd},
                        </Typography>
                    </span>
                    <span className="MuiTouchRipple-root" />
                </Button>
                <Button onClick={(e) => setOpenView('date')} sx={{ padding: 0 }}>
                    <span className="MuiPickersToolbar-label">
                        <Typography>
                            {monthStart} {fromDate} to {monthEnd} {toDate}
                        </Typography>
                    </span>
                    <span className="MuiTouchRipple-root" />
                </Button>
            </Toolbar>
        );
    } else {
        const today = date;
        const weeknumber = today.isoWeek();
        const year = today.year();
        const month = today.startOf('isoWeek').format('MMM');
        const fromDate = today.startOf('isoWeek').date();
        const toDate = today.endOf('isoWeek').date();
        const toMonth = today.endOf('isoWeek').format('MMM');

        return (
            <Toolbar className="MuiToolbar-root MuiToolbar-regular MuiPickersToolbar-toolbar MuiPickersDatePickerRoot-toolbar MuiToolbar-gutters">
                <Button onClick={(e) => setOpenView('year')} sx={{ padding: 0, margin: '10px 0' }}>
                    <span className="MuiPickersToolbar-label">
                        <Typography fontSize={11}>
                            {year} Week {weeknumber}
                        </Typography>
                    </span>
                    <span className="MuiTouchRipple-root" />
                </Button>
                <Button onClick={(e) => setOpenView('date')} sx={{ padding: 0 }}>
                    <span className="MuiPickersToolbar-label">
                        <Typography>
                            {month} {fromDate} to {toMonth} {toDate}
                        </Typography>
                    </span>
                    <span className="MuiTouchRipple-root" />
                </Button>
            </Toolbar>
        );
    }
};

export default withStyles(styles, { name: 'MuiPickersToolbar' })(MyToolbar);

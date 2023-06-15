import React, { memo } from 'react';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './CollapsibleTable.scss';

interface CollapsibleTableProps {
    components: any;
}

const useStyles = makeStyles({
    root: {
        color: '#fff',
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        borderBottom: '1px solid #3D3D3D',
        minWidth: 250,
        backgroundColor: '#212121',
        '& th': {
            fontWeight: 700,
            color: '#fff',
            borderBottom: '1px solid #3D3D3D',
        },
        '& td': {
            color: '#fff',
            borderBottom: '1px solid #3D3D3D',
            '& svg': {
                color: '#fff',
            },
        },

        MuiTableCell: {
            root: {
                color: '#fff !important',
                borderBottom: '1px solid #3D3D3D',
            },
        },
    },
});

const CollapsibleTable = memo((props: CollapsibleTableProps) => {
    const { components } = props;
    const classes = useStyles();
    const createData = (rowData) => {
        const { componentName, componentHealth, outlet, lastChange, serial, hoursToCallibration, history } = rowData;
        const { events, currentCycles } = history;
        return {
            componentName,
            componentHealth,
            outlet,
            lastChange,
            serial,
            hoursToCallibration,
            currentCycles,
            events,
        };
    };

    const Row = ({ row }) => {
        const { componentName, componentHealth, lastChange, hoursToCallibration, serial, currentCycles, events } = row;
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? (
                                <KeyboardArrowUpIcon fontSize="large" />
                            ) : (
                                <KeyboardArrowDownIcon fontSize="large" />
                            )}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {componentName}
                    </TableCell>
                    <TableCell>{componentHealth}</TableCell>
                    <TableCell>Last change: {moment(lastChange?.time).fromNow()}</TableCell>
                    <TableCell>{serial}</TableCell>
                    <TableCell>{currentCycles}</TableCell>
                    <TableCell align="right">{hoursToCallibration}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    History
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Summary</TableCell>
                                            <TableCell>Type</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {events.map(({ summary, eventType }) => (
                                            <TableRow key={summary}>
                                                <TableCell component="th" scope="row">
                                                    {summary}
                                                </TableCell>
                                                <TableCell>{eventType}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    };

    const rows = components.map((rowData) => createData(rowData));
    return (
        <Paper className={classes.root}>
            <Table className={classes.table} aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <Typography sx={{ color: 'white', textAlign: 'left', paddingTop: '16px', paddingLeft: '16px' }}>
                            Components
                        </Typography>
                    </TableRow>
                </TableHead>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Component</TableCell>
                        <TableCell>Health</TableCell>
                        <TableCell>Last Change</TableCell>
                        <TableCell>Serial#</TableCell>
                        <TableCell>Cycles</TableCell>
                        <TableCell align="right">Hours to Callibration</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.componentName} row={row} />
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
});

export default CollapsibleTable;

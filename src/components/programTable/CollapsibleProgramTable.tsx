/**
 *
 * CollapsibleProgramTable
 *
 */
import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useTranslation, TFunction } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Link from '@mui/material/Link';
import TablePagination from '@mui/material/TablePagination';
// import TableSortLabel from '@mui/material/TableSortLabel';
// import { visuallyHidden } from '@mui/utils';
// import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { Programs as ProgramsTypes, Program as ProgramType, ProgramSortingType } from 'models';

import { messages } from './messages';

import 'scss/main.scss';
import './CollapsibleProgramTable.scss';

type OpenDetailPanel = (panelState: boolean, rowId: number) => void;
interface CollapsibleProgramTableProps {
    className?: string;
    data: ProgramsTypes;
    activeRowId: number;
    openDetailPanel: OpenDetailPanel;
    handleRequestSort: (event: React.MouseEvent<unknown>, property: keyof ProgramType) => void;
    order: ProgramSortingType;
    orderBy: keyof ProgramType;
    rowCount: number;
    page: number;
    rowsPerPage: number;
    handleChangePage: (event: unknown, newPage: number) => void;
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface RowProps {
    row: ProgramType;
    openDetailPanel: OpenDetailPanel;
    activeRowId: number;
    handleRowOpenState: (id: number) => void;
    open: boolean;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

// takes order: asc|desc and column name
function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function Row(props: RowProps) {
    const { row, openDetailPanel, activeRowId, open, handleRowOpenState } = props;
    const { devices } = row;
    const firstDevice = devices[0];
    const deviceLength = devices.length;
    const restDevices = devices.slice(1, deviceLength);
    const handleRowClick = () => {
        handleRowOpenState(row.id);
        openDetailPanel(!open, row.id);
    };
    const isRowExpanded = open && activeRowId === row.id;
    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={handleRowClick}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.programName}</TableCell>
                <TableCell>
                    <Link>{firstDevice.name}</Link>
                    {!isRowExpanded && (
                        <Chip className="td-chip device-name-chip" label={`+${deviceLength - 1}`} size="small" />
                    )}
                </TableCell>
                <TableCell>{row.schedule}</TableCell>
                <TableCell>{row.outlet}</TableCell>
                <TableCell>{row.feeder}</TableCell>
                <TableCell>{row.tool}</TableCell>
                <TableCell>{row.station}</TableCell>
                <TableCell>
                    <Chip className="td-chip" label={row.lastModifiedBy} size="small" />
                </TableCell>
                <TableCell>{row.lastUpdated}</TableCell>
            </TableRow>
            {isRowExpanded &&
                restDevices.map((restDevice, deviceIndex) => {
                    return (
                        <TableRow key={restDevice.id}>
                            <TableCell />
                            <TableCell />
                            <TableCell>
                                <Link>{restDevice.name}</Link>
                            </TableCell>
                        </TableRow>
                    );
                })}
        </>
    );
}

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

const headCells = (t: TFunction): readonly HeadCell[] => [
    {
        id: 'programName',
        numeric: false,
        disablePadding: true,
        label: t(messages.program),
    },
    {
        id: 'devices',
        numeric: false,
        disablePadding: false,
        label: t(messages.devices),
    },
    {
        id: 'schedule',
        numeric: false,
        disablePadding: false,
        label: t(messages.schedule),
    },
    {
        id: 'outlet',
        numeric: true,
        disablePadding: false,
        label: t(messages.outlet),
    },
    {
        id: 'feeder',
        numeric: true,
        disablePadding: false,
        label: t(messages.feeder),
    },
    {
        id: 'tool',
        numeric: true,
        disablePadding: false,
        label: t(messages.tool),
    },
    {
        id: 'station',
        numeric: true,
        disablePadding: false,
        label: t(messages.station),
    },
    {
        id: 'lastModifiedBy',
        numeric: true,
        disablePadding: false,
        label: t(messages.lastModifiedBy),
    },
    {
        id: 'lastUpdated',
        numeric: false,
        disablePadding: false,
        label: t(messages.lastUpdated),
    },
];
interface EnhancedTableHeadProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ProgramType) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

// render table head
function EnhancedTableHead(props: EnhancedTableHeadProps) {
    const { t } = useTranslation();
    const { order, orderBy /*onRequestSort*/ } = props;
    // const createSortHandler = (property: keyof ProgramType) => (event: React.MouseEvent<unknown>) => {
    //     onRequestSort(event, property);
    // };
    return (
        <TableHead className="table-head">
            <TableRow>
                <TableCell />
                {headCells(t).map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        //align={headCell.numeric ? 'center' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                        {/* <TableSortLabel
                            className="table-sort-label"
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            //onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel> */}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export const CollapsibleProgramTable = memo((props: CollapsibleProgramTableProps) => {
    const {
        className = '',
        data,
        order,
        orderBy,
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        handleRequestSort,
        ...restProps
    } = props;
    const [rowOpenState, setRowOpenState] = useState({});
    useEffect(() => {
        setRowOpenState(getdefaultRowState(data));
    }, [data]);

    const handleRowOpenState = (id) => {
        const currentState = rowOpenState[id];
        const defaultState = getdefaultRowState(data);
        defaultState[id] = !currentState;
        setRowOpenState(defaultState);
    };

    const getdefaultRowState = (programData: ProgramsTypes) =>
        programData.reduce((acc, currentValue) => ({ ...acc, [currentValue.id]: false }), {});
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    return (
        <Div className={`${className} x-cls-collapsible-table`}>
            <TableContainer className="paper" component={Paper}>
                <Table aria-label="collapsible table" size={'small'}>
                    <EnhancedTableHead
                        order={order} //asc/dec
                        orderBy={orderBy} // column name
                        onRequestSort={handleRequestSort}
                        rowCount={data.length}
                    />
                    <TableBody>
                        {stableSort(data, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((programRow) => (
                                <Row
                                    key={programRow.id}
                                    row={programRow}
                                    handleRowOpenState={handleRowOpenState}
                                    open={rowOpenState[programRow.id]}
                                    {...restProps}
                                />
                            ))}
                    </TableBody>
                    {emptyRows > 0 && (
                        <TableRow
                            style={{
                                height: 49 * emptyRows, //(dense ? 33 : 53) * emptyRows,
                            }}
                        >
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </Table>
            </TableContainer>
            <TablePagination
                className="table-pagination"
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Div>
    );
});

const Div = styled.div``;

export default CollapsibleProgramTable;

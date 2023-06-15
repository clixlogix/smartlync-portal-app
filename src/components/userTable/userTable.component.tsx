import React from 'react';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import { TableBody, TableHead, TablePagination } from '@mui/material';
import { createData } from './data';
import Row from './row.component';
import UserCreateModal from './modal.component';

const UserTable = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const rows = [
        createData('Frozen yoghurt', 'frozen-desk@gmail.com', true),
        createData('Ice cream sandwich', 'ice-cream@gmail.com', true),
        createData('Eclair', 'eclairs@gmail.com', false),
        createData('Cupcake', 'cup-cake@hotmail.com', true),
        createData('Frozen yoghurt', 'frozen-desk@gmail.com', true),
        createData('Ice cream sandwich', 'ice-cream@gmail.com', true),
        createData('Eclair', 'eclairs@gmail.com', false),
        createData('Cupcake', 'cup-cake@hotmail.com', true),
        createData('Frozen yoghurt', 'frozen-desk@gmail.com', true),
    ];
    return (
        <Box sx={{ width: 'calc(100% - 20px)' }}>
            <Box
                sx={{
                    width: '100%',
                    marginTop: '30px',
                }}
            >
                <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 200px)' }}>
                    <Table stickyHeader size="small" aria-label="collapsible a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <b>Name</b>
                                </TableCell>
                                <TableCell align="right">
                                    <b>Email</b>
                                </TableCell>
                                <TableCell align="right">
                                    <b>Active</b>
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <Row key={row.name} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
            <Box>
                <UserCreateModal />
            </Box>
        </Box>
    );
};

export default UserTable;

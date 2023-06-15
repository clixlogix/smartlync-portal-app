import Radio from '@mui/material/Radio';
import {
    AccordionDetails,
    Box,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Paper,
    RadioGroup,
    Select,
    styled,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@mui/material';
import React from 'react';
import { tableCellClasses } from '@mui/material/TableCell';

const TypoHeading = styled(Typography)({
    fontSize: '15px',
    fontWeight: 'bold',
});
const Typo = styled(Typography)({
    fontSize: '15px',
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const AccordianBodyUser = ({ data: any }) => {
    const [tenant, setTenant] = React.useState('Member');
    const [technology, setTechnology] = React.useState('SPR, SWS');

    const handleTenantChange = (event) => {
        setTenant(event.target.value);
    };
    const handleTechnologyChange = (event) => {
        setTechnology(event.target.value);
    };
    return (
        <AccordionDetails>
            <Box sx={{ padding: '20px 10px' }}>
                <Grid container>
                    <Grid item xs={8}>
                        <TypoHeading sx={{ fontWeight: 'bold' }}>Active </TypoHeading>
                    </Grid>
                    <Grid item xs={4}>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            sx={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                            <FormControlLabel value="female" control={<Radio />} label="Yes" />
                            <FormControlLabel value="male" control={<Radio />} label="No" />
                        </RadioGroup>
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container>
                    <Grid item xs={12}>
                        <TypoHeading sx={{ fontWeight: 'bold' }}>Roles</TypoHeading>
                    </Grid>
                    <Grid container sx={{ padding: '50px 30px 10px 30px' }}>
                        <Grid item xs={5}>
                            <Typo>Tenant </Typo>
                        </Grid>
                        <Grid item xs={7}>
                            <FormControl fullWidth>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-select-small"
                                    value={tenant}
                                    onChange={handleTenantChange}
                                    sx={{ fontSize: '14px' }}
                                >
                                    <MenuItem value={'Member'}>Member</MenuItem>
                                    <MenuItem value={'Admin'}>Admin</MenuItem>
                                    <MenuItem value={'Owner'}>Owner</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={{ padding: '10px 30px' }}>
                        <Grid item xs={5}>
                            <Typo>Technology </Typo>
                        </Grid>
                        <Grid item xs={7}>
                            <FormControl fullWidth>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-select-small"
                                    value={technology}
                                    onChange={handleTechnologyChange}
                                    sx={{ fontSize: '14px' }}
                                >
                                    <MenuItem value={'SPR'}>SPR</MenuItem>
                                    <MenuItem value={'SWS'}>SWS</MenuItem>
                                    <MenuItem value={'SPR, SWS'}>SPR, SWS</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={{ padding: '10px 30px' }}>
                        <Grid item xs={5}>
                            <Typo>Plant </Typo>
                        </Grid>
                        <Grid item xs={7}>
                            <TableContainer component={Paper}>
                                <Table sx={{ width: '100%' }} aria-label="simple table">
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ width: '50%' }}>Plant 1</StyledTableCell>
                                        <StyledTableCell sx={{ width: '50%' }}>Plant Manager</StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ width: '50%' }}>Plant 2</StyledTableCell>
                                        <StyledTableCell sx={{ width: '50%' }}>None</StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ width: '50%' }}>Plant 3</StyledTableCell>
                                        <StyledTableCell sx={{ width: '50%' }}>None</StyledTableCell>
                                    </StyledTableRow>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </AccordionDetails>
    );
};

export default AccordianBodyUser;

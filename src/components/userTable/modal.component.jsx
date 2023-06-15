import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Add } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import { MenuItem, Select } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function UserCreateModal() {
    const [open, setOpen] = React.useState(false);
    const [tenant, setTenant] = React.useState('Member');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleTenantChange = (event) => {
        setTenant(event.target.value);
    };

    return (
        <div>
            <Button onClick={handleOpen} variant="outlined" endIcon={<Add />}>
                CREATE
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="p" component="h5" sx={{ marginBottom: '20px' }}>
                        CREATE USER
                    </Typography>
                    <Box component="form">
                        <TextField label="Username" fullWidth size="small" sx={{ marginBottom: '20px' }} />

                        <TextField label="Email" fullWidth size="small" sx={{ marginBottom: '20px' }} />
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-select-small"
                            value={tenant}
                            onChange={handleTenantChange}
                            fullWidth
                            sx={{ fontSize: '14px', marginBottom: '20px' }}
                        >
                            <MenuItem value={'Member'}>Member</MenuItem>
                            <MenuItem value={'Admin'}>Admin</MenuItem>
                            <MenuItem value={'Owner'}>Owner</MenuItem>
                        </Select>

                        <Button onClick={handleOpen} variant="outlined">
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

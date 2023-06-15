import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box sx={{ p: 0 }}>
                <Typography>{children}</Typography>
            </Box>
        </Typography>
    );
};

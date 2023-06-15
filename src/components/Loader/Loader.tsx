import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { Box, Typography } from '@mui/material';

interface LoaderProps {
    circle?: boolean;
    noData?: boolean;
}

const Loader = (props: LoaderProps): JSX.Element => {
    const { circle = true, noData = false } = props;
    const { t } = useTranslation();
    if (noData) {
        return (
            <Box className={'loader'}>
                <Typography
                    sx={{
                        opacity: '0.5',
                    }}
                >
                    {t(messages.noData)}
                </Typography>
            </Box>
        );
    }
    return (
        <Box
            sx={{
                display: 'flex',
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {circle ? <CircularProgress /> : 'Loading ....'}
        </Box>
    );
};

export default Loader;

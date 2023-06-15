/**
 *
 * PlantAppNavBar
 *
 */
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { NavCard } from './NavCard';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';
import routes from './routes';

import 'scss/main.scss';
import { Box, Stack, Typography } from '@mui/material';

interface PlantAppNavBarProps extends WidgetProps {}

export const PlantAppNavBarSprWidget: Widget<PlantAppNavBarProps> = memo((props: PlantAppNavBarProps) => {
    const { t } = useTranslation();

    return (
        <Box sx={{ display: 'flex' }}>
            <Card sx={{ width: '100%' }}>
                <Box
                    sx={{
                        margin: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography>{t(messages.navBarTitle)}</Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        justifyContent="flex-end"
                    >
                        {routes.map((item) => (
                            <>{!item.disabled && <NavCard data={item} />}</>
                        ))}
                    </Stack>
                </Box>
            </Card>
        </Box>
    );
});

// extra widget properties
const defaultFilters = [
    /*
     { name: 'deviceName', type: FilterType.Select, label: 'Device' },
     { name: 'deviceType', type: FilterType.Select, label: 'Type' },
 */
];
export const PlantAppNavBarSprProperty = Object.assign(
    {},
    {
        defaultFilters: defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 0,
            w: 3,
            h: 1,
            minW: 1,
            minH: 1,
        },
    },
);

export default PlantAppNavBarSprWidget;

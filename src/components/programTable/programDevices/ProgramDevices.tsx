import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import { ProgramDevice as ProgramDeviceType } from 'models';
import { messages } from './messages';

import './ProgramDevices.scss';

interface Props {
    data: ProgramDeviceType[];
    programName: string;
}
const primary = '#FFDB0A';

export const ProgramDevices = memo((props: Props) => {
    const { data } = props;
    const { t } = useTranslation();
    return (
        <Box className="x-cls-program-devices">
            <Paper className="device-list-container">
                <Grid item xs={12} md={6}>
                    <Typography className="header header-title " variant="subtitle1" component="div">
                        {t(messages.title)}
                    </Typography>
                    <Typography className="header" variant="subtitle2" component="div">
                        {t(messages.subTitle)}
                    </Typography>
                    <Typography className="header device-name-title" variant="subtitle2" component="div">
                        {t(messages.tableHeader)}
                    </Typography>
                    {data && data.length > 0 && (
                        <List dense={true}>
                            {data.map(({ name, id }) => (
                                <ListItem key={id}>
                                    <ListItemIcon>
                                        <Checkbox defaultChecked style={{ color: primary }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primaryTypographyProps={{ style: { color: '#fff' } }}
                                        className="device-name"
                                        primary={name}
                                        secondary={null}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Grid>
            </Paper>
        </Box>
    );
});

export default ProgramDevices;

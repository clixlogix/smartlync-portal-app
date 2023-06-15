/**
 *
 * ProgramDetailTableNew
 *
 */
import React, { memo } from 'react';
import Paper from '@mui/material/Paper';
import { useTranslation, TFunction } from 'react-i18next';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import size from 'lodash/size';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

import { ProgramDetail } from 'models';
import { messages } from './messages';

import 'scss/main.scss';
import './ProgramDetailTableNew.scss';
import Pic012 from 'assets/images/Pic012.png';

interface Props {
    data: ProgramDetail | {};
    programName: string;
}

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

const headCells = (t: TFunction): readonly HeadCell[] => [
    {
        id: 'feeder',
        numeric: false,
        disablePadding: true,
        label: t(messages.feeder),
    },
    {
        id: 'tool',
        numeric: false,
        disablePadding: false,
        label: t(messages.tool),
    },
    {
        id: 'createdAt',
        numeric: false,
        disablePadding: false,
        label: t(messages.dateCreated),
    },
    {
        id: 'createdBy',
        numeric: true,
        disablePadding: false,
        label: t(messages.createdBy),
    },
    {
        id: 'optimization',
        numeric: true,
        disablePadding: false,
        label: t(messages.optimization),
    },
    {
        id: 'weldMode',
        numeric: true,
        disablePadding: false,
        label: t(messages.weldMode),
    },
    {
        id: 'faults',
        numeric: true,
        disablePadding: false,
        label: t(messages.faults),
    },
];

export const ProgramDetailTableNew = memo((props: Props) => {
    const { data } = props;
    const { t } = useTranslation();
    return (
        <Box className="x-cls-program-detail-table-new">
            <Paper className="detail-list-container">
                <Grid item xs={12} md={6}>
                    <List className="program-detail-list" dense={true}>
                        <ListItem className="list-item list-item-header">
                            <Typography sx={{ mt: 4, mb: 2 }} variant="subtitle1" component="div">
                                {t(messages.title)}
                            </Typography>
                        </ListItem>
                        {size(data) > 0 &&
                            headCells(t).map((headCell) => (
                                <ListItem className="list-item" key={headCell.id}>
                                    <ListItemText primary={headCell.label} />
                                    {headCell.id === 'createdBy' ? (
                                        <Chip
                                            avatar={<Avatar src={Pic012} />}
                                            className="td-chip"
                                            label={data[headCell.id]}
                                            size="small"
                                        />
                                    ) : (
                                        <ListItemText
                                            className="list-item-text-val"
                                            primary={data[headCell.id]}
                                            secondary={null}
                                        />
                                    )}
                                </ListItem>
                            ))}
                    </List>
                </Grid>
            </Paper>
        </Box>
    );
});

export default ProgramDetailTableNew;

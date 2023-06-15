/**
 *
 * DeviceInfoCard
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PushPinIcon from '@mui/icons-material/PushPin';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { FilterNames } from 'models';
import moment, { Moment } from 'moment';
import { messages } from './messages';
import { Typography, Stack, Grid } from '@mui/material';

interface DeviceInfoCardProps {
    data: any;
    expanded?: boolean;

    onClick?(card);
    onExpand?(deviceName);
    onHandlePinClick?(deviceName);
}

export interface HealthValue {
    value: number;
    lastChange: Moment;
}

const DeviceCard = styled(Card)((theme) => ({
    maxWidth: '380px',
    minWidth: '350px',
    padding: '16px',
    margin: '8px',
}));

const DeviceCardContent = styled(CardContent)(() => ({
    padding: '0px',
    '&:last-child': {
        paddingBottom: '0px',
    },
}));

const InfoCard = (props) => {
    const { label, value, unit } = props;

    return (
        <Grid container columns={3}>
            <Grid item xs={1}>
                <Typography variant="body2">{label}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Stack direction={'row'}>
                    <Typography variant="body2">{`${value || 'N.A'} ${unit || ''}`}</Typography>
                    <TrendingUpIcon fontSize="small" sx={{ color: 'lightgreen', ml: 1 }} />
                </Stack>
            </Grid>
        </Grid>
    );
};

export const DeviceInfoCard = memo((props: DeviceInfoCardProps) => {
    const { t, i18n } = useTranslation();
    const { data = {} as any, onClick /*, onExpand*/, onHandlePinClick } = props;
    const formatNumber = new Intl.NumberFormat(i18n.language, {
        maximumFractionDigits: 2,
    }).format;

    const { ta = 0.0, deviceName = '', faults = 0, cycles = 0, mttr = 0.0, mtbf = 0.0, pinned, deviceHealth } = data;

    const onHandleClick = () => {
        if (onClick) {
            onClick(data);
        }
    };
    // TODO: Enable this method when expand feature is enabled
    // const onHandleExpandChange = (deviceName: FilterNames) => {
    //     if (onExpand) {
    //         onExpand(deviceName);
    //     }
    // };

    const onHandlePinClicked = (deviceName: FilterNames) => {
        if (onHandlePinClick) {
            onHandlePinClick(deviceName);
        }
    };

    return (
        <DeviceCard onClick={onHandleClick}>
            <DeviceCardContent>
                {/* Header */}
                <Grid container spacing={1}>
                    <Grid item xs={11}>
                        <Typography variant="body2">{deviceName}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <PushPinIcon
                            fontSize="small"
                            sx={{
                                color: !pinned ? 'action.active' : 'primary.main',
                                transform: !pinned ? 'rotate(0)' : 'rotate(40deg)',
                                '&:hover': { color: 'primary.light' },
                            }}
                            onClick={() => onHandlePinClicked(deviceName)}
                        />
                    </Grid>
                    {/* {tenant !== 'jlr' && (    // TODO: Once we have UI wireframe of Expanded view enable icon
                        <Grid item xs={1}>
                            <OpenInNewIcon
                                fontSize="small"
                                sx={{ color: 'action.active', '&:hover': { color: 'primary.light' } }}
                                onClick={() => onHandleExpandChange(deviceName)}
                            />
                        </Grid>
                    )} */}
                </Grid>
                {/* Body */}
                <Grid container columns={2} sx={{ pt: 2 }} spacing={1}>
                    <Grid item xs={1}>
                        <InfoCard label="Health" value={deviceHealth} unit={''} pinned={pinned} />
                    </Grid>
                    <Grid item xs={1}>
                        <InfoCard label={t(messages.cyclesText)} value={formatNumber(cycles)} pinned={pinned} />
                    </Grid>
                    <Grid item xs={1}>
                        <InfoCard label={t(messages.faultsText)} value={formatNumber(faults)} pinned={pinned} />
                    </Grid>
                    <Grid item xs={1}>
                        <InfoCard
                            label={t(messages.MTTRText)}
                            value={formatNumber(mttr)}
                            unit={'MIN'}
                            pinned={pinned}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <InfoCard label="TA" value={formatNumber(ta)} unit={'%'} pinned={pinned} />
                    </Grid>
                    <Grid item xs={1}>
                        <InfoCard label={t(messages.MTBFText)} value={formatNumber(mtbf)} unit={'HR'} pinned={pinned} />
                    </Grid>
                </Grid>
            </DeviceCardContent>
        </DeviceCard>
    );
});

export default DeviceInfoCard;

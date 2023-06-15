/**
 *
 * CycleAveragesCard
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
// import CustomChip from 'components/CustomChip';
import * as _ from 'lodash';
import { Box, Chip } from '@mui/material';
import { Typography } from '@mui/material';
import 'scss/main.scss';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface Props {
    data?: any;
    carType?: any;
    className?: string;
    children?: React.ReactNode | React.ReactNode[];
}

export const CycleAveragesCardSPR = memo((props: Props) => {
    const { t } = useTranslation();
    const { data = {}, carType = '0' } = props;

    const {
        toolTip = 'NA',
        name = 'NA',
        value = 0,
        unit = '',
        trend = 'NA',
        trendValue = 0,
        trendValueUnit = 'NA',
        bodyShops = [],
    } = data;

    let bodyShopArray = bodyShops;
    if (carType === '1') {
        bodyShopArray = _.filter(bodyShops, { name: 'E' });
    }
    if (carType === '2') {
        bodyShopArray = _.filter(bodyShops, { name: 'S' });
    }

    return (
        <Box sx={{ padding: '5px', alignItems: 'center', flex: '1 1' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Tooltip title={`${t(toolTip)}`} placement={'top'}>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}
                    >{`${name}`}</Typography>
                </Tooltip>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}
                >{`${value} ${unit}`}</Typography>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', padding: '10px' }}>
                    {trend ? (
                        <ArrowUpwardIcon sx={{ color: '#149b74' }} />
                    ) : (
                        <ArrowDownwardIcon sx={{ color: '#ffd20b' }} />
                    )}
                    <Typography className={'arrowLabel'}>{trendValue}</Typography>
                </Box>
                {trendValueUnit !== '' ? (
                    <Typography
                        variant="body2"
                        gutterBottom
                        sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}
                    >
                        {`${trendValueUnit}`}
                    </Typography>
                ) : (
                    <Typography style={{ height: 18 }} />
                )}
                {bodyShopArray.map((bs, index) => (
                    <Box
                        key={`key-body-shop-averages-card-${index}`}
                        sx={{ display: 'flex', flex: 1, justifyContent: 'center', margin: '4px 0 3px' }}
                    >
                        <Chip
                            label={`${t('Filters.FilterByBodyShopLabel')} ${bs.name} \u00A0 ${bs.value} ${bs.unit}`}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
});

export default CycleAveragesCardSPR;

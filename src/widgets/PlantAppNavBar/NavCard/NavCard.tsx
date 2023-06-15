/**
 *
 * NavCard
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RouteItem } from 'models';
import { useQueryParam } from 'utils';
import { Box, Typography } from '@mui/material';

interface Props {
    className?: string;
    data: RouteItem;
}

export function NavCard(props: Props) {
    const { data } = props;
    const history = useHistory();
    const { t } = useTranslation();
    const [plantId] = useQueryParam<string>('plantId', '1', true);

    const icon = typeof data.icon === 'string' ? <Img src={data.icon} alt={''} /> : data.icon;

    return (
        <Card
            onClick={() => !data.disabled && history.push(`${t(data?.route)}?plantId=${plantId}`)}
            sx={{
                cursor: 'pointer',
                borderRadius: '20px',
                backgroundColor: 'transparent',
                flex: 1,
                width: '100%',
                display: 'flex',
            }}
        >
            <CardContent>
                <Box>
                    <Typography variant="body1" sx={{ flex: 1, textAlign: 'left', color: 'primary.main' }}>
                        {data.title}
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        <Typography variant="body2" sx={{ flex: 1, textAlign: 'left' }}>
                            {data.subTitle}
                        </Typography>
                        <Typography sx={{ display: 'flex', justifyContent: 'flex-end', marginLeft: '20px' }}>
                            {icon}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

const Img = styled.img``;

export default NavCard;

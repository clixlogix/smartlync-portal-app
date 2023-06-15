/**
 *
 * Clickable
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';
import { Filters, RouteTo } from 'models';
import { getQuery, putQueryStringVal } from 'utils/hooks/use-query-param';
import { Box } from '@mui/material';

interface Props {
    className?: string;
    value?: any;
    routeTo: string;
    label: string;
    params: Filters;
    onClick?();
    children?: JSX.Element;
}

export const Clickable = memo((props: Props) => {
    const history = useHistory();
    const query = getQuery();

    const { className = '', routeTo = '', label = '', value = '', params = {}, children } = props;

    const routeToReportA = (value, label) => {
        const paramKeys = Object.keys(params);

        if (label) {
            query.set(label, value);
        }

        if (paramKeys.length > 0) {
            paramKeys.forEach((key: string) => {
                query.set(key, params[key]);
            });
        }
        const q = query.toString();
        const path = `/${routeTo}?${q}`;

        switch (routeTo) {
            case RouteTo.rca:
            case RouteTo.fleetOverview:
            case RouteTo.reportingView:
                history.push(path);
                break;
            default:
                putQueryStringVal('faultCode', value);
                history.push(`/${RouteTo.reportingView}?${q}`);
                return;
        }
        return;
    };

    return (
        <Box sx={{ color: 'primary.main', cursor: 'pointer' }} onClick={() => routeToReportA(value, label)}>
            {children || value}
        </Box>
    );
});

// const Div = styled.div``;

export default Clickable;

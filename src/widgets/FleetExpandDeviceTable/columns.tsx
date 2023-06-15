import React from 'react';
import { Clickable } from 'components/Clickable';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { RouteTo, FilterNames } from 'models';

export function SimpleMediaQuery() {
    const matches = useMediaQuery('(min-width:600px)');

    return matches;
}
export const getInitialColumns = (screenSize: string): any[] => {
    let descriptionWidth;
    switch (screenSize) {
        case 'small':
            descriptionWidth = 100;
            break;
        case 'medium':
            descriptionWidth = 250;
            break;
        default:
            descriptionWidth = 350;
    }
    return [
        {
            name: 'tableColumnFault',
            options: {
                filter: true,
                sortThirdClickReset: true,
                setCellProps: () => ({
                    className: 'cell-content stud-type',
                    style: {
                        position: 'sticky',
                        backgroundColor: '#262626',
                        color: '#FFF',
                        width: '80px',
                        minWidth: '80px',
                        maxWidth: '80px',
                        left: 0,
                        paddingLeft: '10px',
                        border: 'none',
                    },
                }),
                setCellHeaderProps: () => ({
                    className: 'cell-header stud-type',
                    style: {
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        left: 0,
                        width: '80px',
                        minWidth: '80px',
                        maxWidth: '80px',
                        backgroundColor: '#262626',
                        color: '#FFF',
                        zIndex: 101,
                        border: 'none',
                    },
                }),
                customBodyRender: (faultCode, _tableMeta, _updateValue) => {
                    return (
                        <Clickable
                            value={faultCode}
                            label={'Event'}
                            params={{ [FilterNames.faultCode]: faultCode }}
                            routeTo={RouteTo.rca}
                        ></Clickable>
                    );
                },
            },
        },
        {
            name: 'tableColumnDescription',
            options: {
                filter: true,
                sortThirdClickReset: true,
                setCellProps: () => ({
                    className: 'cell-content device-name',
                    style: {
                        position: 'sticky',
                        backgroundColor: '#262626',
                        color: '#FFF',
                        width: descriptionWidth,
                        minWidth: descriptionWidth,
                        maxWidth: descriptionWidth,
                        left: 80,
                        border: 'none',
                    },
                }),
                setCellHeaderProps: () => ({
                    className: 'cell-header device-name',
                    style: {
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        left: 80,
                        backgroundColor: '#262626',
                        color: '#FFF',
                        zIndex: 101,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        border: 'none',
                    },
                }),
                customBodyRender: (description, _tableMeta, _updateValue) => {
                    return (
                        <Tooltip title={description} enterDelay={300} arrow>
                            <div className="report-description-cell">{description}</div>
                        </Tooltip>
                    );
                },
            },
        },
    ];
};

export default getInitialColumns;

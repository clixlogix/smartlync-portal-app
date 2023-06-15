import React from 'react';
import { Clickable } from 'components/Clickable';
import Tooltip from '@mui/material/Tooltip';
import { FilterNames, RouteTo } from 'models';

export const totalColumn: any[] = [
    {
        name: 'total',
        label: 'overAllResult',
        options: {
            filter: true,
            setCellProps: () => ({
                className: 'cell-content fault-count-total',
                style: {
                    position: 'sticky',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    width: 130,
                    minWidth: 130,
                    maxWidth: 130,
                    right: 0,
                    border: '1.0px solid #525252',
                },
            }),
            setCellHeaderProps: () => ({
                className: 'cell-header fault-count-total',
                style: {
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    right: 0,
                    width: 130,
                    minWidth: 130,
                    maxWidth: 130,
                    backgroundColor: '#182129',
                    color: '#FFF',
                    zIndex: 101,
                    border: '1.0px solid #525252',
                },
            }),
        },
    },
];

export const getInitialColumns = (screenSize: string): any[] => {
    let descriptionWidth;
    switch (screenSize) {
        case 'extraSmall':
            descriptionWidth = 50;
            break;
        case 'small':
            descriptionWidth = 100;
            break;
        case 'medium':
            descriptionWidth = 250;
            break;
        default:
            descriptionWidth = 400;
    }
    return [
        {
            name: 'faultCode',
            label: 'tableColumnFault',
            options: {
                filter: true,
                setCellProps: () => ({
                    className: 'cell-content fault-code',
                    style: {
                        position: 'sticky',
                        backgroundColor: '#182129',
                        color: '#FFF',
                        width: '80px',
                        minWidth: '80px',
                        maxWidth: '80px',
                        left: 0,
                        border: '1.0px solid #525252',
                    },
                }),
                setCellHeaderProps: () => ({
                    className: 'cell-header fault-code',
                    style: {
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        left: 0,
                        width: '80px',
                        minWidth: '80px',
                        maxWidth: '80px',
                        backgroundColor: '#182129',
                        color: '#FFF',
                        zIndex: 101,
                        border: '1.0px solid #525252',
                    },
                }),
                customBodyRender: (faultCode, _tableMeta, _updateValue) => {
                    return (
                        <Clickable
                            value={faultCode}
                            label={'faultCode'}
                            params={{ [FilterNames.faultCode]: faultCode }}
                            routeTo={RouteTo.rca}
                        ></Clickable>
                    );
                },
            },
        },
        {
            name: 'description',
            label: 'tableColumnDescription',
            options: {
                filter: true,
                sort: true,
                setCellProps: () => ({
                    className: 'cell-content fault-description text-ellipsis-2-line',
                    style: {
                        position: 'sticky',
                        backgroundColor: '#182129',
                        color: '#FFF',
                        width: descriptionWidth,
                        minWidth: descriptionWidth,
                        maxWidth: descriptionWidth,
                        left: 80,
                        border: '1.0px solid #525252',
                        textAlign: 'start',
                    },
                }),
                setCellHeaderProps: () => ({
                    className: 'cell-header fault-description',
                    style: {
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        left: 80,
                        backgroundColor: '#182129',
                        color: '#FFF',
                        zIndex: 101,
                        border: '1.0px solid #525252',
                    },
                }),
                customBodyRender: (description, _tableMeta, _updateValue) => {
                    return (
                        <Tooltip title={description.description || ''} enterDelay={3000} arrow>
                            <div className="report-description-cell">{description.description}</div>
                        </Tooltip>
                    );
                },
            },
        },
    ];
};

export default getInitialColumns;

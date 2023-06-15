// import React from 'react';
// import { Clickable } from 'components/Clickable';

export const columns: any[] = [
    {
        name: 'deviceName',
        label: 'tableColumnDeviceName',
        options: {
            filter: true,
            setCellProps: () => ({
                className: 'cell-content stud-type',
                style: {
                    position: 'sticky',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    width: '190px',
                    minWidth: '190px',
                    maxWidth: '190px',
                    left: 0,
                    border: '1.0px solid #525252',
                },
            }),
            setCellHeaderProps: () => ({
                className: 'cell-header stud-type',
                style: {
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    left: 0,
                    width: '190px',
                    minWidth: '190px',
                    maxWidth: '190px',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    zIndex: 101,
                    border: '1.0px solid #525252',
                },
            }),
        },
    },
    {
        name: 'total',
        label: 'overAllResult',
        options: {
            filter: false,
            display: true,
            setCellProps: () => ({
                className: 'cell-content fault-code-totals',
                style: {
                    position: 'sticky',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    width: '50px',
                    minWidth: '50px',
                    maxWidth: '50px',
                    left: 190,
                    border: '1.0px solid #525252',
                    textAlign: 'center',
                    whiteSpace: 'pre-wrap',
                    borderRight: '1.0px solid #525252',
                },
            }),
            setCellHeaderProps: () => ({
                className: 'cell-header fault-code-totals',
                style: {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    position: 'sticky',
                    left: 190,
                    background: 'white',
                    zIndex: 101,
                    backgroundColor: '#182129',
                    border: '1.0px solid #525252',
                },
            }),
        },
    },
];

export default columns;

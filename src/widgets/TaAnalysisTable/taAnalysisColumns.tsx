// import React from 'react';

export const columns: any[] = [
    {
        name: 'tableDeviceName',
        options: {
            filter: true,
            setCellProps: () => ({
                className: 'cell-content stud-type',
                style: {
                    position: 'sticky',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    minWidth: '280px',
                    left: 0,
                    border: '1.0px solid #525252',
                    textAlign: 'left',
                    paddingLeft: '5px',
                },
            }),
            setCellHeaderProps: () => ({
                className: 'cell-header stud-type',
                style: {
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    left: 0,
                    minWidth: '280px',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    zIndex: 101,
                    border: '1.0px solid #525252',
                },
            }),
        },
    },
    {
        name: 'TA (%)',
        options: {
            filter: true,
            setCellProps: () => ({
                className: 'cell-content stud-type',
                style: {
                    position: 'sticky',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    minWidth: '80px',
                    left: 280,
                    border: '1.0px solid #525252',
                    textAlign: 'right',
                    paddingRight: '5px',
                },
            }),
            setCellHeaderProps: () => ({
                className: 'cell-header stud-type',
                style: {
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    left: 280,
                    minWidth: '80px',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    zIndex: 101,
                    border: '1.0px solid #525252',
                },
            }),
        },
    },
    {
        name: 'MTBF (hr)',
        options: {
            filter: true,
            setCellProps: () => ({
                className: 'cell-content stud-type',
                style: {
                    position: 'sticky',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    minWidth: '90px',
                    left: 360,
                    border: '1.0px solid #525252',
                    textAlign: 'right',
                    paddingRight: '5px',
                },
            }),
            setCellHeaderProps: () => ({
                className: 'cell-header stud-type',
                style: {
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    left: 360,
                    minWidth: '90px',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    zIndex: 101,
                    border: '1.0px solid #525252',
                },
            }),
        },
    },
    {
        name: 'MTTR (min)',
        options: {
            filter: true,
            setCellProps: () => ({
                className: 'cell-content stud-type',
                style: {
                    position: 'sticky',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    minWidth: '90px',
                    left: 450,
                    border: '1.0px solid #525252',
                    textAlign: 'right',
                    paddingRight: '5px',
                },
            }),
            setCellHeaderProps: () => ({
                className: 'cell-header stud-type',
                style: {
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    left: 450,
                    minWidth: '90px',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    zIndex: 101,
                    border: '1.0px solid #525252',
                },
            }),
        },
    },
];

export default columns;

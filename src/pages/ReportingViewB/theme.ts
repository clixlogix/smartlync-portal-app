import { createTheme as createMuiTheme, adaptV4Theme } from '@mui/material/styles';
// import {  useMemo } from 'react';

export const Theme = () => {
    const obj = {
        MuiTableCell: {
            root: {
                border: '1.0px solid #525252',
                backgroundColor: '#000',
            },
            head: {
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
            },
            body: {
                // backgroundColor: 'black',
            },
        },
        MuiButton: {
            text: {
                color: '#fff',
            },
        },
        // MuiPaper: {
        //     root: {
        //         backgroundColor: '#000',
        //     },
        // },
        MuiSvgIcon: {
            root: {
                color: '#fff',
            },
        },
        MUIDataTableHeadCell: {
            sortActive: {
                color: '#fff',
            },
            contentWrapper: {
                margin: 'auto auto',
                width: 42,
            },
            fixedHeader: { padding: '16px 0 16px 5px' },
            toolButton: { marginLeft: 'auto', marginRight: 'auto' },
        },
        MUIDataTableBodyCell: {
            // root: {
            //     backgroundColor: '#000',
            // },
            stackedCommon: {
                color: '#fff',
            },
        },
        MuiTableSortLabel: {
            icon: { color: '#fff' },
            iconDirectionAsc: { color: '#fff !important' },
            iconDirectionDesc: { color: '#fff !important' },
        },
        MuiSelect: {
            root: {
                color: '#ffffff',
            },
        },
    };
    return createMuiTheme(adaptV4Theme({
        overrides: { ...obj },
    }));
};

export default Theme;

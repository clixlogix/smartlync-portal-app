/**
 *
 * Table
 *
 */
import React, { memo, useMemo } from 'react';
import MUIDataTable from 'mui-datatables';
import _ from 'lodash';

// import './Table.scss';

export enum TableTheme {
    Dark = 'dark',
    Light = 'light',
    Blue = 'blue',
    Nine = 'Nine',
    CarBodyRisk = 'CarBodyRisk',
}
interface TableProps {
    title?: any;
    data?: any;
    columns?: any;
    options?: any;
    overrideOptions?: any;
    className?: string;
    tableBodyHeight?: number;
    tableFooterHeight?: number;
    toolbarHeight?: number;
    theme?: TableTheme;
    stripe?: boolean;
    size?: { width: number; height: number };
    themeObj?: any;
    caption?: boolean;
    tableHeight?: string;
}

const Table = memo((props: TableProps) => {
    const {
        className = '',
        tableBodyHeight = props.tableBodyHeight ? props.tableBodyHeight : props.size?.height || 200,
        // toolbarHeight = props.options?.customToolbar ? 60 : 0,
        tableFooterHeight = 60,
        title,
        columns = [],
        options = {},
        data = [],
        // theme = TableTheme.Blue,
        // stripe = true,
        // themeObj = {},
        // overrideOptions,
        // caption = false,
    } = props;

    // const tableTheme = useMemo(() => {
    //     let backgroundColor: string = '#182129';
    //     let headerBackgroundColor: string = '#20262C';
    //     let headerBackground: string = `${headerBackgroundColor} 0% 0% no-repeat padding-box`;
    //     let bodyBackground: string = `#212121 0% 0% no-repeat padding-box;`;
    //     let bodyStripe = [bodyBackground, stripe ? '#151C24 0% 0% no-repeat padding-box;' : bodyBackground];
    //     let tObj;

    //     switch (theme) {
    //         case TableTheme.Dark:
    //             backgroundColor = '#000';
    //             break;
    //         case TableTheme.Light:
    //             backgroundColor = '#fff';
    //             break;
    //         case TableTheme.Nine:
    //             headerBackgroundColor = 'transparent';
    //             headerBackground = `${headerBackgroundColor} 0% 0% no-repeat padding-box`;
    //             tObj = {
    //                 MuiTableCell: {
    //                     root: {
    //                         backgroundColor: '#212121',
    //                         color: '#FFF',
    //                         border: 'none',
    //                         padding: '14px 2px 14px 7px',
    //                         borderBottom: '1px solid #262626',
    //                         borderRight: 'none',
    //                         margin: '10px',
    //                     },
    //                     head: {},
    //                     body: {
    //                         backgroundColor: '#212121',
    //                         color: '#FFF',
    //                     },
    //                 },
    //                 MuiTableBody: {
    //                     root: {
    //                         backgroundColor: '#303030',
    //                         color: '#FFF',
    //                         boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.12)',
    //                     },
    //                 },
    //                 MuiPaper: {
    //                     root: {
    //                         backgroundColor: '#212121',
    //                         boxShadow: 'none',
    //                     },
    //                 },
    //                 MuiCard: {
    //                     root: {
    //                         overflow: 'auto',
    //                     },
    //                 },
    //                 MuiList: {
    //                     root: {
    //                         color: '#fff',
    //                     },
    //                 },
    //                 MuiMenu: {
    //                     list: {
    //                         color: '#fff',
    //                     },
    //                 },
    //                 MUIDataTableHeadCell: {
    //                     sortActive: {
    //                         color: '#fff',
    //                         paddingRight: '10px',
    //                     },
    //                     data: { textTransform: 'capitalize' },
    //                     contentWrapper: {
    //                         margin: 'auto auto',
    //                     },
    //                     fixedHeader: {
    //                         textAlign: 'center',
    //                         fontSize: 16,
    //                         fontWeight: 'bold',
    //                         background: headerBackground,
    //                         backgroundColor: headerBackgroundColor,
    //                     },
    //                     toolButton: { marginLeft: 'auto', marginRight: 'auto' },
    //                 },
    //             };
    //             break;
    //         case TableTheme.CarBodyRisk:
    //             tObj = {
    //                 MuiTableCell: {
    //                     root: {
    //                         border: '1.0px solid #525252',
    //                         backgroundColor: '#000',
    //                         padding: '0px',
    //                     },
    //                     head: {
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         width: 42,
    //                     },
    //                     body: {
    //                         color: '#000',
    //                     },
    //                 },
    //                 MuiButton: {
    //                     text: {
    //                         color: '#fff',
    //                     },
    //                 },
    //                 MuiPaper: {
    //                     root: {
    //                         backgroundColor: '#000',
    //                     },
    //                 },
    //                 MuiToolbar: {
    //                     root: {
    //                         backgroundColor: '#000',
    //                     },
    //                 },
    //                 MuiList: {
    //                     root: {
    //                         color: '#fff',
    //                     },
    //                 },
    //                 MuiMenu: {
    //                     list: {
    //                         color: '#fff',
    //                     },
    //                 },
    //                 MuiSvgIcon: {
    //                     root: {
    //                         color: '#fff',
    //                     },
    //                 },
    //                 MUIDataTableHeadCell: {
    //                     sortActive: {
    //                         color: '#fff',
    //                         paddingRight: '10px',
    //                     },
    //                     contentWrapper: {
    //                         margin: 'auto auto',
    //                         width: 42,
    //                     },
    //                     fixedHeader: { padding: '0px 0px 0px 0px' },
    //                     toolButton: { marginLeft: 'auto', marginRight: 'auto' },
    //                 },
    //                 MUIDataTableBodyCell: {
    //                     stackedCommon: {
    //                         color: '#fff',
    //                         whiteSpace: 'nowrap',
    //                         overflow: 'hidden',
    //                         textOverflow: 'ellipsis',
    //                     },
    //                 },
    //                 MuiTableSortLabel: {
    //                     icon: { color: '#fff' },
    //                     iconDirectionAsc: { color: '#fff !important' },
    //                     iconDirectionDesc: { color: '#fff !important' },
    //                 },
    //                 MuiTypography: {
    //                     h6: { color: '#ffdb38' },
    //                 },
    //             };
    //             break;
    //         case TableTheme.Blue:
    //         default:
    //             headerBackground = `${headerBackgroundColor} 0% 0% no-repeat padding-box`;
    //             break;
    //     }

    //     const width = props.size?.width || '100%';

    //     const obj = tObj || {
    //         root: {
    //             '&$disabled': {
    //                 color: '#ffdb38',
    //             },
    //         },
    //         MUIDataTableBodyRow: {
    //             root: {
    //                 '&:nth-child(odd)': {
    //                     background: bodyStripe[0],
    //                 },
    //                 '&:nth-child(even)': {
    //                     background: bodyStripe[1],
    //                 },
    //             },
    //         },
    //         MuiList: {
    //             root: {
    //                 color: '#fff',
    //             },
    //         },
    //         MuiMenu: {
    //             list: {
    //                 color: '#fff',
    //             },
    //         },
    //         MuiTableCell: {
    //             root: {
    //                 border: '1.0px solid #525252',
    //                 padding: '10px',
    //             },
    //             head: {
    //                 color: 'white',
    //             },
    //             body: {
    //                 color: 'transparent',
    //             },
    //             footer: { backgroundColor },
    //         },
    //         MuiButton: {
    //             text: {
    //                 color: '#fff',
    //             },
    //         },
    //         MuiPaper: {
    //             root: {
    //                 backgroundColor,
    //             },
    //         },
    //         MuiSvgIcon: {
    //             root: {
    //                 color: '#fff',
    //             },
    //         },
    //         MUIDataTableHeadCell: {
    //             sortActive: {
    //                 color: '#fff',
    //                 paddingRight: '8px',
    //             },
    //             data: { textTransform: 'capitalize' },
    //             contentWrapper: {
    //                 margin: 'auto auto',
    //             },
    //             fixedHeader: {
    //                 textAlign: 'center',
    //                 fontSize: 16,
    //                 fontWeight: 'bold',
    //                 background: headerBackground,
    //                 backgroundColor: headerBackgroundColor,
    //                 whiteSpace: 'nowrap',
    //             },
    //             toolButton: { marginLeft: 'auto', marginRight: 'auto' },
    //         },
    //         MUIDataTableBodyCell: {
    //             stackedCommon: {
    //                 color: '#fff',
    //             },
    //         },
    //         MuiTableSortLabel: {
    //             root: {
    //                 '&:focus': 'inherit !important',
    //                 '&:hover': 'inherit !important',
    //             },
    //             icon: { color: '#fff' },
    //             iconDirectionAsc: { color: '#fff !important', marginLeft: -8, marginRight: 0 },
    //             iconDirectionDesc: { color: '#fff !important', marginLeft: -8, marginRight: 0 },
    //         },
    //         MUIDataTable: {
    //             responsiveBase: { backgroundColor, border: '1px solid silver', width },
    //         },
    //         MUIDataTableFilterList: {
    //             root: {
    //                 display: 'none',
    //             },
    //         },
    //     };
    //     const overrides = overrideOptions || _.merge(obj, themeObj);
    //     return createMuiTheme(adaptV4Theme({ overrides }));
    // }, [theme, stripe, themeObj, overrideOptions, props.size?.width]);

    const tableOptions: any = useMemo(() => {
        let params: any = {
            pagination: false,
        };

        if (data?.length > 75) {
            params = {
                jumpToPage: true,
                pagination: true,
                rowsPerPage: 50,
                rowsPerPageOptions: [75, 100, 200],
            };
        }

        return _.merge(
            {
                filter: false,
                pagination: false,
                fixedHeader: true,
                elevation: 5,
                selectableRowsHeader: false,
                responsive: 'vertical',
                search: false,
                download: false,
                print: false,
                viewColumns: false,
                customToolbar: null,
                selectableRows: 'none',
                enableNestedDataAccess: '.',
                confirmFilters: true,
                // selectableRowsHideCheckboxes: true,
                // filterType: 'none',
                // ...options,
                ...params,
            },
            options,
        );
    }, [options, data]);

    //  tableBodyHeight - (tableOptions.pagination ? tableFooterHeight : 0) - (caption ? 3 : 0) - toolbarHeight;
    const height = tableOptions.pagination ? tableBodyHeight : tableBodyHeight + tableFooterHeight;

    return (
        <MUIDataTable
            className={`${className} x-cls-table`}
            title={title}
            data={data}
            columns={columns}
            options={{
                ...tableOptions,
                tableBodyHeight: `${height}px`,
            }}
        />
    );
});

export default Table; // withSize({ monitorHeight: true })(Table);

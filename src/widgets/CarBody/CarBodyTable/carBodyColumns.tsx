import {
    TableBody as CBTableBody,
    TableHeadLabel as CBTableHeadLabel,
    TableHeader as CBTableHead,
} from './components/TableComponents';

export const columns: any[] = [
    {
        name: 'carBody',
        options: {
            customHeadRender: (columnMeta, handleToggleColumn, sortOrder) =>
                CBTableHead({ columnMeta, handleToggleColumn, sortOrder }),
            setCellProps: () => ({
                // className: 'cell-content stud-type',
                style: {
                    backgroundColor: '#424242',
                    color: '#FFF',
                    width: '100px',
                    padding: '0px',
                    border: '1.0px solid #525252',
                    textAlign: 'center',
                },
            }),
            setCellHeaderProps: () => ({
                // className: 'cell-header stud-type',
                style: {
                    whiteSpace: 'nowrap',
                    width: '100px',
                    padding: '0px',
                    height: '90px',
                    backgroundColor: '#424242',
                    color: 'white',
                    border: '1.0px solid #525252',
                },
            }),
        },
    },
    {
        name: 'total',
        options: {
            // sort: true,
            customHeadRender: (columnMeta, handleToggleColumn, sortOrder) =>
                CBTableHead({ columnMeta, handleToggleColumn, sortOrder }),
            customBodyRender: (value, tableMeta, updateValue) => CBTableBody({ value, tableMeta }),
            setCellProps: () => ({
                // className: 'cell-content stud-type',
                style: {
                    backgroundColor: '#424242',
                    color: '#FFF',
                    width: '10px',
                    padding: '0px',
                    align: 'center',
                    // minWidth: '10px',
                    // maxWidth: '190px',
                    border: '1.0px solid #525252',
                },
            }),
            setCellHeaderProps: () => ({
                // className: 'cell-header stud-type',
                style: {
                    whiteSpace: 'nowrap',
                    width: '10px',
                    padding: '0px',
                    height: '90px',
                    // minWidth: '10px',
                    // maxWidth: '190px',
                    backgroundColor: '#424242',
                    color: '#FFF',
                    border: '1.0px solid #525252',
                },
            }),
        },
    },
];

export default columns;

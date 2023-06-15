/**
 *
 * GridTable
 *
 */
import React, { memo } from 'react';
import { DataGrid, GridColumns, DataGridProps } from '@mui/x-data-grid';

interface Props {
    className?: string;
    tableColumns?: Array<any>;
    tableRows?: any;
    children?: React.ReactNode | React.ReactNode[];
    rows?: any[] | undefined;
    columns?: any[] | undefined;
    hideFooter?: boolean;
}

export const GridTable = memo((props: Props) => {
    const { className = '', tableColumns, tableRows, hideFooter = true } = props;


    return (
            <DataGrid
                rows={tableRows}
                columns={tableColumns as GridColumns}
                hideFooter={hideFooter}
                disableColumnMenu={true}
            />
    );
});


export default GridTable;

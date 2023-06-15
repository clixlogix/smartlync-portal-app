/**
 *
 * TableHead
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';

import './TableHeader.scss';
import { memo } from 'react';
import Stack from '@mui/material/Stack';

interface TableHeaderProps {
    className?: string;
    columnMeta?: any;
    expand?: boolean;
    sortOrder?: any;
    sortColumn?: any;
    width?: number;
    order?: string;

    handleToggleColumn?(columnName, tableColumnIndex);
    handleTableLinkClick?(event: any, label: any, /* reportingDataView: ReportingDataView, */ name: any);
}

export const TableHeader = memo((props: TableHeaderProps) => {
    const {
        columnMeta = { name: '', label: '', description: '' },
        sortOrder = {},
        order,
        width,
        handleToggleColumn = () => { },
    } = props;
    const { name = '' /*, label = '' */, index = 0, sort, description = '' } = columnMeta;
    const direction = sortOrder.name === name ? sortOrder.direction : 'asc';
    const showSortIcon = (order && order !== 'none' && sortOrder.name === name) || false;

    const onHandleSort = (columnName: string, index: number) => {
        if (handleToggleColumn) {
            handleToggleColumn(columnName, index);
        }
    };

    return (
        <Th
            key={`table-head-key-${Math.random()}`}
            style={{ width }}
            className={`x-cls-topFaultCount-table-header-cell center`}
        >
            <Div style={{ cursor: 'pointer' }} onClick={() => onHandleSort('all', index)}>
                <Tooltip
                    arrow
                    title={<div className={'launch-tool-tip'}>{`Sort`}</div>}
                    aria-label={`Sort`}
                    placement={'bottom'}
                >
                    <Stack direction={'column'}>
                        <div className="description-text">{description}</div>
                        <Div className="col" style={{ justifyContent: 'end' }}>
                            <TableSortLabel
                                className={'sort-label'}
                                active={sort && showSortIcon}
                                direction={direction}
                                hideSortIcon={!showSortIcon}
                            >
                                <Div className="col">
                                    <Div
                                        className={'x-fault-code'}
                                        style={{ whiteSpace: 'nowrap', fontSize: 14, color: 'white' }}
                                    >
                                        {columnMeta.name}
                                    </Div>
                                </Div>
                            </TableSortLabel>
                        </Div>
                    </Stack>
                </Tooltip>
            </Div>
        </Th>
    );
});

const Th = styled.th``;
const Div = styled.div``;

export default TableHeader;

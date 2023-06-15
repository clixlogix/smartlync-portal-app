/**
 *
 * TableHead
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import Tooltip from '@mui/material/Tooltip';
import TableSortLabel from '@mui/material/TableSortLabel';
import { ReportingDataView } from 'models';

import './TableHeader.scss';

interface Props {
    className?: string;
    columnMeta?: any;
    expanded: boolean;
    labelFormat?: string;
    extendedLabelFormat?: string;
    langCode?: string;
    sortOrder?: any;
    sortColumn?: any;
    width: number;

    handleToggleColumn?();
    handleTableLinkClick?(event: any, label: any, reportingDataView: ReportingDataView, name: any);
}

export function TableHeader(props: Props) {
    const { className = '', columnMeta = { name: '', label: '' }, width, sortOrder = {}, handleToggleColumn } = props;

    const { index = 0, sort } = columnMeta;
    const sortDirection = sortOrder.name === columnMeta.name ? sortOrder.direction : 'asc';
    const showSortIcon = sortOrder && sortOrder.name === columnMeta.name;

    const onHandleSort = (columnName: string, index: number) => {
        if (handleToggleColumn) {
            handleToggleColumn();
        }
    };

    return (
        <Th
            key={`table-head-daily-key-${Math.random()}`}
            style={{ width, minWidth: width }}
            className={`${className} x-cls-table-header-cell x-cls-table-header-daily-cell  center`}
        >
            <Div className="stanleyRow" style={{ justifyContent: 'center' }}>
                <Tooltip
                    arrow
                    title={<div className={'launch-tool-tip'}>{`Sort by Faults`}</div>}
                    aria-label={`Sort by Faults`}
                    placement={'bottom'}
                >
                    <TableSortLabel
                        className={'sort-label'}
                        hideSortIcon={!showSortIcon}
                        active={sort && showSortIcon}
                        direction={sortDirection}
                        onClick={() => onHandleSort('all', index)}
                    >
                        <Div>{columnMeta.label}</Div>
                    </TableSortLabel>
                </Tooltip>
            </Div>
        </Th>
    );
}

const Th = styled.th``;
const Div = styled.div``;

export default TableHeader;

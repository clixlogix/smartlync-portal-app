/**
 *
 * TableHead
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';

// import { ReportingDataView } from 'pages/ReportingView';

import './TableHeader.scss';

interface Props {
    className?: string;
    columnMeta?: any;
    expand?: boolean;
    sortOrder?: any;
    sortColumn?: any;
    width?: number;
    filters?: any;

    handleToggleColumn?(columnName, tableColumnIndex);
    handleTableLinkClick?(event: any, label: any, /* reportingDataView: ReportingDataView, */ name: any);
}

export function TableHeader(props: Props) {
    const {
        className = '',
        columnMeta = { name: '', label: '', description: '' },
        sortOrder = {},
        width,
        filters,
        // sortColumn,
        handleToggleColumn = () => {},
        // handleTableLinkClick = () => {},
    } = props;
    const { name = '' /*, label = '' */, index = 0, sort } = columnMeta;

    const studIdHL = name === parseInt(filters.studId) ? 'highLightFilter' : '';
    const direction = sortOrder.name === name ? sortOrder.direction : 'asc';
    const showSortIcon = sortOrder && sortOrder.name === name;

    const onHandleSort = (columnName: string, index: number) => {
        if (handleToggleColumn) {
            handleToggleColumn(columnName, index);
        }
    };

    return (
        <Th
            key={`table-head-key-${Math.random()}`}
            style={{ width }}
            className={`${className} x-cls-carBody-table-header-cell center ${studIdHL}`}
        >
            <Div className={`col`} style={{ justifyContent: 'end' }}>
                <Tooltip
                    arrow
                    title={<div className={'launch-tool-tip'}>{`Sort`}</div>}
                    aria-label={`Sort`}
                    placement={'bottom'}
                >
                    <TableSortLabel
                        className={'sort-label'}
                        active={sort && showSortIcon}
                        direction={direction}
                        hideSortIcon={!showSortIcon}
                        onClick={() => onHandleSort('all', index)}
                    >
                        <Div className="col">
                            <Div style={{ fontSize: 13, color: 'black' }}>{columnMeta.name}</Div>
                        </Div>
                    </TableSortLabel>
                </Tooltip>
            </Div>
        </Th>
    );
}

const Th = styled.th``;
const Div = styled.div``;

export default TableHeader;

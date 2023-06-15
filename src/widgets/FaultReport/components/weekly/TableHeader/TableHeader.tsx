/**
 *
 * TableHead
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import TableSortLabel from '@mui/material/TableSortLabel';
import LinkIcon from '@mui/icons-material/Link';
import Tooltip from '@mui/material/Tooltip';
import { ReportingDataView } from 'models';

import './TableHeader.scss';

interface Props {
    className?: string;
    columnMeta?: any;
    expand: boolean;
    sortOrder?: any;
    sortColumn?: any;
    width: number;

    handleToggleColumn?(columnName, tableColumnIndex);
    handleTableLinkClick?(event: any, label: any, reportingDataView: ReportingDataView, name: any);
}

export function TableHeader(props: Props) {
    const {
        className = '',
        columnMeta = { name: '', label: '' },
        expand,
        sortOrder = {},
        width,
        sortColumn,
        handleToggleColumn = () => {},
        handleTableLinkClick = () => {},
    } = props;
    const { name = '', label = '', index = 0, sort } = columnMeta;
    const direction = sortOrder.name === name ? sortOrder.direction : 'asc';
    const showSortIcon = sortOrder && sortOrder.name === name;

    const Columns = [
        {
            column: 'faults',
            label: 'Faults',
        },
        {
            column: 'cycle',
            label: 'Cycle',
        },
        {
            column: 'ratio',
            label: 'Ratio',
        },
    ];

    const onHandleSort = (columnName: string, index: number) => {
        if (handleToggleColumn) {
            handleToggleColumn(columnName, index);
        }
    };

    const renderSortLabel = (show: boolean, column: string, label: string) => {
        return (
            <Tooltip
                arrow
                title={<div className={'launch-tool-tip'}>{`Sort by ${label}`}</div>}
                aria-label={`Sort by ${label}`}
                placement={'bottom'}
            >
                <Div className={'column-label'} onClick={() => onHandleSort(column, index)}>
                    {label} &nbsp;
                    <Div
                        className={`sort-icon ${show ? 'show' : 'hide'} fa fa-${
                            sortOrder.direction === 'asc' ? 'arrow-up' : 'arrow-down'
                        }`}
                    ></Div>
                </Div>
            </Tooltip>
        );
    };

    return (
        <Th
            key={`table-head-key-${Math.random()}`}
            style={{ width }}
            className={`${className} x-cls-table-header-cell center`}
        >
            <Div className="stanleyRow" style={{ justifyContent: 'center' }}>
                {!expand ? (
                    <Tooltip
                        arrow
                        title={<div className={'launch-tool-tip'}>{`Sort by Faults`}</div>}
                        aria-label={`Sort by Faults`}
                        placement={'bottom'}
                    >
                        <TableSortLabel
                            className={'sort-label'}
                            active={sort && showSortIcon}
                            direction={direction}
                            hideSortIcon={!showSortIcon}
                            onClick={() => onHandleSort('all', index)}
                        >
                            <Div style={{ fontSize: 14, color: 'white' }}>{columnMeta.name}</Div>
                        </TableSortLabel>
                    </Tooltip>
                ) : (
                    <Div style={{ fontSize: 14, color: 'white' }}>{columnMeta.name}</Div>
                )}
            </Div>
            {label !== 'cycleCount' && label !== 'ratio' && (
                <Div
                    className="launch-icon"
                    style={{ zIndex: 3030 }}
                    onClick={(event) => handleTableLinkClick(event, label, ReportingDataView.Weekly, name)}
                >
                    <Tooltip
                        arrow
                        title={<div className={'launch-tool-tip'}>{`show Days Of Week ${label}`}</div>}
                        aria-label={`show Days Of Week ${label}`}
                        placement={'bottom'}
                    >
                        <LinkIcon />
                    </Tooltip>
                </Div>
            )}
            {expand && (
                <Div className="value-labels stanleyRow" style={{ width: 180 }}>
                    {Columns.map(({ column, label }) =>
                        renderSortLabel(showSortIcon && sortColumn === column, column, label),
                    )}
                </Div>
            )}
        </Th>
    );
}

const Th = styled.th``;
const Div = styled.div``;

export default TableHeader;

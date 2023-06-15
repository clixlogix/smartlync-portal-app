/**
 *
 * TableHead
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import TableSortLabel from '@mui/material/TableSortLabel';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { ReportingDataView } from 'models';
import moment, { LocaleSpecifier } from 'moment';

import './TableHeader.scss';

interface TableHeaderProps {
    className?: string;
    columnMeta?: any;
    expand: boolean;
    sortOrder?: any;
    order?: string;
    sortColumn?: any;
    width: number;
    key?: string;
    langCode?: LocaleSpecifier;
    labelFormat?: string;
    showFaultRate: boolean;

    handleToggleColumn?(columnName, tableColumnIndex);
    handleTableLinkClick?(event: any, label: any, reportingDataView: ReportingDataView, name: any);
}

export const TableHeader = memo((props: TableHeaderProps) => {
    const {
        className = '',
        key = `x-key-${Math.random()}`,
        columnMeta = { name: '', label: '' },
        expand,
        sortOrder = {},
        order,
        width,
        sortColumn,
        langCode = 'en',
        labelFormat = 'W',
        showFaultRate = true,
        handleToggleColumn = () => { },
        handleTableLinkClick = () => { },
    } = props;
    const { name = '', label = '', index = 0, sort, time } = columnMeta;
    const direction = sortOrder.name === name ? sortOrder.direction : 'asc';
    const showSortIcon = (order && order !== 'none' && sortOrder.name === name) || false;
    const { i18n } = useTranslation();
    const weekNo = moment(time).isoWeek();
    const startOfMonth = moment(time).startOf('month').week();

    let month = moment(time).format('MMM');

    let weekStyle = 'week';
    if (startOfMonth !== weekNo && index > 2) {
        month = ' ';
        weekStyle = '';
    }

    const Columns = [
        {
            column: 'faults',
            label: 'Events',
        },
        {
            column: 'cycle',
            label: 'Cycle',
        },
        {
            column: 'ratio',
            label: 'Ratio',
        },
        {
            column: 'wop',
            label: 'WOP',
        },
        {
            column: 'duration',
            label: 'TDT',
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
                title={
                    <div className={'launch-tool-tip'}>{`Sort by ${label === 'TDT' ? 'Total DownTime (In Seconds)' : label
                        }`}</div>
                }
                aria-label={`Sort by ${name}`}
                placement={'bottom'}
            >
                <Div className={'column-label'} onClick={() => onHandleSort(column, index)}>
                    {label} &nbsp;
                    <Div
                        className={`sort-icon ${show ? 'show' : 'hide'} fa fa-${sortOrder.direction === 'asc' ? 'arrow-up' : 'arrow-down'
                            }`}
                    ></Div>
                </Div>
            </Tooltip>
        );
    };

    return (
        <Th
            key={`table-head-key-${key}-${Math.random()}`}
            style={{ width }}
            className={`${className} x-cls-table-header-cell center`}
        >
            <Div className="stanleyRow" style={{ justifyContent: 'center' }}>
                {!expand ? (
                    <Tooltip
                        arrow
                        title={
                            <div className={'launch-tool-tip'}>{`Sort by ${showFaultRate ? 'Fault Rate' : 'Fault Count'
                                }`}</div>
                        }
                        aria-label={`Sort by ${showFaultRate ? 'Fault Rate' : 'Fault Count'}`}
                        placement={'bottom'}
                    >
                        <TableSortLabel
                            className={'sort-label'}
                            active={sort && showSortIcon}
                            direction={direction}
                            hideSortIcon={!showSortIcon}
                            onClick={() => onHandleSort(showFaultRate ? 'ratio' : 'faults', index)}
                        >
                            <Div style={{ fontSize: 14, color: 'white' }}>{`W${moment(time).format(labelFormat)}`}</Div>
                        </TableSortLabel>
                    </Tooltip>
                ) : (
                    <Div style={{ fontSize: 14, color: 'white' }}>{`Week ${moment(time).format(labelFormat)}`}</Div>
                )}
            </Div>
            {label !== 'cycleCount' && label !== 'ratio' && label !== 'wop' && label !== 'duration' && (
                <Div
                    className="launch-icon"
                    style={{ zIndex: 3030 }}
                    onClick={(event) => handleTableLinkClick(event, label, ReportingDataView.Daily, name)}
                >
                    <Tooltip
                        arrow
                        title={<div className={'launch-tool-tip'}>{`show Days Of Week ${name}`}</div>}
                        aria-label={`show Days Of Week ${name}`}
                        placement={'bottom'}
                    >
                        <ZoomInIcon />
                    </Tooltip>
                </Div>
            )}
            {expand && (
                <Div className="value-labels stanleyRow" style={{ width: 200 }}>
                    {Columns.map(({ column, label }) =>
                        renderSortLabel(showSortIcon && sortColumn === column, column, label),
                    )}
                </Div>
            )}
            <Div className={`x-trans-label ${weekStyle}`}>{month}</Div>
        </Th>
    );
});

const Th = styled.th``;
const Div = styled.div``;

export default TableHeader;

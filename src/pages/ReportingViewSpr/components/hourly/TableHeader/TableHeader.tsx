/**
 *
 * TableHead
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import moment, { LocaleSpecifier } from 'moment';
import { ReportingDataView } from 'models';
import TableSortLabel from '@mui/material/TableSortLabel';

import './TableHeader.scss';

interface Props {
    className?: string;
    key?: string;
    columnMeta?: any;
    expand: boolean;
    sortOrder?: any;
    order?: string;
    sortColumn?: any;
    width: number;
    langCode?: LocaleSpecifier;
    labelFormat?: string;
    showFaultRate: boolean;

    handleToggleColumn?(columnName, tableColumnIndex);
    handleTableLinkClick?(event: any, label: any, reportingDataView: ReportingDataView, name: any);
}

export function TableHeader(props: Props) {
    const {
        className = '',
        // key = `x-key-reportingView-hourly-${Math.random()}`,
        columnMeta = { name: '', label: '' },
        expand,
        sortOrder = {},
        order,
        // width,
        sortColumn,
        // langCode = 'en',
        // labelFormat = 'W',
        showFaultRate = true,
        // handleToggleColumn = () => {},
        // handleTableLinkClick = () => {},
    } = props;

    const { name = '' /*, label = ''*/, index = 0, sort, time } = columnMeta;
    const direction = sortOrder.name === name ? sortOrder.direction : 'asc';
    const showSortIcon = (order && order !== 'none' && sortOrder.name === name) || false;
    const { i18n } = useTranslation();

    const currentTime = Math.floor(moment().unix() / 3600);
    const hour = moment(time).hour();
    const cmpTime = Math.floor(moment(time).unix() / 3600);

    let timeStyle = 'past';
    if (cmpTime === currentTime) {
        timeStyle = 'present';
    }
    if (cmpTime > currentTime) {
        timeStyle = 'future';
    }

    const headerLabel = time.format('HH:mm');
    const day = time.format('dddd(DD-MMM)');

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
            column: 'rop',
            label: 'ROP',
        },
        {
            column: 'duration',
            label: 'TDT',
        },
    ];

    const onHandleSort = (columnName: string, index: number) => {
        // if (handleToggleColumn) {
        //     handleToggleColumn(columnName, index);
        // }
    };

    const renderSortLabel = (show: boolean, column: string, label: string) => {
        return (
            // <Tooltip
            //     arrow
            //     title={<div className={'launch-tool-tip'}>{`Sort by ${label}`}</div>}
            //     aria-label={`Sort by ${name}`}
            //     placement={'bottom'}
            // >
            <Div className={'column-label'} onClick={() => onHandleSort(column, index)}>
                {label} &nbsp;
                <Div
                    className={`sort-icon ${show ? 'show' : 'hide'} fa fa-${
                        sortOrder.direction === 'asc' ? 'arrow-up' : 'arrow-down'
                    }`}
                ></Div>
            </Div>
            // </Tooltip>
        );
    };

    // if the hours are the same its now
    // if the hours are less than its normal
    // if the hours are more than its future.

    return (
        <Th className={`${className} x-cls-table-header-cell ${timeStyle} center`}>
            <Div className={'x-head-wrapper'} style={{ justifyContent: 'center' }}>
                {!expand ? (
                    // <Tooltip
                    //     arrow
                    //     title={
                    //         <div className={'launch-tool-tip'}>{`Sort by ${
                    //             showFaultRate ? 'Fault Rate' : 'Fault Count'
                    //         }`}</div>
                    //     }
                    //     aria-label={`Sort by ${showFaultRate ? 'Fault Rate' : 'Fault Count'}`}
                    //     placement={'bottom'}
                    // >
                    <TableSortLabel
                        className={'sort-label'}
                        active={sort && showSortIcon}
                        direction={direction}
                        hideSortIcon={!showSortIcon}
                        onClick={() => onHandleSort(showFaultRate ? 'ratio' : 'faults', index)}
                    >
                        <div className={'x-first'} style={{ fontSize: 14, color: 'white' }}>
                            {headerLabel}
                        </div>
                    </TableSortLabel>
                ) : (
                    // </Tooltip>
                    <div className={'x-first'} style={{ fontSize: 14, color: 'white' }}>
                        {headerLabel}
                    </div>
                )}
            </Div>
            {hour === 12 && <Div className={'x-trans-label pm'}>PM</Div>}
            {hour === 11 && <Div className={'x-trans-label am'}>AM</Div>}
            {expand && (
                <Div className="value-labels stanleyRow" style={{ width: 200 }}>
                    {Columns.map(({ column, label }) =>
                        renderSortLabel(showSortIcon && sortColumn === column, column, label),
                    )}
                </Div>
            )}
        </Th>
    );
}

const Div = styled.div``;
const Th = styled.th``;

export default TableHeader;

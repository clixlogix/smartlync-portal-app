/**
 *
 * TableHead
 *
 */
import React, { Fragment } from 'react';
import styled from 'styled-components/macro';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import { SortOrderDirection } from 'models';

import './CarBodyHeader.scss';

interface CarBodyHeaderProps {
    className?: string;
    columnMeta?: any;
    expand?: boolean;
    sortOrder?: { carbodyId?: SortOrderDirection; studId?: SortOrderDirection };
    sortColumn?: any;
    width?: number;
    filters?: any;
    blank?: boolean;

    handleSortClick?(sortWhat: string);
}

export function CarBodyHeader(props: CarBodyHeaderProps) {
    const {
        className = '',
        columnMeta = { name: '', label: '', description: '' },
        sortOrder = {},
        blank = false,
        handleSortClick = () => {},
    } = props;

    let studidSortIcon, carbodyidSortIcon;
    const { carbodyId, studId } = { carbodyId: SortOrderDirection.NONE, studId: SortOrderDirection.NONE, ...sortOrder };

    switch (studId) {
        case SortOrderDirection.ASC:
            studidSortIcon = <ArrowDownward />;
            break;
        case SortOrderDirection.DESC:
            studidSortIcon = <ArrowUpward />;
            break;
        case SortOrderDirection.NONE:
        default:
            studidSortIcon = <React.Fragment />;
            break;
    }

    switch (carbodyId) {
        case SortOrderDirection.ASC:
            carbodyidSortIcon = <ArrowDownward />;
            break;
        case SortOrderDirection.DESC:
            carbodyidSortIcon = <ArrowUpward />;
            break;
        case SortOrderDirection.NONE:
        default:
            carbodyidSortIcon = <React.Fragment />;
            break;
    }

    const renderIt = () => (
        <Fragment>
            <Div className={'carbodyid-label'}>
                <Div
                    className={`_text-rotate-title  ${carbodyId === SortOrderDirection.NONE ? '' : 'yellow-text'} `}
                    onClick={() => handleSortClick('carbodyId')}
                >
                    {'CarbodyID'}
                </Div>
                {carbodyidSortIcon}
            </Div>
            <Div className={'studid-label'}>
                <Div
                    className={`_text-rotate-title ${studId === SortOrderDirection.NONE ? '' : 'yellow-text'} `}
                    onClick={() => handleSortClick('studId')}
                >
                    {'StudID'}
                </Div>
                {studidSortIcon}
            </Div>
        </Fragment>
    );

    return blank ? (
        <Div key={`${className} table-head-key-${columnMeta.index}`} className={`x-cls-car-body-head`}>
            {renderIt()}
        </Div>
    ) : (
        <Th key={`${className} table-head-key-${columnMeta.index}`} className={`x-cls-car-body-head`}>
            {renderIt()}
        </Th>
    );
}

const Th = styled.th``;
const Div = styled.div``;

export default CarBodyHeader;

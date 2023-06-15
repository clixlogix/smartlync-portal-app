/**
 *
 * TableHead
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { Filters } from 'models';

import './TableHeader.scss';

interface Props {
    className?: string;
    columnMeta?: any;
    sortOrder?: any;
    sortColumn?: any;
    width?: number;
    data?: any;

    onHeaderClick?(filter: Filters);
}

export function TableHeader(props: Props) {
    const { className = '', columnMeta = { name: '', label: '' }, data = {}, width = 33, onHeaderClick } = props;

    const handleClick = () => {
        if (onHeaderClick) {
            onHeaderClick(data);
        }
    };

    return (
        <Th
            key={`table-head-key-${columnMeta.index}-${Math.random()}`}
            style={{ width }}
            className={`${className} x-cls-carbody-table-header-cells ${onHeaderClick ? 'clickable' : ''} ${
                data?.studIdHighlight === columnMeta.label ? 'highlight-studId' : ''
            }`}
            onClick={() => handleClick()}
        >
            <Div key={`key-table-header-cell-${Math.random()}`}>{columnMeta.label}</Div>
        </Th>
    );
}

const Th = styled.th``;
const Div = styled.div``;

export default TableHeader;

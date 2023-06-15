/**
 *
 * TableHead
 *
 */
import React from 'react';
import styled from 'styled-components/macro';

import './TableHeader.scss';

interface Props {
    className?: string;
    columnMeta?: any;
    sortOrder?: any;
    sortColumn?: any;
    width?: number;
}

export function TableHeader(props: Props) {
    const { className = '', columnMeta = { name: '', label: '' }, width = 33 } = props;

    return (
        <Th
            key={`table-head-key-${columnMeta.index}`}
            style={{ width }}
            className={`${className} x-cls-carbody-table-header-cells`}
        >
            <Div>{columnMeta.label}</Div>
        </Th>
    );
}

const Th = styled.th``;
const Div = styled.div``;

export default TableHeader;

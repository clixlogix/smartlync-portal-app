/**
 *
 * TableHeadLabel
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';

import './TableHeadLabel.scss';

interface Props {
    columnMeta?: any;
    className?: string;
}

export function TableHeadLabel(props: Props) {
    const { className = '', columnMeta = { label: '', name: '' } } = props;
    const { name = '' } = columnMeta;

    return (
        <Div className={`${className} x-cls-table-head-label`}>
            <Div>{name}</Div>
        </Div>
    );
}

const Div = styled.div``;

export default TableHeadLabel;

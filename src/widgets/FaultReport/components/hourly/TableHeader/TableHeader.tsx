/**
 *
 * TableHeader
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';

import './TableHeader.scss';

interface Props {
    className?: string;
}

export function TableHeader(props: Props) {
    const { className = '' } = props;
    return <Div className={`${className} x-cls-table-header`}></Div>;
}

const Div = styled.div``;

export default TableHeader;

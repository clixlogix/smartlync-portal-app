/**
 *
 * TableBody
 *
 */
import React from 'react';
import styled from 'styled-components/macro';

import './TableBody.scss';

interface Props {
    className?: string;
    value?: any;
    expand?: boolean;
    tableMeta?: any;
    colGrouping?: any;
    sortColumn?: any;
    filters?: any;

    handleTableCellClick?(data: any);
}

export function TableBody(props: Props) {
    const { className = '', value } = props;

    const { mtbf, mttr } = value;
    const mttrValue = mttr <= 0.0 ? '' : (+mttr).toFixed(4);
    const mtbfValue = mtbf <= 0.0 ? '' : (+mtbf).toFixed(2);
    const backgroundColor = (value) => {
        if (value >= 0 && value <= 25) {
            return `rgb(110, 39, 44)`;
        }
        if (value > 25 && value <= 50) {
            return `rgb(127, 41, 48)`;
        }
        if (value > 50 && value <= 75) {
            return `rgb(175, 66, 74)`;
        }
        if (value > 75 && value <= 100) {
            return `rgb(220, 105, 114)`;
        }
        return '';
    };

    return (
        <Div
            className={`${className} x-ta-table-body-cell ta-table-data`}
            style={{ color: backgroundColor(mtbf), fontWeight: 'bold' }}
        >
            <div className={'ta-flex-row'}>
                <div className={'ta-column-value'}>{mtbfValue}</div>
                <div className={'ta-column-value column-border-left'}>{mttrValue}</div>
            </div>
        </Div>
    );
}
const Div = styled.div``;

export default TableBody;

/**
 *
 * TableBody
 *
 */
import { ThresholdType } from 'pages/SystemOverview/Components/MTBFTable';
import React, { memo } from 'react';
import styled from 'styled-components/macro';

import './TableBody.scss';

interface Props {
    className?: string;
    value?: any;
    expand?: boolean;
    threshold?: ThresholdType;
    tableMeta?: any;
    colGrouping?: any;
    sortColumn?: any;

    onTableRowClick?(data: any);
}

export const TableBody = memo((props: Props) => {
    const { value } = props;

    const valueLabel = value === 0 ? '' : value;
    const backgroundColor = (value) => {
        if (value >= 15 && value <= 24) {
            return 'yellow';
        }
        if (value >= 25 && value <= 49) {
            return 'orange';
        }
        if (value >= 50) {
            return 'red';
        }
        return 'green';
    };

    return (
        <Div className={`x-cls-topFaultCount-table-body-cell data-cell-value past-datas ${backgroundColor(value)}`}>
            {valueLabel}
        </Div>
    );
});

const Div = styled.div``;

export default TableBody;

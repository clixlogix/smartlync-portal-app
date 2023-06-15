/**
 *
 * TableBody
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import OverallRiskHeader from '../TableHeader/OverallRiskHeader';
import { SortOrderDirection } from 'models';

import './CarbodyIDColumnBody.scss';

interface CarbodyIDColumnBodyProps {
    className?: string;
    value?: any;
    expand?: boolean;
    tableMeta?: any;
    colGrouping?: any;
    sortColumn?: any;
    sortOrder?: { [key: string]: SortOrderDirection };
    filters?: any;
    overallRiskHeadPos?: string;

    handleSortClick?(data: any);
}

export function CarbodyIDColumnBody(props: CarbodyIDColumnBodyProps) {
    const {
        className = '',
        value,
        tableMeta,
        handleSortClick = () => {},
        overallRiskHeadPos = 'overallRiskColumn', // or 'overallRiskRow'
        sortOrder = { [props.overallRiskHeadPos || 'overallRiskRow']: SortOrderDirection.NONE },
    } = props;

    return tableMeta.rowIndex === 0 ? (
        <Div
            className={`${className} x-cls-overall-risk-row-body-cell`}
            style={{ display: 'flex', flex: 1, justifyContent: 'center' }}
            onClick={() => handleSortClick(overallRiskHeadPos)}
        >
            <OverallRiskHeader overallRiskHeadPos={overallRiskHeadPos} sortOrder={sortOrder} />
        </Div>
    ) : (
        <Div
            className={`${className} .x-cls-carbodyid-column-body-cell`}
            style={{ display: 'flex', flex: 1, justifyContent: 'center' }}
        >
            {value}
        </Div>
    );
}
const Div = styled.div``;

export default CarbodyIDColumnBody;

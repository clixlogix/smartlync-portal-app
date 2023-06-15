/**
 *
 * TableBody
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import OverallRiskHeader from '../TableHeader/OverallRiskHeader';
import { SortOrderDirection } from 'models';
import { messages } from '../../../messages';

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
    const defaultOverallRiskHeadPos = 'overallRiskColumn'; // or 'overallRiskRow'
    const {
        className = '',
        value,
        tableMeta,
        handleSortClick = () => {},
        overallRiskHeadPos = defaultOverallRiskHeadPos,
        sortOrder = { [props.overallRiskHeadPos || defaultOverallRiskHeadPos]: SortOrderDirection.NONE },
    } = props;

    const { t } = useTranslation();

    return (
        <Div className={`${className} x-cls-carbodyid-column-cell`} onClick={() => handleSortClick(overallRiskHeadPos)}>
            {tableMeta.rowIndex === 0 && (
                <OverallRiskHeader
                    label={t(messages['total'])}
                    className={'overall-risk'}
                    overallRiskHeadPos={overallRiskHeadPos}
                    sortOrder={sortOrder}
                />
            )}
            {tableMeta.rowIndex > 0 && <Div className={'header-value'}>{`${value?.risk || value}`}</Div>}
        </Div>
    );
}
const Div = styled.div``;

export default CarbodyIDColumnBody;

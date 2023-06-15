/**
 *
 * TableHead
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import ArrowDownward from '@mui/icons-material/CompareArrows';
import ArrowUpward from '@mui/icons-material/CompareArrows';
import { SortOrderDirection } from 'models';

import './OverallRiskHeader.scss';

interface OverallRiskHeaderProps {
    className?: string;
    columnMeta?: any;
    expand?: boolean;
    sortOrder?: { [key: string]: SortOrderDirection };
    overallRiskHeadPos?: string;
    sortColumn?: any;
    width?: number;
    filters?: any;
    label?: string;

    handleSortClick?(sortWhat: string);
}

export const AscendingSort = () => (
    <div className={'sort-icon'}>
        <ArrowUpward />
    </div>
);

export const DescendingSort = () => (
    <div className={'sort-icon'}>
        <ArrowDownward />
    </div>
);

export function OverallRiskHeader(props: OverallRiskHeaderProps) {
    const {
        className = '',
        columnMeta = { name: '', label: '', description: '' },
        overallRiskHeadPos = 'overallRiskRow',
        sortOrder = {},
        label = 'Overall Risk',
        handleSortClick = () => {},
    } = props;

    let overallRiskSortIcon;
    const overallRisk =
        overallRiskHeadPos === 'overallRiskColumn' ? sortOrder.overallRiskColumn : sortOrder.overallRiskRow;

    switch (overallRisk) {
        case SortOrderDirection.ASC:
            overallRiskSortIcon = <AscendingSort />;
            break;
        case SortOrderDirection.DESC:
            overallRiskSortIcon = <DescendingSort />;
            break;
        case SortOrderDirection.NONE:
        default:
            overallRiskSortIcon = <Div className={'sort-icon'} />;
            break;
    }

    if (overallRiskHeadPos !== 'overallRiskRow') {
        return (
            <Div key={`${className} table-head-key-${columnMeta.index}`} className={`x-cls-overall-risk-head-inline`}>
                <Div className={`overall-risk-label `}>
                    <Div
                        className={` ${overallRisk === SortOrderDirection.NONE ? '' : 'yellow-text'} `}
                        onClick={() => handleSortClick(overallRiskHeadPos)}
                    >
                        {label}
                    </Div>
                    {overallRiskSortIcon}
                </Div>
            </Div>
        );
    }

    return (
        <Th key={`${className} table-head-key-${columnMeta.index}`} className={`x-cls-overall-risk-head`}>
            <Div
                className={`overall-risk-label ${
                    overallRiskHeadPos !== 'overallRiskRow' ? '' : 'overall-risk-text-rotate-title'
                }`}
            >
                <Div
                    className={` ${overallRisk === SortOrderDirection.NONE ? '' : 'yellow-text'} `}
                    onClick={() => handleSortClick(overallRiskHeadPos)}
                >
                    {label}
                </Div>
                {overallRiskSortIcon}
            </Div>
        </Th>
    );
}

const Th = styled.th``;
const Div = styled.div``;

export default OverallRiskHeader;

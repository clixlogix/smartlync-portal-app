/**
 *
 * TableBody
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { ThresholdType } from 'models';

import './TableBody.scss';

interface Props {
    className?: string;
    value: any;
    expand: boolean;
    threshold: ThresholdType;
    tableMeta: any;

    onShowRecommendedAction(action: boolean);
}

export function TableBody(props: Props) {
    const {
        className = '',
        expand,
        threshold = { ratio: 0.2, faultCode: 50 },
        onShowRecommendedAction = undefined,
    } = props;

    const {
        tableMeta: { columnIndex, rowData = [] },
    } = props;

    const { faultCount = 0, cycleCount = 0, ratio = 0, wipWopRatio = 0 } = rowData[columnIndex] || ({} as any);

    const faultLabel = faultCount === 0 ? '' : faultCount;
    const cycleLabel = cycleCount === 0 ? '' : cycleCount;
    const ratioLabel = faultLabel === '' && cycleLabel === '' ? '' : ratio.toFixed(2);
    const wipWopRatioLabel = wipWopRatio === 0 ? '' : wipWopRatio.toFixed(3);
    const thresholdReached = ratio > (threshold?.ratio || 9999);
    const faultCountThreashold = faultCount > (threshold.faultCount || 9999);

    const onClickThreshold =
        onShowRecommendedAction && thresholdReached ? () => onShowRecommendedAction(true) : () => {};

    if (expand) {
        return (
            <Div
                className={`${className} x-cls-table-body-cell ${thresholdReached ? 'threshold-met' : ''}`}
                onClick={onClickThreshold}
            >
                <Div className={'stanleyRow'}>
                    <Span>{`Fault: ${faultLabel}`}</Span>
                    <Span>{`Cycle: ${cycleLabel}`}</Span>
                </Div>
                <Div className={'stanleyRow'}>
                    <Div className={'stanleyRow'}>
                        <Span>{`FR:`}</Span>
                        <Span className={thresholdReached ? 'red-cell-daily' : undefined}>{`${ratioLabel}`}</Span>
                    </Div>
                    <Span>{`WR:${wipWopRatioLabel}`}</Span>
                </Div>
            </Div>
        );
    }

    return (
        <Div
            className={`${className} center x-cls-table-body-cell ${faultCountThreashold ? 'threshold-met' : ''}`}
            onClick={onClickThreshold}
        >
            {faultLabel}
        </Div>
    );
}

const Div = styled.div``;
const Span = styled.span``;

export default TableBody;

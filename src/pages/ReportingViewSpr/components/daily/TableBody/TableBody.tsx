/**
 *
 * TableBody
 *
 */
import { ThresholdType } from 'models';
import * as React from 'react';
import styled from 'styled-components/macro';

import './TableBody.scss';

interface Props {
    className?: string;
    value: any;
    expand: boolean;
    threshold: ThresholdType;
    showFaultRate: boolean;
    isPercentage: boolean;

    onShowRecommendedAction(action: boolean);
}

export function TableBody(props: Props) {
    const {
        className = '',
        value = {
            eventCount: 0,
            cycleCount: 0,
            ratio: 0,
            ripRopRatio: 0,
            duration: 0,
        },
        expand,
        showFaultRate = true,
        isPercentage = true,
        threshold = { ratio: 0.05, eventCount: 20 },
        onShowRecommendedAction = undefined,
    } = props;

    const { eventCount = 0, cycleCount = 0, ratio = 0, ripRopRatio = 0, duration = 0 } = value;

    const faultLabel = eventCount === 0 ? '' : eventCount;
    const cycleLabel = cycleCount === 0 ? '' : cycleCount;
    const durationLabel = duration === 0 ? '' : duration;

    const LOWER_LIMIT = isPercentage ? 0.01 : 0.01 * 1000000;
    const faultRate = isPercentage ? +ratio : +ratio * 1000000;
    const faultRateThreshold = isPercentage ? threshold?.ratio || 0.05 : (threshold?.ratio || 0.05) * 1000000;

    let ratioLabel =
        faultRate < LOWER_LIMIT && faultRate !== 0
            ? '~'
            : faultRate === 0 || cycleCount === 0 || eventCount === 0
            ? ''
            : faultRate.toFixed(isPercentage ? 2 : 1);

    const ripRopRatioLabel = ripRopRatio === 0 ? '' : ripRopRatio.toFixed(3);
    const thresholdReached = faultRate > faultRateThreshold;
    const faultCountThresholdReached = eventCount > (threshold?.eventCount || 9999);

    const onClickThreshold =
        onShowRecommendedAction && thresholdReached ? () => onShowRecommendedAction(true) : () => {};

    if (expand) {
        return (
            <Div
                className={`${className} x-cls-table-body-cell ${thresholdReached ? 'threshold-met' : ''}`}
                onClick={onClickThreshold}
            >
                <Div className={'stanleyRow'}>
                    <Span>{`Event: ${faultLabel}`}</Span>
                    <Span>{`Cycle: ${cycleLabel}`}</Span>
                </Div>
                <Div className={'stanleyRow'}>
                    <Div className={'stanleyRow'}>
                        <Span>{`Ratio:`}</Span>
                        <Span
                            title={
                                ratioLabel === '~' ? 'Event Ratio < 0.01' : ratioLabel === '--' ? 'Weld count N.A' : ''
                            }
                            className={thresholdReached ? 'red-cell-daily' : undefined}
                        >{`${ratioLabel}`}</Span>
                    </Div>
                    <Span>{`WR:${ripRopRatioLabel}`}</Span>
                </Div>
                <Div className={'stanleyRow'}>
                    <Span>{`Duration: ${durationLabel}`}</Span>
                </Div>
            </Div>
        );
    }
    if (!showFaultRate) {
        return (
            <Div
                className={`${className} center x-cls-table-body-cell ${
                    faultCountThresholdReached ? 'threshold-met' : ''
                }`}
                onClick={onClickThreshold}
            >
                {faultLabel}
            </Div>
        );
    }
    return (
        <Div
            className={`${className} center x-cls-table-body-cell ${thresholdReached ? 'threshold-met' : ''}`}
            onClick={onClickThreshold}
            title={ratioLabel === '~' ? 'Event Ratio < 0.01' : ratioLabel === '--' ? 'Weld count N.A' : ''}
        >
            {ratioLabel === '--' ? '--' : ratioLabel}
        </Div>
    );
}

const Div = styled.div``;
const Span = styled.span``;

export default TableBody;

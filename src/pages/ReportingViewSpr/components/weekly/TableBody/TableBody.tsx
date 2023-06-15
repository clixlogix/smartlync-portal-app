/**
 *
 * TableBody
 *
 */
import { ThresholdType } from 'models';
import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';

import './TableBody.scss';

interface Props {
    className?: string;
    value: any;
    expand: boolean;
    threshold: ThresholdType;
    tableMeta: any;
    colGrouping: any;
    showFaultRate: boolean;
    isPercentage: boolean;

    onShowRecommendedAction(action: boolean);
    onTableRowClick(data: any);
    setOccurredOn(timeVal: any);
}

export function TableBody(props: Props) {
    const {
        className = '',
        value = {
            eventCount: 0,
            cycleCount: 0,
            ratio: 0,
            ripRopRatio: 0,
            ropCount: 0,
            duration: 0,
        },
        expand,
        tableMeta,
        threshold = { ratio: 0.05, eventCount: 50 },
        showFaultRate = true,
        isPercentage = true,
        onShowRecommendedAction = undefined,
        onTableRowClick,
        setOccurredOn,
        colGrouping,
    } = props;

    const { eventCount = 0, cycleCount = 0, ratio = 0, ropCount = 0, duration = 0 } = value;
    const faultLabel = eventCount === 0 ? '' : eventCount;
    const cycleLabel = cycleCount === 0 ? '' : cycleCount;
    const ropLabel = ropCount === 0 ? '' : ropCount;
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

    ratioLabel = eventCount && !cycleCount ? '--' : ratioLabel;

    const thresholdReached = eventCount > (threshold?.eventCount || 9999);
    const faultRateThresholdReached = faultRate > faultRateThreshold;
    // const [colGrouping /* setColGrouping */] = useState<string[]>(['studType', 'deviceName']);

    const onClickThreshold = () => {
        if (onShowRecommendedAction) {
            onShowRecommendedAction(true);
        }
        onTableRowClick(
            tableMeta.rowData.slice(0, colGrouping.length).reduce((acc, item, index) => {
                acc[colGrouping[index]] = item;
                return acc;
            }, {}),
        );
        setOccurredOn(
            moment()
                .isoWeekYear(tableMeta.columnData.label)
                .isoWeek(parseInt(tableMeta.columnData.name))
                .startOf('isoWeek')
                .format('YYYY-MM-DD'),
        );
    };

    if (expand) {
        return (
            <div className={`${className} stanleyRow`} onClick={() => onClickThreshold()}>
                <div className="expanded-data-cell right-border-weekly">
                    <div className={`${thresholdReached ? 'red-cell-daily' : ''} `}>{faultLabel}</div>
                </div>
                <div className="expanded-data-cell right-border-weekly">
                    <div>{cycleLabel}</div>
                </div>
                <div className="expanded-data-cell right-border-weekly">
                    <div
                        title={ratioLabel === '~' ? 'Event Ratio < 0.01' : ratioLabel === '--' ? 'Weld count N.A' : ''}
                        className={`${faultRateThresholdReached && cycleCount ? 'red-cell-daily' : ''} `}
                    >
                        {ratioLabel}
                    </div>
                </div>
                <div className="expanded-data-cell right-border-weekly">
                    <div>{ropLabel}</div>
                </div>
                <div className="expanded-data-cell ">
                    <div>{durationLabel}</div>
                </div>
            </div>
        );
    }

    if (!showFaultRate) {
        return (
            <Div
                className={`${className} x-cls-table-body-cell ${thresholdReached ? 'red-cell-daily' : ''}`}
                onClick={onClickThreshold}
            >
                {faultLabel}
            </Div>
        );
    }
    return (
        <Div
            className={`${className} x-cls-table-body-cell ${
                faultRateThresholdReached && cycleCount ? 'red-cell-daily' : ''
            }`}
            onClick={onClickThreshold}
            title={ratioLabel === '~' ? 'Event Ratio < 0.01' : ratioLabel === '--' ? 'Weld count N.A' : ''}
        >
            {ratioLabel === '--' ? '--' : ratioLabel}
        </Div>
    );
}

const Div = styled.div``;

export default TableBody;

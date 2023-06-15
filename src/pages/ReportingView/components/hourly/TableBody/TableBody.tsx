/**
 *
 * TableHead
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { ThresholdType } from 'models';
import moment from 'moment';

import './TableBody.scss';

interface TableBodyProps {
    className?: string;
    value: any;
    expand: boolean;
    threshold: ThresholdType;
    tableMeta: any;
    colGrouping: any;
    columnMeta?: any;
    showFaultRate?: boolean;
    isPercentage?: boolean;

    onShowRecommendedAction(action: boolean);
    onTableRowClick(data: any);
    setOccurredOn(timeVal: any);
}

export function TableBody(props: TableBodyProps) {
    const {
        className = '',
        value = {
            eventCount: 0,
            cycleCount: 0,
            ratio: 0,
            wipWopRatio: 0,
            wopCount: 0,
            duration: 0,
        },
        expand,
        tableMeta,
        threshold = { ratio: 0.05, eventCount: 3 },
        showFaultRate = true,
        isPercentage = true,
        onShowRecommendedAction = undefined,
        onTableRowClick,
        setOccurredOn,
        colGrouping,
    } = props;
    const { eventCount = 0, cycleCount = 0, ratio = 0, wopCount = 0, duration = 0 } = value;
    const eventLabel = eventCount === 0 ? '' : eventCount;
    const cycleLabel = cycleCount === 0 ? '' : cycleCount;
    const wopLabel = wopCount === 0 ? '' : wopCount;
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

    // const curDate = '2021-04-19 21:59:59';
    // const time = moment(props.value?.time);

    // const currentTime = Math.floor(moment(curDate).unix() / 3600);
    // const cmpTime = Math.floor(moment(time).unix() / 3600);

    // let timeStyle = 'normal';
    // if (cmpTime === currentTime) {
    //     timeStyle = 'present';
    // }
    // if (cmpTime > currentTime) {
    //     timeStyle = 'future';
    // }

    const thresholdReached = eventCount > (threshold?.eventCount || 9999);
    const faultRateThresholdReached = faultRate > faultRateThreshold;

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

    // if the hours are the same its now
    // if the hours are less than its normal
    // if the hours are more than its future.

    if (expand) {
        return (
            <div className={`${className} stanleyRow`} onClick={() => onClickThreshold()}>
                <div className="expanded-data-cell right-border-weekly">
                    <div className={`${thresholdReached ? 'red-cell-daily' : ''} `}>{eventLabel}</div>
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
                    <div>{wopLabel}</div>
                </div>
                <div className="expanded-data-cell ">
                    <div>{durationLabel}</div>
                </div>
            </div>
        );
    }

    if (!showFaultRate) {
        return (
            <Div className={'x-first'} style={{ fontSize: 14, color: 'white' }}>
                {eventLabel}
            </Div>
        );
    }

    return (
        <Div
            title={ratioLabel === '~' ? 'Event Ratio < 0.01' : ratioLabel === '--' ? 'Weld count N.A' : ''}
            className={'x-first'}
            style={{ fontSize: 14, color: 'white' }}
        >
            {ratioLabel === '--' ? '--' : ratioLabel}
        </Div>
    );
}

const Div = styled.div``;

export default TableBody;

/**
 *
 * TableBody
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';
import { ThresholdType } from 'models';

import './TableBody.scss';

interface Props {
    className?: string;
    value: any;
    expand: boolean;
    threshold: ThresholdType;
    tableMeta: any;
    colGrouping: any;

    onShowRecommendedAction(action: boolean);
    onTableRowClick(data: any);
    setOccurredOn(timeVal: any);
}

export function TableBody(props: Props) {
    const {
        className = '',
        value = {
            faultCount: 0,
            cycleCount: 0,
            ratio: 0,
            wipWopRatio: 0,
        },
        expand,
        tableMeta,
        threshold = { faultCount: 0.2 },
        onShowRecommendedAction = undefined,
        onTableRowClick,
        setOccurredOn,
        colGrouping,
    } = props;

    const { faultCount = 0, cycleCount = 0, ratio = 0 } = value;
    const faultLabel = faultCount === 0 ? '' : faultCount;
    const cycleLabel = cycleCount === 0 ? '' : cycleCount;
    const ratioLabel = Number(ratio) < 0.01 ? '' : Number(ratio).toFixed(2);
    const thresholdReached = faultCount > (threshold?.faultCount || 9999);
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
                <div className="expanded-data-cell">
                    <div>{ratioLabel}</div>
                </div>
            </div>
        );
    }

    return (
        <Div
            className={`${className} x-cls-table-body-cell ${thresholdReached ? 'red-cell-daily' : ''}`}
            onClick={onClickThreshold}
        >
            {faultLabel}
        </Div>
    );
}

const Div = styled.div``;

export default TableBody;

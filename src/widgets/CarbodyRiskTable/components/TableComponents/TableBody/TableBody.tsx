/**
 *
 * TableBody
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import TextureIcon from '@mui/icons-material/Texture';
import { OverallRiskItem, RiskItem } from '../..';

import './TableBody.scss';

interface Props {
    className?: string;
    value?: any;
    expand?: boolean;
    tableMeta?: any;
    colGrouping?: any;
    sortColumn?: any;
    filters?: any;
    carbodyHighlight?: any;
    studIdHighlight?: any;

    handleTableCellClick?(data: any);
}

export function TableBody(props: Props) {
    const {
        className = '',
        value,
        tableMeta,
        carbodyHighlight = {},
        studIdHighlight = {},
        handleTableCellClick = () => {},
    } = props;
    const { columnData = {}, rowIndex = 0, columnIndex = 0 } = tableMeta;
    const { name = '' } = columnData;
    const { risk, ...filter } = value || ({} as any);

    const onHandleClick = (tMeta: any) => {
        if (handleTableCellClick) {
            handleTableCellClick(filter);
        }
    };

    return (
        <Div
            className={`${className} x-cls-risk-table-body-cell ${
                carbodyHighlight === tableMeta?.rowData[0] ? 'highlight-studId' : ''
            }  ${studIdHighlight === columnData?.label ? 'highlight-studId-col' : ''}`}
        >
            {columnIndex === 1 && rowIndex === 0 && (
                <Div className={`clear-cell`}>
                    <TextureIcon />
                </Div>
            )}
            {((rowIndex === 0 && columnIndex !== 1) || (name === 'total' && rowIndex !== 0)) && (
                <OverallRiskItem className={'x-overall-risk-item'} value={value} />
            )}
            {columnIndex > 1 && rowIndex > 0 && risk > 0 && (
                <RiskItem className={'x-risk-item'} value={value} onClick={() => onHandleClick(tableMeta)} />
            )}
        </Div>
    );
}
const Div = styled.div``;

export default TableBody;

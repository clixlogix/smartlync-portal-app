/**
 *
 * TableBody
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import TextureIcon from '@mui/icons-material/Texture';

import './TableBody.scss';
import { OverallRiskItem, RiskItem } from '../..';

interface Props {
    className?: string;
    value?: any;
    expand?: boolean;
    tableMeta?: any;
    colGrouping?: any;
    sortColumn?: any;
    filters?: any;

    handleTableCellClick?(data: any);
}

export function TableBody(props: Props) {
    const { className = '', value, tableMeta, handleTableCellClick = () => {} } = props;
    const { columnData } = tableMeta;

    const onHandleClick = (tMeta: any) => {
        const filterCell = { carBody: `${tMeta.rowData[0]}`, studId: `${columnData.name}` };
        if (handleTableCellClick) {
            handleTableCellClick(filterCell);
        }
    };

    return (
        <Div className={`${className} x-cls-table-body-cell`}>
            {tableMeta.columnIndex === 1 && tableMeta.rowIndex === 0 && (
                <Div className={`clear-cell`}>
                    <TextureIcon />
                </Div>
            )}
            {(tableMeta.columnIndex === 1 || tableMeta.rowIndex === 0) && (
                <OverallRiskItem className={'x-overall-risk-item'} value={value} />
            )}
            {tableMeta.columnIndex > 1 && tableMeta.rowIndex > 1 && (
                <RiskItem className={'x-risk-item'} value={value} onClick={() => onHandleClick(tableMeta)} />
            )}
        </Div>
    );
}
const Div = styled.div``;

export default TableBody;

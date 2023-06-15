/**
 *
 * TableBody
 *
 */
import React from 'react';
import styled from 'styled-components/macro';

import './TableBody.scss';

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
    const { className = '', value, tableMeta /*, handleTableCellClick = () => {} */ } = props;
    const { columnData, rowData } = tableMeta;
    const carBodyHL = rowData[0] === parseInt(columnData.carBody) ? 'highLightFilter' : '';
    const studIdHL = columnData.name === parseInt(columnData.studId) ? 'highLightFilter' : '';

    const { mtbf } = value;
    const backgroundColor = (value) => {
        if (value <= 1) {
            return `rgb(110, 39, 44)`;
        }
        if (value > 1 && value <= 1000) {
            return `rgb(175, 66, 74)`;
        }
        if (value > 1000) {
            return `rgb(220, 105, 114)`;
        }
        return '';
    };

    return (
        <Div
            className={`${className} x-carBody-table-body-cell cb-table-data ${carBodyHL} ${studIdHL}`}
            style={{ color: backgroundColor(mtbf), fontWeight: 'bold' }}
        >
            {mtbf === 0 ? '' : mtbf}
        </Div>
    );
}
const Div = styled.div``;

export default TableBody;

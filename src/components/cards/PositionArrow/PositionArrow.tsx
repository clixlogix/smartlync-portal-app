/**
 *
 * PositionArrow
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';

import 'scss/main.scss';
import './PositionArrow.scss';

interface PositionArrowProps {
    className?: string;
    value?: string;
}

export const PositionArrow: React.FunctionComponent<PositionArrowProps> = memo((props: PositionArrowProps) => {
    const { className = '', value = ' ' } = props;

    let position = ''; //'fa-minus no-change';
    if (value === '0' || value === '') {
        position = 'fa-minus no-change';
    }
    if (value[0] === '+') {
        position = 'fa-arrow-up change-up';
    }

    if (value[0] === '-') {
        position = 'fa-arrow-down change-down';
    }

    if (value === 'New') {
        position = 'fa-plus plant-icon new';
    }

    return (
        <Div className={`${className} x-cls-position-arrow`}>
            <Italics className={`fa plant-icon ${position}`}></Italics>
            {value}
        </Div>
    );
});

const Div = styled.div``;
const Italics = styled.i``;

export default PositionArrow;

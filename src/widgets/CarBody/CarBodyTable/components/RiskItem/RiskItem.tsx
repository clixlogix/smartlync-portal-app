/**
 *
 * RiskItem
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';

import 'scss/main.scss';
import './RiskItem.scss';

interface RiskItemProps {
    className?: string;
    value?: number;
    children?: React.ReactNode | React.ReactNode[];

    onClick();
}

export const RiskItem = memo((props: RiskItemProps) => {
    const { className = '', value = 0, onClick = () => {} } = props;

    let bg = '';

    if (value > 0) {
        bg = 'blue';
    }

    if (value > 4) {
        bg = 'yellow';
    }

    if (value > 8) {
        bg = 'red';
    }

    return (
        <Div className={`${className} x-cls-risk-item`} onClick={() => onClick()}>
            {value > 0 && <Div className={`risk-item ${bg}`} />}
        </Div>
    );
});

const Div = styled.div``;

export default RiskItem;

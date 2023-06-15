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
    value?: any;
    children?: React.ReactNode | React.ReactNode[];

    onClick();
}

export const RiskItem = memo((props: RiskItemProps) => {
    const { className = '', value = { risk: 0 }, onClick = () => {} } = props;
    const { risk } = value;

    const bg = ['', 'blue', 'yellow', 'red'][risk];

    return (
        <Div className={`${className} x-cls-risk-item`} onClick={() => onClick()}>
            {risk > 0 && <Div className={`risk-item ${bg}`} />}
        </Div>
    );
});

const Div = styled.div``;

export default RiskItem;

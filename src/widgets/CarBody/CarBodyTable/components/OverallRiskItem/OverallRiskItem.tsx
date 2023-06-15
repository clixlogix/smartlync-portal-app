/**
 *
 * OverallRiskItem
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';

import 'scss/main.scss';
import './OverallRiskItem.scss';

interface OverallRiskItemProps {
    className?: string;
    value?: number;
    children?: React.ReactNode | React.ReactNode[];
}

export function OverallRiskItem(props: OverallRiskItemProps) {
    const { className = '', value = 0, children } = props;

    return (
        <Div className={`${className} x-cls-overall-risk-item`}>
            {value > 0 && <Div className={`${value === 1 ? 'green-dot' : 'red-dot'}`} />}
            {children}
        </Div>
    );
}

const Div = styled.div``;

export default OverallRiskItem;

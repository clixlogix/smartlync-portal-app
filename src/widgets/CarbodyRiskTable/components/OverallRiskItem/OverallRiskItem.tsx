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
    value?: any;
    children?: React.ReactNode | React.ReactNode[];
}

export function OverallRiskItem(props: OverallRiskItemProps) {
    const { className = '', value = { risk: 0 }, children } = props;

    const risk = value?.risk || value;

    return (
        <Div className={`${className} x-cls-overall-risk-item`}>
            {risk > 0 && <Div className={`${risk === 1 ? 'green-dot' : 'red-dot'}`} />}
            {children}
        </Div>
    );
}

const Div = styled.div``;

export default OverallRiskItem;

/**
 *
 * WeekNumber
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';

import 'scss/main.scss';
import './WeekNumber.scss';

interface WeekNumberProps {
    fromWeek?: number;
    currentWeek?: number;
    className?: string;
    children?: React.ReactNode | React.ReactNode[];
}

export const WeekNumber = memo((props: WeekNumberProps) => {
    const { t } = useTranslation();
    const { className = '', fromWeek = '', currentWeek = '', children } = props;

    return (
        <Div className={`${className} x-cls-week-number`}>
            <Div>
                {t('Filters.WeekLabel')} w{fromWeek} - w{currentWeek}
            </Div>
            {children}
        </Div>
    );
});

const Div = styled.div``;

export default WeekNumber;

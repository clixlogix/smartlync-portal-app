/**
 *
 * ReportingViewChart
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
// import { messages } from './messages';

import './ReportingViewChart.scss';

interface Props {
    className?: string;
}

export const ReportingViewChart = memo((props: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t, i18n } = useTranslation();
    const { className = '' } = props;
    return (
        <Div className={`${className} x-cls-reporting-view-chart`}>
            {t('')}
            {/*  {t(...messages.someThing)}  */}
        </Div>
    );
});

const Div = styled.div``;

export default ReportingViewChart;

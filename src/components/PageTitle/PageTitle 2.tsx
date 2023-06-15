/**
 *
 * PageTitle
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';

import 'scss/main.scss';
import './PageTitle.scss';

interface Props {
    className?: string;
    label: string;
}

export const PageTitle = memo((props: Props) => {
    const { className = '', label = '' } = props;
    return <Div className={`${className} x-cls-page-main-title`}>{label}</Div>;
});

const Div = styled.div``;

export default PageTitle;

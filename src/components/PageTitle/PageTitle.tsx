/**
 *
 * PageTitle
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
// import { messages } from './messages';

import 'scss/main.scss';
import './PageTitle.scss';

interface Props {
    className?: string;
    label: string;
}

export const PageTitle = memo((props: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t /*, i18n*/ } = useTranslation();
    const { className = '', label = '' } = props;
    return <Div className={`${className} x-cls-page-main-title`}>{label}</Div>;
});

const Div = styled.div``;

export default PageTitle;

/**
 *
 * ReadLabelValue
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import 'scss/main.scss';
import { messages } from './messages';
import './ReadLabelValue.scss';

interface Props {
    className?: string;
    label?: string;
    value?: string;
    description?: string;
    checkIfAll?: any;
}

export const ReadLabelValue = memo((props: Props) => {
    const { className = '', label = '', value = '', description = '', checkIfAll } = props;
    const { t } = useTranslation();
    return (
        <Div className={`${className} x-cls-read-label-value`}>
            <Div className={'value'}>
                <span>{label} </span>
                <Tooltip title={value} arrow>
                    {!checkIfAll ? (
                        <span className="read-only-value">
                            {' '}
                            {value} {description}
                        </span>
                    ) : (
                        <span>: {t(messages.allSelected)}</span>
                    )}
                </Tooltip>
            </Div>
        </Div>
    );
});

const Div = styled.div``;

export default ReadLabelValue;

import React, { useState } from 'react';
import moment from 'moment';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { OperationSchema } from './Settings';
import 'scss/main.scss';
import './Settings.scss';
import { messages } from './messages';
import { ConfirmPopUp } from './ConfirmPopUp';

interface OperationProps {
    operation: OperationSchema;
    handleClick: (id: string | undefined) => void;
}

export const Operation: React.FC<OperationProps> = ({
    operation: { id, operationName, startDate, endDate },
    handleClick,
}) => {
    const { t } = useTranslation();
    const [confirmPopUp, setConfirmPopUp] = useState(false);
    return (
        <>
            <Div className="operation-table-info">
                <span className="info">{operationName}</span>
                <span className="info">{(startDate && moment(startDate).format('HH:mm')) || ''}</span>
                <span className="info">{(endDate && moment(endDate).format('HH:mm')) || ''}</span>
                <span className="info">{(startDate && moment(startDate).format('DD.MM.YYYY')) || ''}</span>
                <span className="info">{(endDate && moment(endDate).format('DD.MM.YYYY')) || ''}</span>
                <span className="info buttons-wrapper">
                    <span className="edit-button" onClick={() => handleClick(id)}>
                        {t(messages.edit)}
                    </span>
                    &nbsp;
                    <span className="delete-button" onClick={() => setConfirmPopUp(true)}>
                        {t(messages.delete)}
                    </span>
                </span>
            </Div>
            {confirmPopUp && <ConfirmPopUp id={id} setConfirmPopUp={setConfirmPopUp} />}
        </>
    );
};

const Div = styled.div``;

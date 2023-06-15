import React from 'react';
import { useDispatch } from 'react-redux';
import { settingsActions } from 'services/settings/settings-reducer';

export const ConfirmPopUp = ({ id, setConfirmPopUp }) => {
    const dispatch = useDispatch();
    return (
        <div className="pop-up">
            <div>
                <span>Are you sure?</span>
            </div>
            <div className="pop-up-buttons">
                <button onClick={() => dispatch(settingsActions.deleteOperation(id))}>yes</button>
                <button onClick={() => setConfirmPopUp(false)}>no</button>
            </div>
        </div>
    );
};

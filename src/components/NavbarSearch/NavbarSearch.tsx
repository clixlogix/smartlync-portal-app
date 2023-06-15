/**
 *
 * NavbarSearch
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';

import './NavbarSearch.scss';

interface Props {
    className?: string;
    placeholder?: string;

    onChange?(value);
    onFocus?();
    onBlur?();
}

export const NavbarSearch = memo((props: Props) => {
    const { t } = useTranslation();
    const { className = '', placeholder = t(messages.placeholder), onChange, onFocus, onBlur } = props;

    const handleOnChange = (value) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <Div className={`${className} navSearch`}>
            <Div className="custom-search-bar">
                <Div className={'input-wrapper'}>
                    <input
                        className={'input'}
                        type="text"
                        placeholder={placeholder}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={(e) => handleOnChange(e.target.value)}
                    />
                </Div>
                <Div className={'search-icon-wrapper'}>
                    <i className="fa fa-search" />
                </Div>
            </Div>
        </Div>
    );
});

const Div = styled.div``;

export default NavbarSearch;

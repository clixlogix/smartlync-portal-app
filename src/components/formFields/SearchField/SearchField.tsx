/**
 *
 * SearchField
 *
 */
import React, { memo, useMemo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import throttle from 'lodash.throttle';

// import { messages } from './messages';

import 'scss/main.scss';
import './SearchField.scss';

interface Props {
    className?: string;
    options?: any[];
    throttleTime?: number;
    label?: string;

    onChange?(value: string);
}

export const SearchField = memo((props: Props) => {
    const { t } = useTranslation();
    const {
        className = '',
        label = t('Components.Search.Placeholder'),
        options = [],
        throttleTime = 300,
        onChange,
    } = props;

    const id = `search-field-${Math.random()}`;

    const throttledEventHandler = useMemo(() => {
        const onSearchChange = (value) => {
            if (onChange) {
                onChange(value);
            }
        };
        return throttle(onSearchChange, throttleTime);
    }, [onChange, throttleTime]);

    return (
        <Div className={`${className} x-cls-search-field`}>
            <Autocomplete
                freeSolo
                id={id}
                disableClearable
                options={options.map((option) => option.label || option)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        margin="normal"
                        variant="outlined"
                        InputProps={{ ...params.InputProps, type: 'search' }}
                    />
                )}
                onInputChange={(event, value) => throttledEventHandler(value)}
            />
        </Div>
    );
});

const Div = styled.div``;

export default SearchField;

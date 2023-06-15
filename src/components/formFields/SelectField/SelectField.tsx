/**
 *
 * SelectField
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TextField from '@mui/material/TextField';

import { SelectFieldLabelPos } from 'components/formFields';

import './SelectField.scss';

interface SelectFieldProps {
    id?: string;
    className?: string;
    style?: any;
    options?: any[];
    defaultValue?: any;
    label?: string;
    labelPos?: SelectFieldLabelPos;
    disabled?: boolean;
    popupIcon?: React.ReactNode;
    disableClearable?: boolean;
    inputStyle?: any;
    inputCls?: string;
    inputProps?: any;
    placeholder?: string;
    multiple?: boolean;
    isFaultCode?: boolean;
    languageControl?: any;
    renderInput?: any;
    value?: any;
    onChange?(value);
    getOptionLabel?(option);
    getOptionSelected?(selected);
}

export const SelectField = memo((props: SelectFieldProps) => {
    const {
        id = `key-${Math.random()}`,
        onChange,
        inputCls,
        getOptionLabel,
        getOptionSelected,
        languageControl,
        className = '',
        renderInput,
        label = '',
        labelPos = SelectFieldLabelPos.INLINE,
        options = [],
        disabled = false,
        value,
        disableClearable,
        placeholder = '',
        multiple = false,
        isFaultCode = false,
        ...rest
    } = props;

    const handleChange = (e, value) => {
        if (onChange) {
            onChange(value?.id ? value.id : value);
        }
    };

    const calcProps: any = {
        id,
        disabled,
        disableClearable,
        value,
        getOptionLabel: getOptionLabel ? getOptionLabel : (option) => option,
        renderInput: renderInput
            ? renderInput
            : (params) => (
                  <Div className={`select-field ${className} `} ref={params.InputProps.ref}>
                      {label && (
                          <Label htmlFor={id} id={`label-for-${id}`} {...params.InputLabelProps}>
                              {label}
                          </Label>
                      )}

                      <TextField
                          className={'select-input'}
                          type="text"
                          placeholder={value?.length > 0 ? '' : placeholder}
                          {...params}
                      />
                  </Div>
              ),
        ...rest,
    };

    let extraOptions: any = {
        getOptionSelected: (option, value) => true,
    };

    if (multiple) {
        const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
        const checkedIcon = <CheckBoxIcon fontSize="small" />;

        extraOptions = {
            ...extraOptions,
            multiple,
            // options: [],

            disableCloseOnSelect: true,
            // filterSelectedOptions: true,
            getOptionLabel: (option) => option.title || option.name || option,
            renderOption: (option, { selected }) => (
                <React.Fragment>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        style={{ marginRight: 8, color: 'yellow' }}
                        checked={selected}
                    />
                    {option.title || option}
                </React.Fragment>
            ),
            renderTags: (value: string[], getTagProps) => (
                <span style={{ color: 'yellow', width: '64%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {value.join(', ')}
                </span>
            ),
        };
    }
    if (isFaultCode) {
        extraOptions = {
            ...extraOptions,
            renderOption: (option, { selected }) => {
                const index = option.indexOf(' '); // Gets the first index where a space occours
                const code = option.substr(0, index); // Gets the first part
                const description = option.substr(index + 1); // Gets the second part
                return (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ color: '#ffdb38', fontWeight: 'bold' }}>
                            {code}: <span style={{ color: 'white', fontWeight: 'normal' }}>{description}</span>
                        </div>
                    </div>
                );
            },
        };
    }
    extraOptions = { ...extraOptions, ...rest };

    return (
        <Div className={`select-field ${className} ${labelPos.toString()}`}>
            <Autocomplete
                className={`${className}-auto-complete select-field-auto-complete`}
                options={options}
                {...extraOptions}
                disableClearable={disableClearable}
                onChange={handleChange}
                {...calcProps}
                defaultValue={value}
            />
        </Div>
    );
});

const Div = styled.div``;
const Label = styled.label``;

export default SelectField;

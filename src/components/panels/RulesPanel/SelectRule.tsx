import React from 'react';
import SelectField from 'components/formFields/SelectFieldNew';
import { Rule } from './RulesPanel';

export interface SelectRuleProps {
    name: string;
    className: string;
    inputVariant: string;
    options: string[];
    onChange: (value: Rule) => void;
    value: string | null;
}

export const SelectRule = ({
    name = '',
    className = '',
    inputVariant = '',
    options = [],
    onChange = () => {},
    value = null,
}: SelectRuleProps) => {
    const onHandleOnChange = (value) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <SelectField
            id={name}
            className={`select-field-neww ${className}`}
            inputVariant={inputVariant}
            options={options}
            onChange={(value) => onHandleOnChange({ [name]: value })}
            value={value}
        />
    );
};

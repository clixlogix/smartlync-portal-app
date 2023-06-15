/**
 *
 * SelectStudIdFilter
 *
 */
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectField } from 'components/formFields/SelectFieldNew';
import { Filters } from 'models';
import { SelectFilterProps } from 'components/filters';

import { messages } from './messages';

import 'scss/main.scss';
import './SelectStudIdFilter.scss';

interface SelectStudIdFilterProps extends SelectFilterProps {
    studIdDefault: string;
}

export const SelectStudIdFilterNew = memo((props: SelectStudIdFilterProps) => {
    const { t } = useTranslation();
    const {
        className = '',
        studIdDefault = '',
        onChange,
        label = t(messages.studIdLabel),
        placeholder = t(messages.studIdPlaceholder),
        ...rest
    } = props;
    const { studId } = props.filters as any;

    const onHandleOnChange = (value: Filters) => {
        if (onChange) {
            onChange(value);
        }
    };

    let value = studId || studIdDefault;

    if (studId && !(typeof studId === 'string') && 'studId' in studId) {
        value = studId['studId'];
    }

    return (
        <SelectField
            className={`${className} x-cls-select-dstud-id-filter `}
            label={label}
            options={[]}
            value={value}
            disableClearable={!value}
            onChange={(value) => onHandleOnChange({ studId: value })}
            placeholder={placeholder}
            {...rest}
        />
    );
});

export default SelectStudIdFilterNew;

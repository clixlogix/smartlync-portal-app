/**
 *
 * SelectFilter
 *
 */
import React, { memo, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectField } from 'components/formFields/SelectFieldNew';
import MultiSelect from 'components/formFields/MultiSelect/MultiSelectNew';
import { SelectFilterProps } from 'components/filters';
import { Filters } from 'models';
import { messages } from './messages';

import 'scss/main.scss';
import './SelectFilter.scss';

export const SelectFilter = memo((props: SelectFilterProps) => {
    const { t } = useTranslation();
    const {
        name,
        onChange,
        options = [],
        label = t(messages.selectFilterLabel),
        placeholder = t(messages.selectFilterPlaceholder),
        multiple = false,
        filters = { [name]: undefined },
        languageControl = [],
        ...rest
    } = props;
    let value = filters[name];
    // if (!multiple) {
    //     value = filters[name];
    // }
    // if (multiple && filters[name]) {
    //     value = filters[name].split(',');
    // }

    const [activeOption, setActiveOption] = useState(-1);

    const onHandleOnChange = (value: Filters) => {
        if (onChange) {
            onChange(value);
        }
    };

    useEffect(() => {
        if (languageControl?.length > 0 && languageControl.includes(name)) {
            const findedIndex = options?.indexOf(value);
            setActiveOption(findedIndex);
        }
    }, [value, languageControl, name, options]);

    const selectedValue = useMemo(() => {
        return value && value !== '' ? value.split(',') : [];
    }, [value]);

    if (!multiple) {
        return (
            <SelectField
                key={`select-filter-${Math.random()}`}
                // className={`${className} x-cls-select-filter `}
                label={label}
                options={options}
                value={languageControl?.length > 0 ? options[activeOption] : value}
                disableClearable={!value}
                onChange={(value) => onHandleOnChange({ [name]: value })}
                placeholder={placeholder}
                multiple={multiple}
                {...rest}
            />
        );
    }

    return (
        <MultiSelect
            key={`select-filter-${name}`}
            label={label || 'N.A'}
            selectedValue={selectedValue}
            items={options}
            onChange={(value) => onHandleOnChange({ [name]: value })}
            placeholder={placeholder}
            selectAllLabel="Select All"
            limitTags={1}
            {...rest}
        />
    );
});

export default SelectFilter;

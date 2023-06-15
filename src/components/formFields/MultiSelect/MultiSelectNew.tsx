/**
 *
 * MultiSelect
 *
 */
import React, { memo, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { createFilterOptions } from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import startCase from 'lodash/startCase';

interface MultiSelectProps {
    items: any[];
    label: string;
    placeholder?: string;
    selectAllLabel?: string;
    noOptionsText?: string;
    limitTags?: number;
    selectedValue?: any[];
    isStartcase?: boolean;
    onChange?(value);
}

export const MultiSelect = memo((props: MultiSelectProps) => {
    const {
        items = [],
        label,
        placeholder,
        selectAllLabel,
        noOptionsText,
        selectedValue = [],
        limitTags = 1,
        isStartcase = false,
        onChange,
        ...rest
    } = props;

    const [selectedOptions, setSelectedOptions] = useState<any[]>(selectedValue || []);
    const allSelected = items.length === selectedOptions.length;
    const handleToggleOption = (selectedOptions) => setSelectedOptions(selectedOptions);

    useEffect(() => {
        setSelectedOptions(selectedValue);
    }, [selectedValue]);

    const handleClearOptions = () => {
        setSelectedOptions([]);
        onChange && onChange('');
    };
    const getOptionLabel = (option) => (isStartcase ? startCase(`${option}`) : `${option}`);
    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setSelectedOptions(items);
        } else {
            handleClearOptions();
        }
    };

    const handleToggleSelectAll = () => {
        handleSelectAll && handleSelectAll(!allSelected);
    };

    const handleChange = (event, selectedOptions, reason) => {
        if (reason === 'selectOption' || reason === 'removeOption') {
            if (selectedOptions.find((option) => option === selectAllLabel)) {
                handleToggleSelectAll();
                let result: any = [];
                result = items.filter((el) => el !== selectAllLabel);
                return onChange && onChange(result.join(','));
            } else {
                handleToggleOption && handleToggleOption(selectedOptions);
                return onChange && onChange(selectedOptions.join(','));
            }
        } else if (reason === 'clear') {
            handleClearOptions && handleClearOptions();
        }
    };
    const optionRenderer = (props, option, { selected }) => {
        const selectAllProps =
            items.length > 0 && option === selectAllLabel // To control the state of 'select-all' checkbox
                ? { checked: allSelected }
                : {};
        return (
            <li {...props}>
                <Checkbox
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    {...selectAllProps}
                />
                {getOptionLabel(option)}
            </li>
        );
    };
    const inputRenderer = (params) => <TextField {...params} label={label} variant="outlined" />;

    const filter = createFilterOptions();
    return (
        <Autocomplete
            multiple
            fullWidth
            limitTags={limitTags}
            options={items}
            value={selectedOptions}
            disableCloseOnSelect
            getOptionLabel={getOptionLabel}
            // getOptionSelected={(option, value) => option.value === value.value}
            noOptionsText={noOptionsText}
            // @ts-ignore
            filterOptions={(options, params) => {
                if (items.length > 0) {
                    const filtered = filter(options, params);
                    return [selectAllLabel, ...filtered];
                } else if (items.length === 0) {
                    const filtered = filter(options, params);
                    return [...filtered];
                }
            }}
            onChange={handleChange}
            renderOption={optionRenderer}
            renderInput={inputRenderer}
            {...rest}
        />
    );
});

export default MultiSelect;

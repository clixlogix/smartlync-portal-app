/**
 *
 * SelectField
 *
 */
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Box, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { SelectFieldLabelPos } from 'components/formFields';
import React, { memo } from 'react';
import { useTheme } from '@mui/material/styles';

interface SelectFieldProps {
    id?: string;
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
    inputVariant?: string;
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
        renderInput,
        label = '',
        labelPos = SelectFieldLabelPos.INLINE,
        options = [],
        disabled = false,
        value,
        disableClearable,
        multiple = false,
        isFaultCode = false,
        inputVariant = 'outlined',
        ...rest
    } = props;

    const handleChange = (e, value) => {
        if (onChange) {
            onChange(value?.id ? value.id : value);
        }
    };
    const { palette } = useTheme();
    const { mode } = palette;

    const calcProps: any = {
        id,
        disabled,
        disableClearable,
        value,
        getOptionLabel: getOptionLabel ? getOptionLabel : (option) => option,
        renderInput: renderInput
            ? renderInput
            : (params) => <TextField type="text" variant={inputVariant} {...params} label={label} />,
        ...rest,
    };

    let extraOptions: any = {
        getOptionSelected: (option, value) => true, // empty(value) || value === '' || option === value,
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
                        onChange={handleChange}
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
            renderOption: (props, option, { selected }) => {
                const index = option.indexOf(' '); // Gets the first index where a space occours
                const code = option.substr(0, index); // Gets the first part
                const description = option.substr(index + 1); // Gets the second part
                return (
                    <li {...props}>
                        <Box
                            sx={{
                                fontWeight: 'bold',
                                width: 'fit-content',
                                padding: '10px',
                            }}
                        >
                            <Typography
                                display="inline"
                                sx={{
                                    width: 'fit-content',
                                    fontWeight: 'bold',
                                    //@ts-ignore
                                    color: mode === 'light' ? palette?.primary?.light : palette?.primary?.dark,
                                }}
                            >
                                {code}
                            </Typography>{' '}
                            :{' '}
                            <Typography
                                display="inline"
                                sx={{ fontSize: '14px', width: 'fit-content', fontWeight: 'normal' }}
                            >
                                {description}
                            </Typography>
                        </Box>
                    </li>
                );
            },
        };
    }
    extraOptions = { ...rest, ...extraOptions };

    return (
        <Box sx={{ width: '100%' }}>
            <Autocomplete
                disablePortal
                options={options}
                {...extraOptions}
                onChange={handleChange}
                disableClearable={disableClearable}
                {...calcProps}
                defaultValue={value}
            />
        </Box>
    );
});

export default SelectField;

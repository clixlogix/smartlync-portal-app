/**
 *
 * SelectDeviceNameFilter
 *
 */
import React, { memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    deviceNamesActions,
    deviceNamesReducer,
    deviceNamesKey,
} from 'services/device/device-name/device-name-reducer';
import { deviceNamesSaga } from 'services/device/device-name/device-name-saga';
import { selectDeviceNames } from 'services/device/device-name/device-name-selectors';
import MultiSelect from 'components/formFields/MultiSelect/MultiSelectNew';
import { Filters, DeviceNames } from 'models';
import { SelectFilterProps } from 'components/filters';
import { FilterNames } from 'models';
import { messages } from './messages';
import { SelectField } from 'components/formFields/SelectFieldNew';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';

import 'scss/main.scss';
import './SelectDeviceNameFilter.scss';

interface SelectDeviceNameFilterProps extends SelectFilterProps {
    deviceNameDefault?: string;
    options?: string[];
    multiple?: boolean;
    disableClearable?: boolean;
}

export const SelectDeviceNameFilterNew = memo((props: SelectDeviceNameFilterProps) => {
    const { t } = useTranslation();

    const {
        deviceNameDefault = '',
        onChange,
        options = [],
        label = t(messages.deviceNameLabel) || '',
        placeholder = t(messages.deviceNamePlaceholder),
        multiple = true,
        disableClearable = false,
        ...rest
    } = props;
    const { deviceName } = props.filters as any;
    useInjectReducer({ key: deviceNamesKey, reducer: deviceNamesReducer });
    useInjectSaga({ key: deviceNamesKey, saga: deviceNamesSaga });

    const dispatch = useDispatch();

    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    const deviceNames: DeviceNames = useSelector(selectDeviceNames);
    const finalOptions = options.length > 0 ? options : deviceNames;

    useEffect(() => {
        dispatch(deviceNamesActions.deviceNames(breadCrumbsDataType));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breadCrumbsDataType]);

    const onHandleOnChange = (value: Filters | any | undefined) => {
        if (onChange) {
            onChange(value);
        }
    };

    let value = deviceName || deviceNameDefault;

    if (deviceName && !(typeof deviceName === 'string') && 'deviceName' in deviceName) {
        value = deviceName['deviceName'];
    }

    const selectedValue = useMemo(() => {
        return value && value !== '' ? value.split(',') : [];
    }, [value]);

    if (!multiple) {
        return (
            <SelectField
                key={`select-filter-${Math.random()}`}
                label={label}
                options={finalOptions}
                value={value}
                disableClearable={!value || disableClearable}
                onChange={(value) => onHandleOnChange({ [FilterNames.deviceName]: value })}
                placeholder={placeholder}
                multiple={multiple}
                {...rest}
            />
        );
    }

    return (
        <MultiSelect
            label={label}
            selectedValue={selectedValue}
            onChange={(value) => onHandleOnChange({ [FilterNames.deviceName]: value })}
            items={finalOptions}
            placeholder={placeholder}
            selectAllLabel="Select All"
            limitTags={1}
            {...rest}
        />
    );
});

export default SelectDeviceNameFilterNew;

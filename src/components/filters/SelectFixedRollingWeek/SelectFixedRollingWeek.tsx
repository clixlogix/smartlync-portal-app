/**
 *
 * SelectFilter
 *
 */
import React, { memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectField } from 'components/formFields/SelectFieldNew';
import MultiSelect from 'components/formFields/MultiSelect/MultiSelectNew';
import { SelectFilterProps } from 'components/filters';
import { Filters } from 'models';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer } from 'utils/redux-injectors';
import { fixedRangeActions, fixedRangeReducer, fixedRangeKey } from 'services/fixed-range/fixed-range-reducer';
import { selectFixedRanges } from 'services/fixed-range/fixed-range-selectors';
import { messages } from './messages';
import moment from 'moment';

import 'scss/main.scss';
import './SelectFixedRollingWeek.scss';

export const SelectFixedRollingWeek = memo((props: SelectFilterProps) => {
    const { t } = useTranslation();
    const {
        className = '',
        name,
        onChange,
        options = [],
        data,
        label = t(messages.selectFilterLabel),
        placeholder = t(messages.selectFilterPlaceholder),
        multiple = false,
        filters = { [name]: undefined },
        ...rest
    } = props;
    let value = filters[name];

    useInjectReducer({ key: fixedRangeKey, reducer: fixedRangeReducer });
    const dispatch = useDispatch();
    const newOptions: any = useSelector(selectFixedRanges);

    const onHandleOnChange = (value: Filters) => {
        if (onChange) {
            onChange(value);
        }
    };

    const { dateNow, sinceTime, weekRangeNumber, dateFormat } = data;

    const createOptions = (config) => {
        const newOptions = {};
        const {
            sinceTime = 6,
            weekRangeNumber = 9,
            dateFormat = 'MM/DD/YYYY([W]WW)',
            isRangeFormat = true,
            dateNow,
        } = config;
        let firstWeek = moment(dateNow).clone().subtract(sinceTime, 'months').startOf('isoWeek');
        const endWeek = moment(dateNow).clone().startOf('isoWeek');
        const initialWeek = firstWeek.startOf('isoWeek').format('YYYYWW');
        do {
            const fromWeek = firstWeek.startOf('isoWeek').format('YYYYWW');
            const fromDate = moment(fromWeek, 'YYYYWW').clone().startOf('isoWeek').format(dateFormat);
            const toDate = moment(fromDate, dateFormat)
                .clone()
                .add(weekRangeNumber - 1, 'weeks')
                .endOf('isoWeek')
                .format(dateFormat);
            newOptions[fromWeek] = isRangeFormat ? `${fromDate} - ${toDate}` : `${toDate}`;
            firstWeek.add(1, 'weeks').startOf('isoWeek');
        } while (firstWeek.isSameOrBefore(endWeek));
        return { initialWeek, newOptions };
    };

    useEffect(() => {
        const inner = async () => {
            const { initialWeek, newOptions } = createOptions({ dateNow, sinceTime, weekRangeNumber, dateFormat });
            await dispatch(fixedRangeActions.setAllFixedRanges(newOptions));
            await dispatch(fixedRangeActions.setInitialFixedRange(initialWeek));
        };
        inner();
    }, [dispatch]);

    const selectedValue = useMemo(() => {
        return value && value !== '' ? value.split(',') : [];
    }, [value]);

    if (!multiple) {
        return (
            <SelectField
                key={`select-filter-${Math.random()}`}
                className={`${className} x-cls-select-filter `}
                label={label}
                options={Object.values(newOptions)}
                value={value}
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
            label={label || ''}
            selectedValue={selectedValue}
            items={Object.values(newOptions)}
            onChange={(value) => onHandleOnChange({ [name]: value })}
            placeholder={placeholder}
            selectAllLabel="Select All"
            limitTags={1}
            {...rest}
        />
    );
});

export default SelectFixedRollingWeek;

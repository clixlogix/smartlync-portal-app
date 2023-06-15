/**
 *
 * SelectlineFilter
 *
 */
import React, { memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { linesActions, linesReducer, linesKey } from 'services/line/line-reducer';
import { linesSaga } from 'services/line/line-saga';
import { selectLines } from 'services/line/line-selectors';
import MultiSelect from 'components/formFields/MultiSelect/MultiSelectNew';
import { FilterNames, Filters, Lines } from 'models';
import { SelectFilterProps } from 'components/filters';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';

import { messages } from './messages';

import 'scss/main.scss';
import './SelectLineFilter.scss';

interface SelectLineFilterProps extends SelectFilterProps {
    lineDefault: string;
    options?: string[];
    multiple?: boolean;
    disableClearable?: boolean;
}

export const SelectLineFilterNew = memo((props: SelectLineFilterProps) => {
    const { t } = useTranslation();
    const {
        className = '',
        lineDefault = '',
        onChange,
        label = t(messages.lineLabel) || '',
        placeholder = t(messages.linePlaceholder),
        name,
        options = [],
        ...rest
    } = props;
    const subLine = (props.filters as any)[FilterNames.deviceLine];

    useInjectReducer({ key: linesKey, reducer: linesReducer });
    useInjectSaga({ key: linesKey, saga: linesSaga });

    const dispatch = useDispatch();

    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const lines: Lines = useSelector(selectLines);
    const finalOptions = options.length > 0 ? options : lines;

    useEffect(() => {
        dispatch(linesActions.lines(breadCrumbsDataType));
    }, [dispatch, breadCrumbsDataType]);

    const onHandleOnChange = (value: Filters | any | undefined) => {
        if (onChange) {
            onChange(value);
        }
    };

    let value = subLine || lineDefault;

    if (subLine && !(typeof subLine === 'string') && 'subLine' in subLine) {
        value = subLine['subLine'];
    }

    const selectedValue = useMemo(() => {
        return value && value !== '' ? value.split(',') : [];
    }, [value]);

    return (
        <MultiSelect
            label={label}
            selectedValue={selectedValue}
            items={finalOptions}
            onChange={(value) => onHandleOnChange({ [FilterNames.deviceLine]: value })}
            placeholder={placeholder}
            selectAllLabel="Select All"
            limitTags={1}
            {...rest}
        />
    );
});

export default SelectLineFilterNew;

/**
 *
 * SelectStudTypeFilter
 *
 */
import React, { memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { studTypesActions, studTypesReducer, studTypesKey } from 'services/stud/stud-type/stud-type-reducer';
import { studTypesSaga } from 'services/stud/stud-type/stud-type-saga';
import { selectStudTypes } from 'services/stud/stud-type/stud-type-selectors';
import { FilterNames } from 'models';
import MultiSelect from 'components/formFields/MultiSelect/MultiSelectNew';
import { Filters, StudTypes } from 'models';
import { SelectFilterProps } from 'components/filters';
import { messages } from './messages';

interface SelectStudTypeFilterProps extends SelectFilterProps {
    studTypeDefault: string;
    options?: string[];
}

export const SelectStudTypeFilterNew = memo((props: SelectStudTypeFilterProps) => {
    const { t } = useTranslation();

    const {
        studTypeDefault = '',
        onChange,
        options = [],
        label = t(messages.studTypeLabel) || '',
        placeholder = t(messages.studTypePlaceholder),
        ...rest
    } = props;
    const { studType } = props.filters as any;

    useInjectReducer({ key: studTypesKey, reducer: studTypesReducer });
    useInjectSaga({ key: studTypesKey, saga: studTypesSaga });

    const dispatch = useDispatch();

    const studTypes: StudTypes = useSelector(selectStudTypes);
    const finalOptions = options.length > 0 ? options : studTypes;

    useEffect(() => {
        dispatch(studTypesActions.studTypes({}));
    }, [dispatch]);

    const onHandleOnChange = (value: Filters | any | undefined) => {
        if (onChange) {
            onChange(value);
        }
    };

    let value = studType || studTypeDefault;

    if (studType && !(typeof studType === 'string') && 'studType' in studType) {
        value = studType['studType'];
    }

    const selectedValue = useMemo(() => {
        return value && value !== '' ? value.split(',') : [];
    }, [value]);

    return (
        <MultiSelect
            label={label}
            selectedValue={selectedValue}
            items={finalOptions}
            onChange={(value) => onHandleOnChange({ [FilterNames.studType]: value })}
            placeholder={placeholder}
            selectAllLabel="Select All"
            limitTags={1}
            {...rest}
        />
    );
});

export default SelectStudTypeFilterNew;

/**
 *
 * SelectAggregateColumn
 *
 */
import React, { memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import {
    selectAggregateColumnActions,
    selectAggregateColumnReducer,
    selectAggregateColumnKey,
} from 'services/select-aggregate-column/select-aggregate-column-reducer';
import { getAllSelectAggregateColumnsSaga } from 'services/select-aggregate-column/sagas/select-aggregate-column-saga-get-all';

import { selectSelectAggregateColumns } from 'services/select-aggregate-column/select-aggregate-column-selectors';
import MultiSelect from 'components/formFields/MultiSelect/MultiSelectNew';
import { Filters } from 'models';
import { SelectFilterProps } from 'components/filters';
import { FilterNames } from 'models';
import { messages } from './messages';

import 'scss/main.scss';
import './SelectAggregateColumn.scss';

interface Props extends SelectFilterProps {
    className?: string;
    children?: React.ReactNode | React.ReactNode[];
    columnDefault?: any;
}

export const SelectAggregateColumn = memo((props: Props) => {
    const { t } = useTranslation();

    useInjectReducer({ key: selectAggregateColumnKey, reducer: selectAggregateColumnReducer });
    useInjectSaga({ key: selectAggregateColumnKey, saga: getAllSelectAggregateColumnsSaga });
    // const {} = props.filters as any;
    const columnSelected = (props.filters as any)[FilterNames.aggregateColumn];
    const dispatch = useDispatch();

    const aggregateColumns: any = useSelector(selectSelectAggregateColumns);
    const dropDownOptions = aggregateColumns.map((item) => item.value);

    const { onChange, options = [], columnDefault = dropDownOptions[0] || '', placeholder = '', ...rest } = props;

    useEffect(() => {
        dispatch(selectAggregateColumnActions.getAllSelectAggregateColumns(props.filters));
    }, [dispatch, props.filters]);

    const onHandleOnChange = (value: Filters | any | undefined) => {
        const selectedValue = value === undefined || value === '' ? dropDownOptions[0] : value;
        if (onChange) {
            onChange(selectedValue);
        }
    };

    useEffect(() => {
        onHandleOnChange({ aggregateColumn: dropDownOptions[0] });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dropDownOptions[0]]);

    let value = columnSelected || columnDefault;

    if (columnSelected && !(typeof columnSelected === 'string') && 'columnSelected' in columnSelected) {
        value = columnSelected['columnSelected'];
    }

    const selectedValue = useMemo(() => {
        return value && value !== '' ? value.split(',') : [];
    }, [value]);

    return (
        <MultiSelect
            label={t(messages.AggregateColumn) || ''}
            selectedValue={selectedValue}
            items={dropDownOptions}
            onChange={(value) => onHandleOnChange({ [FilterNames.aggregateColumn]: value })}
            placeholder={placeholder}
            selectAllLabel="Select All"
            limitTags={1}
            {...rest}
        />
    );
});

export default SelectAggregateColumn;

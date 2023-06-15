/**
 *
 * SelectFaultCodeFilter
 *
 */
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { faultCodesActions, faultCodesReducer, faultCodesKey } from 'services/fault/fault-code/fault-code-reducer';
import { faultCodesSaga } from 'services/fault/fault-code/fault-code-saga';
import { selectFaultCodes } from 'services/fault/fault-code/fault-code-selectors';
import { SelectField } from 'components/formFields/SelectFieldNew';
import { Filters, FaultCodes, FilterNames } from 'models';
import { SelectFilterProps } from 'components/filters';
import { messages } from './messages';
import 'scss/main.scss';
import './SelectFaultCodeFilter.scss';
import { useQueryParam } from 'utils';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';

interface SelectFaultCodeFilterProps extends SelectFilterProps {
    faultCodeDefault: string;
    eventTypeDefault: string;
    options?: string[];
}

export const SelectFaultCodeFilterNew = memo((props: SelectFaultCodeFilterProps) => {
    const { t } = useTranslation();

    const [faultCodeFromUrl] = useQueryParam<string>('faultCode', '');

    const {
        className = '',
        faultCodeDefault = faultCodeFromUrl ? faultCodeFromUrl : '',
        onChange,
        label = t(messages.faultCodeLabel),
        placeholder = t(messages.faultCodePlaceholder),
        options = [],
        ...rest
    } = props;
    const eventsWithDefaultCode = [
        t('Filters.Fault'),
        t('Filters.Warning'),
        t('Filters.Componentexchange'),
        t('Filters.FirmwareUpdate'),
        t('Filters.Info'),
        t('Filters.Maintenance'),
    ];
    const { faultCode, eventCode, eventType = 0, systemType = 'SWS' } = props.filters as any;

    useInjectReducer({ key: faultCodesKey, reducer: faultCodesReducer });
    useInjectSaga({ key: faultCodesKey, saga: faultCodesSaga });

    const dispatch = useDispatch();

    const [eventCodeValue, setEventCodeValue] = useState(eventCode || faultCodeDefault);

    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    const faultCodes: FaultCodes = useSelector(selectFaultCodes);
    const finalOptions = options.length > 0 ? options : faultCodes;
    const eventTypes = [];
    let value = eventCode || faultCodeDefault;

    if (eventType && eventsWithDefaultCode.includes(eventType)) {
        value = faultCodeDefault;
    } else {
        value = finalOptions;
    }

    if (faultCode && !(typeof faultCode === 'string')) {
        value = faultCode['faultCode'];
    }

    const eventTypeArr = eventsWithDefaultCode.length > 0 ? eventsWithDefaultCode : eventTypes.map(({ name }) => name);

    const eventTypeValue = eventType && eventTypeArr.indexOf(eventType) >= 0 ? eventTypeArr.indexOf(eventType) : 0;

    useEffect(() => {
        dispatch(faultCodesActions.faultCodes({ eventType: eventTypeValue, systemType, ...breadCrumbsDataType }));
    }, [dispatch, eventType, eventTypeValue, systemType, breadCrumbsDataType]);

    let descriptionFaultcode: string[] = [];
    if (faultCodes) {
        faultCodes.forEach((item) => {
            const faultCode = item.eventNumber ? item.eventNumber : item;
            const descp = item.description ? item.description : '';
            descriptionFaultcode.push(`${faultCode} ${descp}`);
        });
    }

    if (descriptionFaultcode.length > 0) {
        descriptionFaultcode.forEach((data) => {
            const fc = data.split(' ', 1)[0];
            if (value === fc) {
                value = data;
            }
        });
    }

    const onHandleOnChange = (value: Filters) => {
        if (onChange) {
            onChange(value);
        }
        setEventCodeValue(value[FilterNames.eventCode]);
    };

    return (
        <SelectField
            id="FilterByFaultCode"
            className={`${className} x-cls-select-fault-code-filter `}
            isFaultCode={true}
            label={label}
            options={descriptionFaultcode}
            value={eventCodeValue}
            onChange={(value) => onHandleOnChange({ [FilterNames.eventCode]: value ? value.split(' ', 1)[0] : '' })}
            placeholder={placeholder}
            {...rest}
        />
    );
});

export default SelectFaultCodeFilterNew;

/**
 *
 * SelectEventTypeFilter
 *
 */
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Filters } from 'models';
import { SelectFilterProps } from 'components/filters';
import { SelectField } from 'components/formFields/SelectFieldNew';
import { messages } from './messages';

interface SelectEventTypeFilterProps extends SelectFilterProps {
    eventTypeDefault: string;
    options?: string[];
}

export const SelectEventTypeFilterNew = memo((props: SelectEventTypeFilterProps) => {
    const { t } = useTranslation();
    const {
        eventTypeDefault = '',
        onChange,
        options = [],
        label = t(messages.eventTypeLabel),
        placeholder = t(messages.eventTypePlaceholder),
        ...rest
    } = props;
    const { eventType } = props.filters as any;
    const eventTypes = [];
    const finalOptions = options.length > 0 ? options : eventTypes.map(({ name }) => name);
    let value = eventType || eventTypeDefault;
    const eventTypeToCodeMapping = {
        [t('Filters.Fault')]: 0,
        [t('Filters.Warning')]: 1,
        [t('Filters.Componentexchange')]: 2,
        [t('Filters.FirmwareUpdate')]: 3,
        [t('Filters.Info')]: 4,
        [t('Filters.Maintenance')]: 5,
    };
    const onHandleOnChange = (filter: Filters) => {
        const { eventType } = filter;
        const eventTypeCode = eventTypeToCodeMapping[eventType];
        if (onChange) {
            onChange({ ...filter, eventTypeCode });
        }
    };

    if (eventType && !(typeof eventType === 'string') && 'eventType' in eventType) {
        value = eventType['eventType'];
    }

    const parms: any = {
        label,
        options: finalOptions,
        disableClearable: true, //!value,
        onChange: (value) => onHandleOnChange({ eventType: value }),
        placeholder,
        ...rest,
    };
    if (value && value !== 'null') {
        parms['value'] = value;
    }

    return <SelectField {...parms} />;
});

export default SelectEventTypeFilterNew;

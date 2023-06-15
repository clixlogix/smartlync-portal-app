/**
 *
 * SelectStationFilter
 *
 */
import React, { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { stationsActions, stationsReducer, stationsKey } from 'services/station/station-reducer';
import { stationsSaga } from 'services/station/station-saga';
import { selectStations } from 'services/station/station-selectors';
import { SelectField } from 'components/formFields/SelectFieldNew';
import { Filters, Stations } from 'models';
import { SelectFilterProps } from 'components/filters';
import { FilterNames } from 'models';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';

import { messages } from './messages';

import 'scss/main.scss';
import './SelectStationFilter.scss';

interface SelectStationFilterProps extends SelectFilterProps {
    defaultValue: string;
}

export const SelectStationFilterNew = memo((props: SelectStationFilterProps) => {
    const { t } = useTranslation();
    const {
        className = '',
        defaultValue = '',
        onChange,
        options = [],
        label = t(messages.stationLabel),
        placeholder = t(messages.stationPlaceholder),
        ...rest
    } = props;
    const { stationName } = props.filters as any;

    useInjectReducer({ key: stationsKey, reducer: stationsReducer });
    useInjectSaga({ key: stationsKey, saga: stationsSaga });

    const dispatch = useDispatch();

    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    const stations: Stations = useSelector(selectStations);
    const finalOptions = options.length > 0 ? options : stations;

    useEffect(() => {
        dispatch(stationsActions.stations(breadCrumbsDataType));
    }, [dispatch, breadCrumbsDataType]);

    const onHandleOnChange = (value: Filters) => {
        if (onChange) {
            onChange(value);
        }
    };

    let value = stationName || defaultValue;

    if (stationName && !(typeof stationName === 'string') && 'stationName' in stationName) {
        value = stationName['stationName'];
    }

    return (
        <SelectField
            className={`${className} x-cls-select-station-filter `}
            label={label}
            options={finalOptions}
            value={value}
            disableClearable={!value}
            onChange={(value) => {
                onHandleOnChange({ [FilterNames.stationName]: value });
            }}
            placeholder={placeholder}
            {...rest}
        />
    );
});

export default SelectStationFilterNew;

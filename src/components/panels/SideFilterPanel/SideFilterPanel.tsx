/**
 *
 * SideFilterPanel
 *
 */
import Button from '@mui/material/Button';
import { MenuOption } from 'components';
import { SelectField } from 'components/formFields/SelectFieldNew/SelectField';
import { FilterNames, Filters, SidePanelOpenState } from 'models';
import { Moment } from 'moment';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import './SideFilterPanel.scss';

interface SideFilterPanelProps {
    filters?: Filters;
    availableFilters?: DashboardFilter[];
    defaultFilters?: any[];
    open?: SidePanelOpenState;
    className?: string;
    children?: React.ReactNode | React.ReactNode[];

    onFilterChange(filter: Filters);
}

export enum FilterType {
    'Boolean' = 'Boolean',
    'Date' = 'Date',
    'Empty' = 'Empty',
    'Input' = 'Input',
    'MinMaxNumberRange' = 'MinMaxNumberRange',
    'Number' = 'Number',
    'NumberRange' = 'NumberRange',
    'Select' = 'Select',
    'MultiSelect' = 'MultiSelect',
}

export interface NoFilterData {
    icon?: string;
    iconSize?: string;
    options?: Array<MenuOption | string>;
}

export interface InputFilterData extends NoFilterData {
    value: string;
}

export interface DateFilterData extends NoFilterData {
    fromTime: Moment;
    toTime: Moment;
    startDatePlaceholder?: string;
    endDatePlaceholder?: string;
    validation?: boolean;
    nos?: number;
    period?: string;
    startText?: string;
    endText?: string;
    inputFormat?: string;
}

export interface SelectFilterData extends NoFilterData {
    options: Array<string>;
    selected?: any;
}

export interface NumberRangeFilterData extends NoFilterData {
    value: number;
}

export interface MultiSelectFilterData extends SelectFilterData {
    selected?: any | any[];
    multiple?: boolean;
}

export interface MenuFilterData extends NoFilterData {
    options: Array<MenuOption | string>;
    selected?: string | MenuOption;
}

export type DashboardFilterData =
    | NoFilterData
    | DateFilterData
    | InputFilterData
    | SelectFilterData
    | MultiSelectFilterData
    | NumberRangeFilterData
    | MenuFilterData;

export interface DashboardFilter {
    type: FilterType;
    name: FilterNames | string;
    label?: string;
    placeholder?: string;
    hidden?: boolean;
    defaultValue?: string;
    multiple?: boolean;
    data: DashboardFilterData;
    isFixedRange?: boolean;
    isStartcase?: boolean;
    fixedRangeValue?: moment.DurationInputArg1;
    fixedRangePeriod?: moment.DurationInputArg2;
    disableClearable?: boolean;
}

export class DashboardFilters extends Map<FilterNames, DashboardFilter> { }

export const SideFilterPanel = memo((props: SideFilterPanelProps) => {
    const {
        filters = [],
        availableFilters = [],
        className = '',
        open = SidePanelOpenState.Close,
        children,

        onFilterChange,
    } = props;
    const [openState, setOpenState] = useState<SidePanelOpenState>(open);
    const [displayFilters] = useState(availableFilters);
    const [hover, setHover] = useState<boolean>(false);
    const { t } = useTranslation();

    const thumbTackClicked = () => {
        setOpenState(openState === SidePanelOpenState.Open ? SidePanelOpenState.Close : SidePanelOpenState.Open);
    };

    const onHandleOnChange = (name: string, value: any) => {
        if (onFilterChange) {
            onFilterChange({ [name]: value });
        }
    };

    const renderFilter = (filter) => {
        switch (filter.type) {
            case FilterType.Date:
                return (
                    <SelectField
                        id={`${filter.name}`}
                        options={filter.data.options}
                        value={filters[filter.name]}
                        onChange={(value) => onHandleOnChange(filter.name, value)}
                        placeholder={filter.label}
                    />
                );
            case FilterType.Select:
            default:
                return (
                    <SelectField
                        id={`${filter.name}`}
                        options={filter.data.options}
                        value={filters[filter.name]}
                        onChange={(value) => onHandleOnChange(filter.name, value)}
                        placeholder={filter.label}
                    />
                );
        }
    };

    return (
        <Div
            className={`${className} x-cls-side-filter-panel  ${openState}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className={`menu ${openState} ${hover ? 'hover' : ''}`}>
                <div className="title">
                    <span className={'menu-btn fa fas fa-bars'} />
                    <span>&nbsp;{t('General.Filters')} &nbsp;</span>
                    <span className={'menu-btn fa fas fa-bars'} />
                    <Button onClick={thumbTackClicked}>
                        <i
                            aria-hidden="false"
                            className={`pin fa fa-2x fas fa-${openState === SidePanelOpenState.Open ? 'window-close-o' : 'thumb-tack'
                                }`}
                        ></i>
                    </Button>
                </div>
                <ul className="filter-items">
                    {displayFilters.map((filter) => (
                        <li className="filter-item">
                            <span>{filter.label}</span>
                            {renderFilter(filter)}
                        </li>
                    ))}
                </ul>
            </div>
            {children}
        </Div>
    );
});

const Div = styled.div``;

export default SideFilterPanel;

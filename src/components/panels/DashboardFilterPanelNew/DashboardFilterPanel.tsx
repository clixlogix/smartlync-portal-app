/**
 *
 * DashboardFilterPanel
 *
 */
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import {
    MuiDateRangePicker,
    ReportThresholdFilterLoader as ReportThresholdFilter,
    ThresholdFilterView,
} from 'components/filters';
import { DateFilter } from 'components/filters/DateFilter/DateFilter';
import MuiDateTime from 'components/filters/MuiDateTime';
import SelectDeviceNameFilterNew from 'components/filters/SelectDeviceNameFilterNew';
import SelectEventTypeFilterNew from 'components/filters/SelectEventTypeFilterNew';
import SelectFaultCodeFilterNew from 'components/filters/SelectFaultCodeFilterNew';
import SelectFilter from 'components/filters/SelectFilterNew';
import SelectFixedRollingWeek from 'components/filters/SelectFixedRollingWeek';
import SelectLineFilterNew from 'components/filters/SelectLineFilterNew';
import SelectStationFilterNew from 'components/filters/SelectStationFilterNew';
import SelectStationOnlyFilterNew from 'components/filters/SelectStationOnlyFilterNew';
import SelectStudIdFilterNew from 'components/filters/SelectStudIdFilterNew';
import SelectStudTypeFilterNew from 'components/filters/SelectStudTypeFilterNew';
import SelectAggregateColumn from 'components/filters/SelectAggregateColumn';
import { SelectFieldLabelPos } from 'components/formFields';
import { DashboardFilter, FilterType } from 'components/panels/SideFilterPanel/SideFilterPanel';
import RestoreIcon from '@mui/icons-material/Restore';
import Chip from '@mui/material/Chip';
import { FilterNames, Filters } from 'models';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDisplayFilters } from 'utils/hooks/useDisplayFilters';
import { messages } from './messages';
import moment from 'moment';
import { DATE_TIME_FORMAT } from 'constants/index';
import Weekpicker from 'components/WeekPicker/WeekPicker';
import FixedRangePicker from 'components/FixedRangePicker/FixedRangePicker';
import { setCommonPageFlters } from 'utils/localStorage/index';

interface DashboardFilterPanelProps {
    filters?: Filters;
    availableFilters?: DashboardFilter[];
    defaultFilters?: any;
    open?: boolean | undefined;
    hover?: boolean;
    disabled?: boolean;
    children?: React.ReactNode | React.ReactNode[];
    languageControl?: string[];
    setOpen?: () => void;

    onFilterChange(filter: Filters);
    filterValues?(); // values to apply to availableFilters
}

export const DashboardFilterPanel = memo((props: DashboardFilterPanelProps) => {
    const { t } = useTranslation();
    const {
        filters = {},
        availableFilters = [],
        defaultFilters = {},
        open = true,
        languageControl,
        onFilterChange,
        filterValues, // function that returns the values to be applied to the availableFilters
        setOpen,
    } = props;

    const { fromTime: fromTimeFilters, toTime: toTimeFilters } = filters;

    const { fromTime: fromDefaultTimeFilters, toTime: toDefaultTimeFilters } = defaultFilters;
    const showReset =
        (fromTimeFilters &&
            fromDefaultTimeFilters &&
            moment.isMoment(fromTimeFilters) &&
            moment.isMoment(fromDefaultTimeFilters) &&
            fromTimeFilters?.format(DATE_TIME_FORMAT) !== fromDefaultTimeFilters?.format(DATE_TIME_FORMAT)) ||
        (toTimeFilters &&
            toDefaultTimeFilters &&
            moment.isMoment(toTimeFilters) &&
            moment.isMoment(toDefaultTimeFilters) &&
            toTimeFilters?.format(DATE_TIME_FORMAT) !== toDefaultTimeFilters?.format(DATE_TIME_FORMAT));

    let values;
    if (filterValues) {
        values = filterValues();
    }

    const displayFilters = useDisplayFilters(availableFilters, values);

    const onHandleOnChange = (filter: Filters) => {
        if (onFilterChange) {
            // persist page default date
            if (filter.toTime) {
                setCommonPageFlters({ [FilterNames.toTime]: filter.toTime });
            }
            onFilterChange(filter);
        }
    };
    const resetToDefault = (filter: Filters) => {
        if (onFilterChange) {
            onFilterChange(filter);
        }
    };

    const renderFilter = (filterProps) => {
        if (!filterProps.name) {
            return React.Fragment;
        }

        let options: any = {
            id: `${filterProps.name}`,
            filters,
            defaultFilters,
            data: filterProps.data,
            onChange: onHandleOnChange,
            label: filterProps.label,
            name: filterProps.name,
            placeholder: filterProps.placeholder,
            labelPos: SelectFieldLabelPos.TOPLEFT,
            isNineWeekView: true,
            isStartEndWeekAutoSelect: false,
            ...filterProps,
            //
        };

        if (languageControl?.includes(options.name)) {
            options.languageControl = [...languageControl];
        }

        switch (filterProps.type) {
            case FilterType.NumberRange:
                options.step = 5;
                options.dynamicOn = filterProps?.data?.dynamicOn;
                if (filterProps.name === FilterNames.reportThreshold) {
                    return <ReportThresholdFilter {...options} viewType={ThresholdFilterView.Full} />;
                }
                options.label = t(filterProps.label);
                return <ReportThresholdFilter {...options} />;
            case FilterType.Input:
                return <TextField fullWidth type="text" placeholder={t(options.placeholder)} {...options} />;
            case FilterType.Date:
                if (filterProps.name === FilterNames.dateRange) {
                    return (
                        <MuiDateRangePicker
                            {...options}
                            {...options.data}
                            isStartEndWeekAutoSelect={options.data.isStartEndWeekAutoSelect}
                        />
                    );
                }
                if (filterProps.name === FilterNames.nineWeek) {
                    return (
                        <Weekpicker
                            {...options}
                            weekValueSelected={options.onChange}
                            isNineWeekView={options.data.isNineWeekView}
                        />
                    );
                }
                if (filterProps.name === FilterNames.fixedRangePicker) {
                    return <FixedRangePicker {...options} weekValueSelected={options.onChange} />;
                }
                return <SelectFilter {...options} />;
            case FilterType.MultiSelect:
                options = {
                    multiple: true,
                    ...options,
                    label: t(filterProps.label),
                    placeholder: t(filterProps.placeholder || filterProps.label),
                };
                return <SelectFilter {...options} />;
            case FilterType.Select:
            default:
                options.options = (filterProps.data?.options || []).map((s) => t(s)).filter((option) => option !== '');

                if (filterProps.name === FilterNames.faultCode) {
                    return <SelectFaultCodeFilterNew {...options} />;
                }
                if (filterProps.name === FilterNames.deviceName) {
                    return (
                        <SelectDeviceNameFilterNew
                            {...options}
                            multiple={filterProps.multiple}
                            disableClearable={filterProps.disableClearable}
                        />
                    );
                }
                if (filterProps.name === FilterNames.studId) {
                    return <SelectStudIdFilterNew {...options} />;
                }
                if (filterProps.name === FilterNames.studType) {
                    return <SelectStudTypeFilterNew {...options} />;
                }
                if (filterProps.name === FilterNames.deviceLine) {
                    return <SelectLineFilterNew {...options} />;
                }
                if (filterProps.name === FilterNames.stationName) {
                    return (
                        <SelectStationFilterNew
                            defaultValue={filterProps.defaultValue}
                            {...options}
                            disableClearable={filterProps.disableClearable}
                        />
                    );
                }
                if (filterProps.name === FilterNames.station) {
                    return (
                        <SelectStationOnlyFilterNew
                            defaultValue={filterProps.defaultValue}
                            {...options}
                            disableClearable={filterProps.disableClearable}
                        />
                    );
                }
                if (filterProps.name === FilterNames.singleDate) {
                    return <DateFilter {...options} />;
                }
                if (filterProps.name === FilterNames.eventType) {
                    return <SelectEventTypeFilterNew {...options} />;
                }
                if (filterProps.name === FilterNames.fromTime) {
                    return <MuiDateTime {...options} />;
                }
                if (filterProps.name === FilterNames.weekRange) {
                    return <SelectFixedRollingWeek {...options} />;
                }
                if (filterProps.name === FilterNames.aggregateColumn) {
                    return <SelectAggregateColumn {...options} />;
                }

                options = {
                    ...options,
                    label: t(filterProps.label),
                    placeholder: t(filterProps.placeholder || filterProps.label),
                };
                return <SelectFilter {...options} multiple={filterProps.multiple} />;
        }
    };

    return (
        <>
            <Drawer
                PaperProps={{ sx: { width: 320, overflowY: 'initial' } }}
                variant="persistent"
                anchor="right"
                open={open}
            >
                <Grid
                    container
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        p: 2,
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <Grid item xs={10}>
                        {t(messages.title)}
                    </Grid>

                    {showReset && (
                        <Grid item>
                            <Chip
                                onClick={() =>
                                    resetToDefault({
                                        ...filters,
                                        fromTime: defaultFilters?.fromTime,
                                        toTime: defaultFilters?.toTime,
                                    })
                                }
                                icon={<RestoreIcon />}
                                label="Reset Time"
                                sx={{
                                    cursor: 'pointer',
                                }}
                            />
                        </Grid>
                    )}
                    <Grid item xs={2}>
                        <Button onClick={setOpen}>
                            <CloseIcon style={{ cursor: 'pointer' }} />
                        </Button>
                    </Grid>
                </Grid>
                <List>
                    {displayFilters.map((filterProps, index) => (
                        <ListItem key={`key-filter-item-${index}`}>
                            {/* <span>{filterProps.label}</span> */}
                            {renderFilter(filterProps)}
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
});

export default DashboardFilterPanel;

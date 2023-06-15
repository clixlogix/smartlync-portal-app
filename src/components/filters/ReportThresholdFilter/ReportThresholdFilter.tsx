/**
 *
 * SelectStudIdFilter
 *
 */
import React, { memo, useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';
import styled from 'styled-components/macro';
import Label from '@mui/material//FormLabel';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    reportThresholdActions,
    reportThresholdReducer,
    reportThresholdKey,
} from 'services/report-threshold/report-threshold-reducer';
import { getAllReportThresholdsSaga } from 'services/report-threshold/sagas/report-threshold-saga-get-all';
import { selectReportThreshold } from 'services/report-threshold/report-threshold-selectors';
import { FilterNames, Filters } from 'models';
import { SelectFilterProps } from 'components/filters';
import { Chart } from 'components';
import { messages } from './messages';

import 'scss/main.scss';
import './ReportThresholdFilter.scss';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export enum ThresholdFilterView {
    Full = 'Full',
    DynamicOnly = 'DynamicOnly',
    ThresholdOnly = 'ThresholdOnly',
}
interface ReportThresholdFilterProps extends SelectFilterProps {
    reportThresholdDefault?: number;
    valuelabelColor?: string;
    name: FilterNames;
    viewType?: ThresholdFilterView;
    dynamicValues?: number;
    dynamicOn: boolean;

    data?: any;
}

const AntSwitch = withStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 28,
            height: 16,
            padding: 0,
            display: 'flex',
        },
        switchBase: {
            padding: 2,
            color: theme.palette.grey[500],
            '&$checked': {
                transform: 'translateX(12px)',
                color: theme.palette.common.white,
                '& + $track': {
                    opacity: 1,
                    backgroundColor: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                },
            },
        },
        thumb: {
            width: 12,
            height: 12,
            boxShadow: 'none',
        },
        track: {
            border: `1px solid ${theme.palette.grey[500]}`,
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor: theme.palette.common.white,
        },
        checked: {},
    }),
)(Switch);

const Selector = (props) => {
    const { className = '', checked, onChange, label = 'Dynamic', ...rest } = props;

    return (
        <Typography>
            <Grid>&nbsp; {label}</Grid>
            <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Off</Grid>
                <Grid item>
                    <AntSwitch checked={checked} onChange={onChange} {...rest} />
                </Grid>
                <Grid item>On</Grid>
            </Grid>
        </Typography>
    );
};

const AirbnbSlider = styled(Slider)({
    root: {
        color: '#3a8589',
        height: 3,
        padding: '13px 0',
    },
    thumb: {
        height: 27,
        width: 27,
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        marginTop: -12,
        marginLeft: -13,
        boxShadow: '#ebebeb 0 2px 2px',
        '&:focus, &:hover, &$active': {
            boxShadow: '#ccc 0 2px 3px 1px',
        },
        '& .bar': {
            height: 9,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    active: {},
    valueLabel: {
        top: '8px',
        left: '-4px',
        '& > span': {
            borderRadius: '50%',
        },
    },
    track: {
        height: 3,
    },
    rail: {
        color: '#d8d8d8',
        opacity: 1,
        height: 3,
    },
});

const Bubble = (props) => {
    const { value = 0, textColor, color } = props;

    return (
        <Box
            sx={{
                position: 'absolute',
                right: '0px',
                top: '-60%',
            }}
        >
            <FmdGoodIcon
                sx={{
                    color: `${color} !important`,
                    fontSize: '40px !important',
                    position: 'absolute',
                    right: '0px',
                    top: '50%',
                }}
            />
            <Typography
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '20px',
                    width: '20px',
                    position: 'absolute',
                    right: '10px',
                    top: '7px',
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: `${color} !important`,
                    color: textColor,
                    zIndex: '1',
                    borderRadius: '50%',
                    padding: '1px',
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

export const ReportThresholdFilter = memo((props: ReportThresholdFilterProps) => {
    const { t } = useTranslation();
    const {
        className = '',
        name = FilterNames.reportThreshold,
        reportThresholdDefault = 50,
        data = {},
        onChange,
        label = t(messages.reportThresholdLabel),
        viewType = ThresholdFilterView.ThresholdOnly,
        dynamicValues = 8,
        ...rest
    } = props;
    const {
        palette,
        palette: { mode },
    } = useTheme();

    const { min = 0, max = 100 } = data;
    const { reportThreshold = reportThresholdDefault } = (props.filters || {}) as any;
    const [dynamicOn, setDynamicOn] = useState<boolean>(
        [ThresholdFilterView.DynamicOnly, ThresholdFilterView.Full].includes(viewType),
    );

    useInjectReducer({ key: reportThresholdKey, reducer: reportThresholdReducer });
    useInjectSaga({ key: reportThresholdKey, saga: getAllReportThresholdsSaga });

    const dispatch = useDispatch();

    const thresholdData = useSelector(selectReportThreshold);

    const onHandleOnChange = useCallback(
        (value: Filters) => {
            if (onChange) {
                onChange(value);
            }
        },
        [onChange],
    );

    const [sparkline, threshold] = useMemo(() => {
        if (!Array.isArray(thresholdData)) {
            return [[thresholdData], thresholdData];
        }

        const sparklineData = thresholdData.map((t) => t.value);
        const pThreshold = sparklineData.pop();

        return [sparklineData, pThreshold];
    }, [thresholdData]);

    useEffect(() => {
        if (dynamicOn) {
            dispatch(reportThresholdActions.getAllReportThresholds({}));
        }
    }, [dynamicOn, dispatch]);

    //

    const onDynamicOnChange = (value: boolean) => {
        onHandleOnChange({ dynamicOn: value, [name]: value ? threshold : reportThreshold });
        setDynamicOn(value);
    };

    const halfWay = Math.ceil(max / 2);
    const maxWay = Math.ceil(max / 10) * 10;

    const marks: any = useMemo(() => {
        const markers: any[] = [
            {
                value: 20,
                label: '20',
            },
            {
                value: reportThresholdDefault,
                label: `${reportThresholdDefault}`,
            },
        ];

        if (reportThresholdDefault !== threshold) {
            markers.push({
                value: threshold,
                label: `${threshold} `,
            });
        }

        if (![0, reportThresholdDefault, threshold].includes(halfWay)) {
            markers.push({
                value: halfWay,
                label: `${halfWay} `,
            });
        }
        markers.push({
            value: maxWay,
            label: `${maxWay}`,
        });
        return markers;
    }, [reportThresholdDefault, threshold, halfWay, maxWay]);

    let value = threshold;

    if (reportThreshold && reportThreshold[FilterNames.reportThreshold]) {
        value = reportThreshold[FilterNames.reportThreshold] || threshold;
    }

    const sparkLineOptions = {
        chart: {
            backgroundColor: null,
            borderWidth: 0,
            type: 'area',
            margin: [2, 0, 2, 0],
            style: {
                overflow: 'visible',
            },

            // small optimalization, saves 1-2 ms each sparkline
            skipClone: true,
        },
        title: {
            text: '',
        },
        credits: {
            enabled: false,
        },
        xAxis: {
            labels: {
                enabled: false,
            },
            title: {
                text: null,
            },
            startOnTick: false,
            endOnTick: false,
            tickPositions: [],
        },
        yAxis: {
            endOnTick: false,
            startOnTick: false,
            labels: {
                enabled: false,
            },
            title: {
                text: null,
            },
            tickPositions: [0],
        },
        legend: {
            enabled: false,
        },
        tooltip: {
            enabled: false,
        },
        exporting: {
            enabled: false,
        },
        plotOptions: {
            series: {
                animation: true,
                lineWidth: 1,
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1,
                    },
                },
                marker: {
                    radius: 1,
                    states: {
                        hover: {
                            radius: 2,
                        },
                    },
                },
                fillOpacity: 0.25,
            },
            column: {
                negativeColor: '#910000',
                borderColor: 'silver',
            },
        },

        series: [
            {
                data: sparkline.splice(Math.max(0, sparkline.length - dynamicValues)),
            },
        ],
    };

    const renderSlider = () => (
        <AirbnbSlider
            defaultValue={value}
            getAriaLabel={(index: number) => `aria-label-${index}-${Math.random()}`}
            getAriaValueText={(value) => `${value}`}
            aria-labelledby="discrete-slider-always"
            step={10}
            marks={marks}
            valueLabelDisplay="on"
            min={min}
            max={maxWay}
            onChangeCommitted={(event, value) => onHandleOnChange({ [name]: value })}
            {...rest}
        />
    );

    if (viewType === ThresholdFilterView.ThresholdOnly) {
        return (
            <Box sx={{ width: '100%' }}>
                {label && <Label>{label}</Label>}
                {renderSlider()}
            </Box>
        );
    }
    if (viewType === ThresholdFilterView.DynamicOnly) {
        return (
            <Box>
                {label && (
                    <>
                        <Label>{label}</Label>
                        <Bubble value={threshold} />
                    </>
                )}
                <Chart options={sparkLineOptions} chartType={'line'} />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItem: 'center', justifyContent: 'space-between' }}>
                {label && <Label>{label}</Label>}
                <Selector onChange={() => onDynamicOnChange(!dynamicOn)} checked={dynamicOn} />
            </Box>
            <Box>{!dynamicOn && renderSlider()}</Box>

            {dynamicOn && (
                <Box
                    sx={{
                        marginTop: '50px',
                        height: '50px',
                        position: 'relative',
                        backgroundColor: mode === 'light' ? palette?.grey?.[200] : palette?.common?.black,
                    }}
                >
                    <Chart options={sparkLineOptions} chartType={'line'} />
                    {dynamicOn && (
                        <Bubble
                            value={threshold}
                            color={mode === 'light' ? palette?.common?.black : palette?.common?.white}
                            textColor={mode === 'light' ? palette?.common?.white : palette?.common?.black}
                        />
                    )}
                </Box>
            )}
        </Box>
    );
});

export default ReportThresholdFilter;

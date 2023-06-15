/**
 *
 * RangeSlider
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Theme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import moment from 'moment';

import 'scss/main.scss';
import './RangeSlider.scss';

interface RangeSliderProps {
    className?: string;
    min: number;
    max: number;
    defaultValue?: number | number[];
    step: number;
    valuelabelColor?: string;
    children?: React.ReactNode | React.ReactNode[];
    index?: number;
    disabled?: boolean;
    onChange?(event: any, newValue: number | number[]);
}

interface ValueLabelComponentProps {
    open: boolean;
    value: number;
    children?: any;
    index?: number;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 300 + theme.spacing(3) * 2,
        },
        margin: {
            height: theme.spacing(3),
        },
    }),
);

const AirbnbSlider = withStyles({
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
        boxShadow: 'none',
        '&:focus, &:hover, &$active': {
            boxShadow: 'none',
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
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 3,
    },
    rail: {
        color: '#d8d8d8',
        opacity: 1,
        height: 3,
    },
})(Slider);

function AirbnbThumbComponent(props: any) {
    return (
        <span {...props}>
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
        </span>
    );
}

export const RangeSlider = memo((props: RangeSliderProps) => {
    const {
        className = '',
        max = moment().add(1, 'month').valueOf(),
        min = moment().subtract(6, 'months').valueOf(),
        step = 36000,
        ...rest
    } = props;

    const classes = useStyles();

    const ValueLabelComponent = (props: ValueLabelComponentProps) => {
        const { children, open, value, index } = props;
        const date = moment(value).format('ll, [Wk] / W');
        let flt;
        if (index) {
            flt = index > 0 ? 'right' : 'left';
        }
        return (
            <Tooltip open={open} enterTouchDelay={0} placement="top" title={date}>
                <span style={{ float: flt }}>{children}</span>
            </Tooltip>
        );
    };

    return (
        <Div className={`${classes.root} ${className}`}>
            <AirbnbSlider
                ThumbComponent={AirbnbThumbComponent}
                valueLabelDisplay="auto"
                getAriaLabel={() => 'Slider'}
                getAriaValueText={(valuetext) => `${valuetext}`}
                ValueLabelComponent={ValueLabelComponent}
                min={Math.min(min, max)}
                max={Math.max(min, max)}
                step={step}
                {...rest}
            />
        </Div>
    );
});

const Div = styled.div``;

export default RangeSlider;

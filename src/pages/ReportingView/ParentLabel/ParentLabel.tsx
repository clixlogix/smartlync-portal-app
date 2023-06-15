/**
 *
 * ParentLabel
 *
 */
import React, { Fragment, memo } from 'react';
import styled from 'styled-components/macro';
import moment, { Moment } from 'moment';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { ReportingDataView } from 'models';

import './ParentLabel.scss';

interface Props {
    className?: string;
    time: string | Moment;
    view: ReportingDataView;
    locale?: string;

    onClick?(e, label, view, name, time);
}

export const ParentLabel = memo((props: Props) => {
    const { className = '', time, view, onClick } = props;

    const handleOnClick = (e, label, view, name) => {
        if (onClick) {
            onClick(e, label, view, name, time);
        }
    };

    const getParentLabel = (view: ReportingDataView): string | React.ReactNode => {
        let label, name;
        const data = moment(time);

        switch (view) {
            case ReportingDataView.Weekly:
                label = data.format('YYYY');
                return <></>;
            case ReportingDataView.Daily:
                label = data.format('W');
                return (
                    <Div onClick={(e) => handleOnClick(e, label, ReportingDataView.Weekly, label)}>
                        <ArrowUpwardIcon /> &nbsp;
                    </Div>
                );
            case ReportingDataView.Hourly:
                label = data.format('YYYY');
                name = data.format('W');
                return (
                    <Div onClick={(e) => handleOnClick(e, label, ReportingDataView.Daily, name)}>
                        <ArrowUpwardIcon /> &nbsp;
                    </Div>
                );
            default:
                return Fragment;
        }
    };

    return (
        <Div
            className={`x-cls-parent-label ${className} stanleyRow ${
                view === ReportingDataView.Weekly ? '' : 'clickable'
            } `}
        >
            {getParentLabel(view)}
        </Div>
    );
});

const Div = styled.div``;

export default ParentLabel;

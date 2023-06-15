/**
 *
 * TableHead
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { ReportingDataView } from 'models';
import moment, { LocaleSpecifier, Moment } from 'moment';

import './TableHeader.scss';

interface Props {
    className?: string;
    columnMeta?: any;
    expand: boolean;
    labelFormat?: string;
    extendedLabelFormat?: string;
    langCode?: LocaleSpecifier;
    key?: string;

    handleToggleColumn?();
    handleTableLinkClick?(event: any, label: any, reportingDataView: ReportingDataView, name: any, time?: Moment);
}

export function TableHeader(props: Props) {
    const {
        className = '',
        columnMeta = { name: '', label: '' },
        labelFormat = 'dddd',
        extendedLabelFormat = `(DD-MMM)`,
        // langCode = 'en',
        // handleToggleColumn = () => {},
        handleTableLinkClick = () => {},
    } = props;

    const { i18n } = useTranslation();
    const { time } = columnMeta;
    const { name = '', label = '', key = `x-key-${Math.random()}` } = columnMeta;

    let week: any = moment(time).isoWeek();

    const weekno = moment(week).day(1).format(labelFormat);

    const day = moment(time).format(labelFormat);
    const date = moment(time).format(extendedLabelFormat);

    return (
        <Th key={key} className={`${className} x-cls-table-header-cell center`}>
            <Div className={'x-head-wrapper'} style={{ justifyContent: 'center' }}>
                <div className={'x-first'} style={{ fontSize: 14, color: 'white' }}>
                    {day}
                </div>
                <div className={'x-second'} style={{ fontSize: 13, color: 'white' }}>
                    {`${date}`} &nbsp;
                    <Div
                        className="launch-icon"
                        style={{ zIndex: 3030 }}
                        onClick={(event) => handleTableLinkClick(event, label, ReportingDataView.Hourly, name, time)}
                    >
                        <Tooltip
                            arrow
                            title={<div className={'launch-tool-tip'}>{`show hourly`}</div>}
                            aria-label={`show hourly`}
                            placement={'bottom'}
                        >
                            <ZoomInIcon />
                        </Tooltip>
                    </Div>
                </div>
            </Div>
            {day === weekno && <Div className={'x-trans-label day'}>Week{week}</Div>}
        </Th>
    );
}

const Th = styled.th``;
const Div = styled.div``;

export default TableHeader;

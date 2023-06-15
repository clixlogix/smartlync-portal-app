/**
 *
 * TableHead
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { ReportingDataView } from 'models';
import moment, { LocaleSpecifier } from 'moment';

import './TableHeader.scss';

interface Props {
    className?: string;
    columnMeta?: any;
    expand: boolean;
    labelFormat?: string;
    extendedLabelFormat?: string;
    langCode?: LocaleSpecifier;

    handleToggleColumn?();
    handleTableLinkClick?(event: any, label: any, reportingDataView: ReportingDataView, name: any);
}

export function TableHeader(props: Props) {
    const {
        className = '',
        columnMeta = { name: '', label: '' },
        labelFormat = 'dddd',
        extendedLabelFormat = `(DD-MMM)`,
        langCode = 'en',
    } = props;
    const { time } = columnMeta;

    return (
        <Th className={`${className} x-cls-table-header-cell center`}>
            <Div style={{ justifyContent: 'center' }}>
                <div style={{ fontSize: 14, color: 'white' }}>{moment(time).format(labelFormat)}</div>
                <div style={{ fontSize: 13, color: 'white' }}>{`${moment(time).format(extendedLabelFormat)}`}</div>
            </Div>
        </Th>
    );
}

const Th = styled.th``;
const Div = styled.div``;

export default TableHeader;

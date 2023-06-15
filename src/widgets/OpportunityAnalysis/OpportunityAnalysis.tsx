/**
 *
 * OpportunityAnalysis
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';
import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Loader from 'components/Loader';
import {
    opportunityAnalysisActions,
    opportunityAnalysisReducer,
    opportunityAnalysisKey,
} from 'services/opportunity-analysis/opportunity-analysis-reducer';
import {
    selectOpportunityAnalysiss,
    selectOpportunityAnalysisIsLoading,
} from 'services/opportunity-analysis/opportunity-analysis-selectors';
import { getAllOpportunityAnalysissSaga } from 'services/opportunity-analysis/sagas/opportunity-analysis-saga-get-all';
import { FilterNames, Filters, OpportunityAnalysis, OpportunityAnalysiss } from 'models';
import { DashboardFilter, FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import Table from 'components/Table';
import { Widget, WidgetProps } from 'widgets';
import { messages } from './messages';
import moment from 'moment';
import { DATE_TIME_FORMAT } from 'constants/index';

import 'scss/main.scss';
import './OpportunityAnalysis.scss';

interface OpportunityAnalysisProps extends WidgetProps {}

export const OpportunityAnalysisWidget: Widget<OpportunityAnalysisProps> = memo((props: OpportunityAnalysisProps) => {
    useInjectReducer({ key: opportunityAnalysisKey, reducer: opportunityAnalysisReducer });
    useInjectSaga({ key: opportunityAnalysisKey, saga: getAllOpportunityAnalysissSaga });

    const { className = '', filters = {}, setAvailableFilters } = props;
    const { t, i18n } = useTranslation();
    const opportunityAnalysiss: OpportunityAnalysiss | undefined = useSelector(selectOpportunityAnalysiss);
    const opportunityAnalysisIsLoading: boolean = useSelector(selectOpportunityAnalysisIsLoading);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(opportunityAnalysisIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        // ...defaultFilters,
        // add your filters here
        ...filters,
    });

    useEffect(() => {
        dispatch(
            opportunityAnalysisActions.getAllOpportunityAnalysiss({
                ...widgetFilters,
                ...filters,
                eventType: filters?.eventTypeCode,
            }),
        );
    }, [dispatch, filters, widgetFilters]);

    const [filterValues, formattedData] = useMemo(() => {
        const fValues = {};

        const fData: OpportunityAnalysiss = (opportunityAnalysiss || []).reduce((acc, row: OpportunityAnalysis) => {
            // add your format for each row of the widget's data here
            acc.push(row);

            // add your filter default selectors/data here
            return acc;
        }, [] as OpportunityAnalysiss);
        return [fValues, fData];
    }, [opportunityAnalysiss]);

    // get filter values;
    // defaultFilters
    useEffect(() => {
        if (setAvailableFilters) {
            setAvailableFilters(
                defaultFilters.map((filter: DashboardFilter) => {
                    const data: any = {};

                    switch (filter.name) {
                        case 'faultCode':
                            break;
                        case 'deviceName': // add your default option values for your select in the filter panel
                            break;
                    }

                    return { ...filter, data };
                }),
            );
        }
    }, [widgetFilters, setAvailableFilters, filterValues]);

    const HtmlTooltip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 320,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }))(Tooltip);

    const columnsSWS = [
        {
            name: 'deviceName',
            label: 'Device',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return <div style={{ whiteSpace: 'nowrap' }}>{value}</div>;
                },
            },
        },
        {
            name: 'station',
            label: 'Station',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return <div style={{ whiteSpace: 'nowrap' }}>{value}</div>;
                },
            },
        },
        {
            name: 'studType',
            label: 'Stud Type',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value) {
                    return <div className={`opportunity-status ${value?.toLowerCase()}-status`}>{value}</div>;
                },
            },
        },
        {
            name: 'eventCode',
            label: 'Event Code',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value) {
                    return <div className={`opportunity-status ${value?.toLowerCase()}-status`}>{value}</div>;
                },
            },
        },
        {
            name: 'description',
            label: 'Event Description',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return <div>{value}</div>;
                },
            },
        },
        {
            name: 'occurredOn',
            label: 'Occurred On',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return <div>{value ? moment(value).format(DATE_TIME_FORMAT) : ''}</div>;
                },
            },
        },
        {
            name: 'actionData',
            label: 'Recommended Action',
            options: {
                sort: false,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return (
                        <div>
                            {value &&
                                value.map((element) => {
                                    const { actionType, recommendedAction } = element;
                                    // eslint-disable-next-line array-callback-return
                                    if (actionType === 'comment') return;
                                    return (
                                        <div>
                                            [ {element.actionType.toUpperCase()} ] : {`${recommendedAction}`}
                                        </div>
                                    );
                                })}
                        </div>
                    );
                },
            },
        },
        {
            name: 'deviceHealth',
            label: 'Device Health',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return <div className={'opportunity-stage'}>{value}</div>;
                },
            },
        },
        {
            name: 'alpha',
            label: 'Alpha',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return (
                        <div className={'opportunity-impact-estimate'} style={{ textAlign: 'center' }}>
                            {value === 0 ? '-' : value}
                        </div>
                    );
                },
            },
        },
        {
            name: 'beta',
            label: 'Beta',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return (
                        <div className={'opportunity-impact-estimate'} style={{ textAlign: 'center' }}>
                            {value === 0 ? '-' : value}
                        </div>
                    );
                },
            },
        },
        {
            name: 'mttr',
            label: 'Incident Estimated Impact',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    if (value === 0)
                        return (
                            <div className={'opportunity-impact-estimate'} style={{ textAlign: 'center' }}>{`-`}</div>
                        );
                    return (
                        <div
                            className={'opportunity-impact-estimate'}
                            style={{ textAlign: 'center' }}
                        >{`${value} min, $${value * 500}`}</div>
                    );
                },
            },
        },
        {
            name: 'latestStage',
            label: 'Latest Stage',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return <div className={`opportunity-stage ${value}`}>{value}</div>;
                },
            },
        },
    ];

    const columnsSPR = [
        {
            name: 'deviceName',
            label: 'Device',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return <div style={{ whiteSpace: 'nowrap' }}>{value}</div>;
                },
            },
        },
        {
            name: 'station',
            label: 'Station',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return <div style={{ whiteSpace: 'nowrap' }}>{value}</div>;
                },
            },
        },
        {
            name: 'eventCode',
            label: 'Event Code',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value) {
                    return <div className={`opportunity-status ${value?.toLowerCase()}-status`}>{value}</div>;
                },
            },
        },
        {
            name: 'description',
            label: 'Event Description',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return <div>{value}</div>;
                },
            },
        },
        {
            name: 'occurredOn',
            label: 'Occurred On',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return <div>{value ? moment(value).format(DATE_TIME_FORMAT) : ''}</div>;
                },
            },
        },
        {
            name: 'actionData',
            label: 'Recommended Action',
            options: {
                sort: false,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return (
                        <div>
                            {value &&
                                value.map((element) => {
                                    const { actionType, recommendedAction } = element;
                                    // eslint-disable-next-line array-callback-return
                                    if (actionType === 'comment') return;
                                    return (
                                        <div>
                                            [ {element.actionType.toUpperCase()} ] : {`${recommendedAction}`}
                                        </div>
                                    );
                                })}
                        </div>
                    );
                },
            },
        },
        {
            name: 'deviceHealth',
            label: 'Device Health',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return <div className={'opportunity-stage'}>{value}</div>;
                },
            },
        },
        {
            name: 'alpha',
            label: 'Alpha',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return (
                        <div className={'opportunity-impact-estimate'} style={{ textAlign: 'center' }}>
                            {value === 0 ? '-' : value}
                        </div>
                    );
                },
            },
        },
        {
            name: 'beta',
            label: 'Beta',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return (
                        <div className={'opportunity-impact-estimate'} style={{ textAlign: 'center' }}>
                            {value === 0 ? '-' : value}
                        </div>
                    );
                },
            },
        },
        {
            name: 'mttr',
            label: 'Incident Estimated Impact',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    if (value === 0)
                        return (
                            <div className={'opportunity-impact-estimate'} style={{ textAlign: 'center' }}>{`-`}</div>
                        );
                    return (
                        <div
                            className={'opportunity-impact-estimate'}
                            style={{ textAlign: 'center' }}
                        >{`${value} min, $${value * 500}`}</div>
                    );
                },
            },
        },
        {
            name: 'latestStage',
            label: 'Latest Stage',
            options: {
                sortThirdClickReset: true,
                customBodyRender: function customBodyRender(value, tableMeta, updateValue) {
                    return <div className={`opportunity-stage ${value}`}>{value}</div>;
                },
            },
        },
    ];

    const options: any = {
        customToolbar: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
            return (
                <TableFooter className="x-cls-opportunity-analysis-widget-footer">
                    <TableRow>
                        <TableCell className="legend-footer">
                            <table>
                                <tbody>
                                    <tr className="key-footer-row">
                                        <td>
                                            <span className="opportunity-stage AR">AR</span>
                                        </td>
                                        <td>
                                            <span>{t(messages.actionRecommended)}</span>
                                        </td>
                                        <td>
                                            <span className="opportunity-stage AT">AT</span>
                                        </td>
                                        <td>
                                            <span>{t(messages.actionTaken)}</span>
                                        </td>
                                    </tr>
                                    {/* <tr className="key-footer-row">  // Comment out Case closed until we have the option available from BE
                                        <td>
                                            <span className="opportunity-stage CC">CC</span>
                                        </td>
                                        <td>
                                            <span>{t(messages.caseClosed)}</span>
                                        </td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            );
        },
    };

    return (
        <Div className={` ${className} x-cls-opportunity-analysis-widget`}>
            {formattedData.length > 0 ? (
                <Table
                    className={`x-cls-opportunity-analysis-widget-table`}
                    data={formattedData}
                    columns={filters.systemType === 'SWS' ? columnsSWS : columnsSPR}
                    options={{ ...options }}
                    // themeObj={tableTheme}
                    // tableFooterHeight={185}
                    // toolbarHeight={90}
                    tableBodyHeight={window.innerHeight - 350}
                />
            ) : (
                <>
                    {opportunityAnalysisIsLoading && <Loader />}
                    {!opportunityAnalysisIsLoading && <Loader noData />}
                </>
            )}
        </Div>
    );
});

const Div = styled.div``;

// extra widget properties
const defaultFilters: DashboardFilter[] = [
    { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    {
        name: FilterNames.eventType,
        type: FilterType.Select,
        data: {
            options: [
                'Filters.Fault',
                'Filters.Warning',
                'Filters.FirmwareUpdate',
                'Filters.Info',
                'Filters.Componentexchange',
                'Filters.Maintenance',
            ],
        } as SelectFilterData,
    },
];
export const OpportunityAnalysisProperty = Object.assign(
    {},
    {
        defaultFilters: defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 0,
            w: 2,
            h: 3,
            minW: 1,
            minH: 1,
        },
    },
);

export default OpportunityAnalysisWidget;

import React, { memo, useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { SizeMe } from 'react-sizeme';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    processOperationActions,
    processOperationReducer,
    processOperationKey,
} from 'services/process-operation/process-operation-reducer';
import {
    selectOperationItems,
    selectOperationItemIsLoading,
} from 'services/process-operation/process-operation-selectors';
import { getAllOperationItemsSaga } from 'services/process-operation/sagas/process-operation-saga-get-all';
import {
    DashboardFilter,
    FilterType,
    MultiSelectFilterData,
    NumberRangeFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import Table from 'components/Table';
import { FilterNames, Filters, OperationItem, OperationItems } from 'models';
import { Widget, WidgetProperty, WidgetProps } from 'widgets';
import { messages } from './messages';

import 'scss/main.scss';
import './ProcessLog.scss';
import {
    historicalDiagnosticActions,
    historicalDiagnosticKey,
    historicalDiagnosticReducer,
} from 'services/historical-diagnostic/historical-diagnostic-reducer';
import { getAllHistoricalDiagnosticsSaga } from 'services/historical-diagnostic/sagas';
import {
    selectHistoricalDiagnosticIsLoading,
    selectHistoricalDiagnostics,
} from 'services/historical-diagnostic/historical-diagnostic-selectors';

interface ProcessLogProps extends WidgetProps {
    activityState?: string;
    type?: string;
    rows?: { from: number; to: number };
    onRowSelected?(row: OperationItem);
    filters: any;
    onRowClick?(rowData: string[], rowMeta: { dataIndex: number; rowIndex: number });
}

export const ProcessLog: Widget<ProcessLogProps> = memo((props: ProcessLogProps) => {
    useInjectReducer({ key: processOperationKey, reducer: processOperationReducer });
    useInjectSaga({ key: processOperationKey, saga: getAllOperationItemsSaga });
    useInjectReducer({ key: historicalDiagnosticKey, reducer: historicalDiagnosticReducer });
    useInjectSaga({ key: historicalDiagnosticKey, saga: getAllHistoricalDiagnosticsSaga });

    const { className = '', filters = {}, onRowClick, activityState } = props;
    const { t } = useTranslation();
    const OperationLogs: OperationItems | undefined = useSelector(selectOperationItems);
    const operationItemIsLoading: boolean = useSelector(selectOperationItemIsLoading);
    const HistoricalLogs: any = useSelector(selectHistoricalDiagnostics);
    const historicalItemIsLoading: boolean = useSelector(selectHistoricalDiagnosticIsLoading);
    const dispatch = useDispatch();

    filters.systemType = 'SWS';
    const [widgetFilters] = useState<Filters>({
        ...filters,
        plantId: 1,
    });

    const serviceFilters = useMemo(
        () => ({
            ...widgetFilters,
            ...filters,
        }),
        [widgetFilters, filters],
    );

    const processLogs = props.activityState === 'active' ? OperationLogs : HistoricalLogs;

    const displayRows = useMemo(() => {
        return (processLogs || []) /* slice(rows.from, Math.min(rows.to, processLogs.length)). */
            .filter((row) => !row.hidden);
    }, [/* rows.to, rows.from, */ processLogs]);

    if (props.isLoading) {
        const loading = props.activityState === 'active' ? operationItemIsLoading : historicalItemIsLoading;
        props.isLoading(loading);
    }

    useEffect(() => {
        dispatch(processOperationActions.getAllOperationItems({ ...filters, activityState }));
    }, [filters, activityState]);

    useEffect(() => {
        return () => {
            dispatch(processOperationActions.getAllOperationItems({ ...filters, activityState: 'date-range' }));
        };
    }, []);

    useEffect(() => {
        dispatch(processOperationActions.filterAllOperationItems({ ...filters }));
    }, [dispatch, filters]);

    useEffect(() => {
        dispatch(historicalDiagnosticActions.getAllHistoricalDiagnostics({ ...serviceFilters }));
    }, [dispatch, serviceFilters]);

    const handleOnRowClick = (rowData: string[], rowMeta: { dataIndex: number; rowIndex: number }) => {
        if (onRowClick) {
            onRowClick(rowData, rowMeta);
        }
    };

    const tableTheme = useMemo(() => {
        const obj: any = {
            root: {
                '&$disabled': {
                    color: '#ffdb38',
                },
            },
            MuiTableCell: {
                root: {
                    font: 'normal normal normal 18px/60px Open Sans',
                },
            },
            MUIDataTableBodyCell: {
                stackedCommon: {
                    color: '#fff',
                    textAlign: 'center',
                },
            },
        };

        return obj;
    }, []);

    const columns = [
        {
            name: 'systemType',
            label: t(messages.anomalyTypeLabel),
            options: {
                sortThirdClickReset: true,
            },
        },
        {
            name: 'deviceName',
            label: t(messages.anomalyDeviceLabel),
            options: {
                sortThirdClickReset: true,
            },
        },
        {
            name: 'stationName',
            label: t(messages.anomalyStationLabel),
            options: {
                sortThirdClickReset: true,
            },
        },
        {
            name: 'anomaly',
            label: t(messages.anomalyListLabel),
            options: {
                sortThirdClickReset: true,
                customBodyRenderLite: (rowIndex, dataIndex) => {
                    const val = (processLogs || [])[rowIndex]?.anomaly;

                    switch (val) {
                        case '':
                        case 'None':
                            return <span className={'anomaly-label'}>{val}</span>;
                        default:
                            return <span className={'anomaly-label alert'}>{val}</span>;
                    }
                },
            },
        },
        {
            name: 'confidence',
            label: t(messages.anomalyConfidenceLabel),
            options: {
                sortThirdClickReset: true,
                customBodyRenderLite: (rowIndex, dataIndex) => {
                    return (
                        <span className={'confidence-label'}>
                            {(processLogs || [])[rowIndex]?.confidence}
                            <span className={'confidence-units'}>%</span>
                        </span>
                    );
                },
            },
        },
        {
            name: 'device.studId',
            label: t(messages.processStudId),
            options: {
                sortThirdClickReset: true,
            },
        },
        {
            name: 'time',
            label: t(messages.anomalyTimeLabel),
            options: {
                sortThirdClickReset: true,
            },
        },
        {
            name: 'feedback',
            label: t(messages.anomalyFeedbackLabel),
            options: {
                sortThirdClickReset: true,
                customBodyRenderLite: (rowIndex, dataIndex) => {
                    return (
                        <span
                            className={`feedback-label ${
                                !!(processLogs || [])[rowIndex]?.feedback ? 'feedback-available fa fas fa-close' : ''
                            }`}
                        />
                    );
                },
            },
        },
    ];

    const options = {
        filterType: 'checkbox',
        elavation: 4,
        enableNestedDataAccess: '.',
        // responsive: 'scrollMaxHeight',
        // responsive: 'sstackedcroll',
        onRowClick: handleOnRowClick,
    };

    return (
        <Div className={`${className} x-cls-process-log-widget`}>
            <SizeMe>
                {({ size }) => {
                    const { height = 0 } = size as any;
                    const tableBodyHeight = height - 220;

                    return (
                        <Table
                            tableBodyHeight={window.innerHeight - 210}
                            className={`x-cls-process-log-widget-table`}
                            data={displayRows}
                            columns={columns}
                            options={{ ...options, tableBodyHeight }}
                            themeObj={tableTheme}
                        />
                    );
                }}
            </SizeMe>
        </Div>
    );
});

const Div = styled.div``;

// extra widget properties
const defaultFilters: DashboardFilter[] = [
    {
        name: FilterNames.stationName,
        type: FilterType.Select,
        data: {
            options: [],
        } as MultiSelectFilterData,
    },
    {
        name: FilterNames.deviceName,
        type: FilterType.Select,
        data: {
            options: [],
        } as MultiSelectFilterData,
    },
    {
        name: FilterNames.anomaly,
        type: FilterType.Select,
        label: 'Filters.FilterByAnomalyLabel',
        placeholder: 'Filters.FilterByAnomalyPlaceholder',
        data: {
            options: [],
        } as MultiSelectFilterData,
    },
    {
        name: FilterNames.anomalyConfidence,
        type: FilterType.NumberRange,
        label: 'Filters.FilterByAnomalyConfidenceLabel',
        data: {
            value: 60,
        } as NumberRangeFilterData,
    },
];
export const ProcessLogProperty: WidgetProperty = Object.assign(
    {},
    {
        defaultFilters,
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
export default ProcessLog;

/**
 *
 * FleetExpandDeviceTable
 *
 */
import React, { useMemo, memo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    fleetExpandDeviceTableActions,
    fleetExpandDeviceTableReducer,
    fleetExpandDeviceTableKey,
} from 'services/fleet-expand-device-table/fleet-expand-device-table-reducer';
import {
    selectFleetExpandDeviceTables,
    selectFleetExpandDeviceTableIsLoading,
} from 'services/fleet-expand-device-table/fleet-expand-device-table-selectors';
import { useFilters } from 'utils/hooks/use-filters';
import moment from 'moment';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAllFleetExpandDeviceTablesSaga } from 'services/fleet-expand-device-table/sagas/fleet-expand-device-table-saga-get-all';
import { getInitialColumns } from './columns';
import Table from 'components/Table';
import Loader from 'components/Loader';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';

import 'scss/main.scss';
import './FleetExpandDeviceTable.scss';

interface FleetExpandDeviceTableProps extends WidgetProps {}

const listOfLocalFilters = [];

export const FleetExpandDeviceTableWidget: Widget<FleetExpandDeviceTableProps> = memo(
    (props: FleetExpandDeviceTableProps) => {
        const { className = '', filters = {} } = props;
        useInjectReducer({ key: fleetExpandDeviceTableKey, reducer: fleetExpandDeviceTableReducer });

        useInjectSaga({ key: fleetExpandDeviceTableKey, saga: getAllFleetExpandDeviceTablesSaga });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { t, i18n } = useTranslation();

        const fleetExpandDeviceTables: any = useSelector(selectFleetExpandDeviceTables);

        const fleetExpandDeviceTableIsLoading: boolean = useSelector(selectFleetExpandDeviceTableIsLoading);
        const dispatch = useDispatch();
        const displayRows = useMemo(() => {
            return fleetExpandDeviceTables || [];
        }, [fleetExpandDeviceTables]);

        if (props.isLoading) {
            props.isLoading(fleetExpandDeviceTableIsLoading);
        }

        const { apiFilters } = useFilters({
            defaultFilters: {
                ...defaultFilters,
                ...filters,
            },
            listOfLocalFilters,
        });

        let screenSize;
        if (useMediaQuery('(max-width:1024px)')) {
            screenSize = 'small';
        }
        if (useMediaQuery('(min-width:1024px) and (max-width:1500px)')) {
            screenSize = 'medium';
        }

        useEffect(() => {
            dispatch(
                fleetExpandDeviceTableActions.getAllFleetExpandDeviceTables({
                    ...apiFilters,
                    langCode: i18n.language,
                }),
            );
        }, [dispatch, apiFilters, i18n.language]);

        const tableTheme = useMemo(() => {
            const obj: any = {
                root: {
                    '&$disabled': {
                        color: '#ffdb38',
                        backgroundColor: '#262626',
                    },
                },
                MuiTableCell: {
                    root: {
                        font: 'normal normal normal 18px/60px Open Sans',
                        backgroundColor: '#262626',
                        borderBottom: 'none',
                        border: 'none',
                        width: '77px',
                        height: '56px',
                        lineHeight: 'none',
                        padding: '1px',
                    },
                },

                MUIDataTable: {
                    responsiveBase: { backgroundColor: '#262626', border: 'none', height: 'auto' },
                },
                MUIDataTableHeadCell: {
                    fixedHeader: {
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        fontSize: '14px',
                        lineHeight: '24px',
                        backgroundColor: '#262626',
                        borderBottom: 'none',
                        border: 'none',
                        textAlign: 'left',
                    },
                    toolButton: {
                        marginLeft: 0,
                        marginRight: 0,
                    },
                },
                MUIDataTableBodyCell: {
                    stackedCommon: {
                        color: '#fff',
                        textAlign: 'left',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    },
                },
            };

            return obj;
        }, []);

        const getColumnName = useCallback((time: any): string => {
            return moment(time).format('ddd DD').toUpperCase();
        }, []);

        const tableColumns = useMemo(() => {
            let columns: any[] = getInitialColumns(screenSize)
                .slice(0, 2)
                .map((c) => ({ ...c, name: t(messages[c.name]) }));

            const dataCellCol = {
                options: {
                    filter: false,
                    sortThirdClickReset: true,
                    setCellProps: (value) => {
                        return {
                            className: `data-cell fault-code`,
                        };
                    },
                    setCellHeaderProps: () => ({
                        className: 'data-cell-header device-expand-data',
                    }),
                    customBodyRender: (value) => {
                        const { faultCount } = value;
                        let cellColor;
                        if (faultCount > 1) {
                            cellColor = 'grey';
                        }
                        if (faultCount > 20) {
                            cellColor = 'light-red';
                        }
                        if (faultCount > 30) {
                            cellColor = 'medium-red';
                        }
                        if (faultCount > 50) {
                            cellColor = 'dark-red';
                        }
                        return <div className={`x-cell-value ${cellColor}`}>{faultCount}</div>;
                    },
                },
            };

            const cols: any = {};
            displayRows.forEach(({ fault, description, time, faultCount }) => {
                cols[time] = {
                    name: getColumnName(time),
                    ...dataCellCol,
                };
            });
            const dataCol = [...columns, ...Object.values(cols)];
            return dataCol;
        }, [screenSize, t, getColumnName, displayRows]);

        const tableData: any[] = useMemo(() => {
            const outputData = displayRows.reduce((acc, { fault, description, time, faultCount }) => {
                if (!acc.has(fault)) {
                    acc.set(fault, [fault, description]);
                }
                const row = acc.get(fault);
                row.push({ fault, description, time, faultCount });
                acc.set(fault, row);
                return acc;
            }, new Map<string, any>());
            const output = Array.from(outputData.values());
            return output;
        }, [displayRows]);

        const options = {
            filter: false,
            footer: false,
            pagination: false,
            fixedHeader: true,
            elevation: 5,
            // filterType: 'none',
            selectableRowsHeader: false,
            responsive: 'vertical',
            search: false,
            download: false,
            print: false,
            viewColumns: false,
            customToolbar: null,
            selectableRows: 'none',
            enableNestedDataAccess: '.',
            sortThirdClickReset: true,
            confirmFilters: true,
        };

        return (
            <Div className={`${className} x-cls-fleet-expand-device-table-widget`}>
                <Div className={`stanleyCol page-wrapper ${tableData.length > 0 ? '' : 'empty-table'}`}>
                    {tableData?.length > 0 && (
                        <Table
                            className={`x-cls-fleet-expand-device-table-widget-table`}
                            data={tableData}
                            columns={tableColumns}
                            options={options}
                            themeObj={tableTheme}
                        />
                    )}
                    {tableData.length === 0 && (
                        <Div className={'x-cls-loading animated-zoom '}>
                            {fleetExpandDeviceTableIsLoading && <Loader />}
                            {!fleetExpandDeviceTableIsLoading && <Div>{t(messages.noData)}</Div>}
                        </Div>
                    )}
                </Div>
            </Div>
        );
    },
);

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
*/
];
export const FleetExpandDeviceTableProperty = Object.assign(
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

export default FleetExpandDeviceTableWidget;

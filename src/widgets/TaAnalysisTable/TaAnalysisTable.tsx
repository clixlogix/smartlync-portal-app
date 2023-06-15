/**
 *
 * TaAnalysisTable
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import Loader from 'components/Loader';
import {
    taAnalysisTableActions,
    taAnalysisTableReducer,
    taAnalysisTableKey,
} from 'services/ta-analysis-table/ta-analysis-table-reducer';
import {
    selectTaAnalysisTables,
    selectTaAnalysisTableIsLoading,
} from 'services/ta-analysis-table/ta-analysis-table-selectors';
import { getAllTaAnalysisTablesSaga } from 'services/ta-analysis-table/sagas/ta-analysis-table-saga-get-all';
import { Filters, TaAnalysisTables, FilterNames } from 'models';
import * as _ from 'lodash';
import Table from 'components/Table';
import { FilterType, SelectFilterData, DateFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';
import {
    TableHeader as CBTableHeader,
    TableBody as CBTableBody,
    TableHeadLabel as CBTableHeadLabel,
    TableHeader as CBTableHead,
} from './components/TableComponents';
import { columns as initialColumns } from './taAnalysisColumns';
import { TableTheme } from 'components/Table/Table';
import { createTheme as createMuiTheme, adaptV4Theme } from '@mui/material/styles';
import moment from 'moment';

import 'scss/main.scss';
import './TaAnalysisTable.scss';

const intervalViews = {
    colWidth: 160,
    customTableHeader: CBTableHeader,
    customBodyRender: CBTableBody,
    customHeadLabelRender: CBTableHeadLabel,
    customHeadRender: CBTableHead,
    sortCompare: true,
};

interface TaAnalysisTableProps extends WidgetProps {}

export const TaAnalysisTableWidget: Widget<TaAnalysisTableProps> = memo((props: TaAnalysisTableProps) => {
    const { className = '', filters = {} } = props;
    useInjectReducer({ key: taAnalysisTableKey, reducer: taAnalysisTableReducer });

    useInjectSaga({ key: taAnalysisTableKey, saga: getAllTaAnalysisTablesSaga });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t, i18n } = useTranslation();

    const taAnalysisTables: TaAnalysisTables | undefined = useSelector(selectTaAnalysisTables);
    const taAnalysisTableIsLoading: boolean = useSelector(selectTaAnalysisTableIsLoading);
    const [sortColumn, setSortColumn] = useState<string>();
    const [order, setOrder] = useState<string>();
    const dispatch = useDispatch();

    const [colGrouping /* setColGrouping */] = useState<string[]>(['deviceNameOutlet']);

    if (props.isLoading) {
        props.isLoading(taAnalysisTableIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        // add your filters here
        fromTime: moment().subtract(9, 'isoWeek').startOf('isoWeek'),
        toTime: moment(),
        ...filters,
    });

    const serviceFilters = useMemo(() => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }), [
        widgetFilters,
        filters,
        i18n.language,
    ]);

    useEffect(() => {
        dispatch(taAnalysisTableActions.getAllTaAnalysisTables(serviceFilters));
    }, [dispatch, serviceFilters]);

    const extraColumns = useMemo(() => {
        const extCol: any = [];
        const strCol: any = [];

        (taAnalysisTables || []).forEach((row: any) => {
            if (+row?.faultCode) {
                extCol.push(row?.faultCode);
            }
            if (!+row?.faultCode) {
                strCol.push(row?.faultCode);
            }
        });

        return _.concat(_.uniq(strCol), _.uniq(extCol));
    }, [taAnalysisTables]);

    const compareFaultCodeVal = (headerFaultCode: string, faultCode: string): boolean => {
        return headerFaultCode === faultCode;
    };

    const tableData: { data: any[][]; yData: any[] } = useMemo(() => {
        const output: { data: any[][]; yData: any[] } = {
            data: [],
            yData: [],
        };
        const firstPass: any[] = _.groupBy(taAnalysisTables, (row) => {
            return colGrouping.map((g) => row[g]).join(',');
        });
        const rows: any[][] = Object.values(firstPass);
        output.data = rows.map((row, i) => {
            const b = _.groupBy(row, (rowData) => {
                let key = [...colGrouping.map((g) => rowData[g])].join(',');
                return key;
            });
            const rowsData: any = Object.values(b);

            const z = rowsData.map((row: any) =>
                row.reduce((a, b) => ({
                    ...b,
                })),
            );

            const { deviceNameOutlet, averageTA, averagemtbf, averagemttr } = z[0];
            const ta = +averageTA.toFixed(2);
            output.yData.push(deviceNameOutlet);
            let finalData = [deviceNameOutlet, ta, averagemtbf, averagemttr];
            extraColumns.forEach((data: any, index: number) => {
                const foundIt = rowsData[0].find((d) => compareFaultCodeVal(data, d.faultCode));

                const { mtbf = 0, mttr = 0 } = foundIt || ({} as any);
                finalData.push({ mtbf, mttr });
            });

            return finalData;
        });
        return output;
    }, [colGrouping, extraColumns, taAnalysisTables]);

    const tableColumns = useMemo(() => {
        const cols: Array<any> = initialColumns.map((c) => ({
            name: t(messages[c.name]) || c.name,
            ...{
                options: { ...c.options, ...filters },
            },
        }));

        const dataCellCol = {
            options: {
                filter: false,
                setCellProps: () => {
                    return {
                        className: `carBody-data-cell carBody-data`,
                    };
                },
                setCellHeaderProps: () => ({
                    className: 'carBody-data-cell-header carBodyHeader-data',
                }),
            },
        };

        const preHandleToggleColumn = (sortSubColumn: string, column: number, cb, order) => {
            setSortColumn(sortSubColumn);
            setOrder(order);
            cb(column, order, sortSubColumn);

            tableData.data.sort((a, b) => {
                switch (sortSubColumn) {
                    case 'all':
                        const ta1 = a[column].TA,
                            ta2 = b[column].TA;
                        return (ta1 - ta2) * (order === 'asc' ? 1 : -1);
                    case 'mtbf':
                        const mtbf1 = a[column].mtbf,
                            mtbf2 = b[column].mtbf;
                        return (mtbf1 - mtbf2) * (order === 'asc' ? 1 : -1);
                    case 'mttr':
                        const mttr1 = a[column].mttr,
                            mttr2 = b[column].mttr;
                        return (mttr1 - mttr2) * (order === 'asc' ? 1 : -1);
                    default:
                        return 0;
                }
            });
        };

        const handleClickCell = (value: any) => {
            if (props.onFilterChange) {
                props.onFilterChange(value);
            }
        };

        const dataColumnsOptions: any = {};

        if (intervalViews.customBodyRender) {
            dataColumnsOptions.customBodyRender = (value, tableMeta, updateValue) =>
                intervalViews.customBodyRender({
                    value,
                    tableMeta,
                    // updateValue,
                    className: 'x-cls-body-cell',
                    colGrouping,
                    sortColumn,
                    handleTableCellClick: (tableMeta: any) => handleClickCell(tableMeta),
                });
        }

        if (intervalViews.customHeadRender) {
            dataColumnsOptions.customHeadRender = (columnMeta, handleToggleColumn, sortOrder) =>
                intervalViews.customHeadRender({
                    columnMeta,
                    handleToggleColumn: (columnName: string, index: number) =>
                        preHandleToggleColumn(columnName, index, handleToggleColumn, sortOrder),
                    sortOrder,
                    // order,
                    className: ' row ',
                    width: intervalViews.colWidth,
                    sortColumn,
                    filters,
                });
        }

        if (intervalViews.sortCompare) {
            dataColumnsOptions.sortCompare = () => (a, b) => {
                switch (sortColumn) {
                    case 'all':
                        const fault1 = a.TA,
                            fault2 = b.TA;
                        return (fault1 - fault2) * (order === 'asc' ? 1 : -1);
                    case 'mtbf':
                        const mtbf1 = a.mtbf,
                            mtbf2 = b.mtbf;
                        return (mtbf1 - mtbf2) * (order === 'asc' ? 1 : -1);
                    case 'mttr':
                        const mttr1 = a.mttr,
                            mttr2 = b.mttr;
                        return (mttr1 - mttr2) * (order === 'asc' ? 1 : -1);
                    default:
                        return 0;
                }
            };
        }

        extraColumns.forEach((data: any, index: number) => {
            let colData = dataCellCol;

            cols.push({
                name: data,
                ...{
                    ...colData,
                    options: { ...colData.options, ...dataColumnsOptions, ...filters },
                },
            });
        });

        return cols;
    }, [extraColumns, t, filters, tableData.data, props, colGrouping, sortColumn, order]);

    const theme = useMemo(() => {
        const obj = {
            MuiTableCell: {
                root: {
                    border: '1.0px solid #525252',
                    backgroundColor: '#000',
                    padding: '0px',
                },
                head: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 42,
                },
                body: {
                    color: '#000',
                },
            },
            MuiButton: {
                text: {
                    color: '#fff',
                },
            },
            MuiPaper: {
                root: {
                    backgroundColor: '#000',
                },
            },
            MuiSvgIcon: {
                root: {
                    color: '#fff',
                },
            },
            MUIDataTableHeadCell: {
                sortActive: {
                    color: '#fff',
                },
                contentWrapper: {
                    margin: 'auto auto',
                    width: 42,
                },
                fixedHeader: { padding: '0px 0px 0px 0px' },
                toolButton: { marginLeft: 'auto', marginRight: 'auto' },
            },
            MUIDataTableBodyCell: {
                stackedCommon: {
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
            },
            MuiTableSortLabel: {
                icon: { color: '#fff' },
                iconDirectionAsc: { color: '#fff !important' },
                iconDirectionDesc: { color: '#fff !important' },
            },
        };
        return createMuiTheme(
            adaptV4Theme({
                overrides: { ...obj },
            }),
        );
    }, []);

    const options: any = useMemo(() => {
        return {
            filter: false,
            pagination: false,
            fixedHeader: true,
            elevation: 5,
            selectableRowsHeader: false,
            responsive: 'vertical',
            search: false,
            download: false,
            print: false,
            viewColumns: false,
            customToolbar: null,
            selectableRows: 'none',
            enableNestedDataAccess: '.',
            confirmFilters: true,
            sort: true,
            textLabels: {
                body: {
                    noMatch: 'Sorry, no records found',
                },
            },
        };
    }, []);

    return tableData.data.length > 0 && !taAnalysisTableIsLoading ? (
        <Table
            className={`${className} x-cls-ta-analysis-widget-table`}
            data={tableData.data}
            columns={tableColumns}
            options={{ ...options }}
            theme={TableTheme.CarBodyRisk}
            themeObj={theme}
            title={`${t(messages.tableTitle)} (%)`}
        />
    ) : (
        <>
            {taAnalysisTableIsLoading && <Loader />}
            {!taAnalysisTableIsLoading && <Loader noData />}
        </>
    );
});

// extra widget properties
const defaultFilters = [
    {
        name: FilterNames.dateRange,
        type: FilterType.Date,
        label: 'Date',
        data: {
            fromTime: moment().subtract(9, 'isoWeek').startOf('isoWeek'),
            toTime: moment(),
            startDatePlaceholder: 'll',
            endDatePlaceholder: 'll',
        } as DateFilterData,
    },
    { name: FilterNames.studType, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    { name: FilterNames.faultCode, type: FilterType.Select, data: { options: [] } as SelectFilterData },
];
export const TaAnalysisTableProperty = Object.assign(
    {},
    {
        defaultFilters: defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 0,
            w: 3,
            h: 3,
            minW: 1,
            minH: 1,
        },
    },
);

export default TaAnalysisTableWidget;

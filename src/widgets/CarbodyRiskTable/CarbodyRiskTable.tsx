/**
 *
 * CarbodyRiskTable
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { carbodyRiskActions, carbodyRiskReducer, carbodyRiskKey } from 'services/carbody-risk/carbody-risk-reducer';
import { CarBodyHeader, CarbodyIDColumnBody, OverallRiskHeader, TableBody, TableHeader } from './components';
import {
    selectCarbodyRisks,
    selectCarbodyRiskIsLoading,
    selectCarbodyTableColumns,
} from 'services/carbody-risk/carbody-risk-selectors';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { getAllCarbodyRisksSaga } from 'services/carbody-risk/sagas/carbody-risk-saga-get-all';
import { Filters, CarbodyRisks, RiskTableHeadValue, SortOrderDirection, CarbodyRisk, FilterNames } from 'models';
import Table from 'components/Table';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';

import 'scss/main.scss';
import './CarbodyRiskTable.scss';

interface CarbodyRiskTableProps extends WidgetProps {}

export const CarbodyRiskTableWidget: Widget<CarbodyRiskTableProps> = memo((props: CarbodyRiskTableProps) => {
    const { className = '', filters = {}, onFilterChange = () => {} } = props;

    useInjectReducer({ key: carbodyRiskKey, reducer: carbodyRiskReducer });
    useInjectSaga({ key: carbodyRiskKey, saga: getAllCarbodyRisksSaga });

    const { t } = useTranslation();

    const [sortColumn, setSortColumn] = useState<{ [key: string]: SortOrderDirection }>({
        carbodyId: SortOrderDirection.ASC,
    });
    const [studIdHighlight, setColumnHighlight] = useState({});
    const [carbodyHighlight, setRowHighlight] = useState({});

    const carbodyRisks: CarbodyRisks | undefined = useSelector(selectCarbodyRisks);
    const carbodyRiskIsLoading: boolean = useSelector(selectCarbodyRiskIsLoading);
    const carbodyRiskColumns: RiskTableHeadValue[] = useSelector(selectCarbodyTableColumns) as RiskTableHeadValue[];

    const dispatch = useDispatch();

    const displayRows = useMemo(() => {
        const rows = [...(carbodyRisks || [])];

        if (rows?.length > 0) {
            const newRow: CarbodyRisk = (carbodyRiskColumns || []).reduce(
                (acc, { studId, risk }) => {
                    acc[studId] = risk;
                    return acc;
                },
                { id: '-1' } as any,
            );
            rows.unshift(newRow);
        }

        return rows;
    }, [carbodyRiskColumns, carbodyRisks]);

    if (props.isLoading) {
        props.isLoading(carbodyRiskIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        [FilterNames.fromTime]: '2021-07-28 04:25:47',
        [FilterNames.toTime]: '2021-07-28 10:25:47',
        [FilterNames.studId]: '',
        [FilterNames.carbodyId]: '',
        [FilterNames.weldId]: '',
        // add your filters here
        ...filters,
    });

    const serviceFilters = useMemo(() => ({ ...widgetFilters, ...filters }), [filters, widgetFilters]);

    useEffect(() => {
        dispatch(carbodyRiskActions.getAllCarbodyRisks(serviceFilters));
    }, [dispatch, serviceFilters]);

    useEffect(() => {
        const id = Object.keys(sortColumn)[0];
        const asc = Object.values(sortColumn)[0];

        if (id) {
            dispatch(carbodyRiskActions.columnSort({ id, asc }));
        }
    }, [dispatch, sortColumn]);

    const handleTableCellClick = (filter: Filters) => {
        const { carBody = '', studId = '' } = filter;
        setRowHighlight(carBody);
        setColumnHighlight(studId);
        onFilterChange(filter);
    };

    const onHeaderClick = (filter: Filters) => {
        const { studId = '' } = filter;
        // TODO: support multiselecting weldID to get graph.
        const weldId = (filter[FilterNames.weldId] ? Array.from(filter[FilterNames.weldId]) : []).join(',');

        setColumnHighlight(studId);
        setRowHighlight({});
        onFilterChange({ ...filters, [FilterNames.studId]: studId, [FilterNames.weldId]: weldId });
    };

    const handleSortClick = (sortWhat: string) => {
        /*
            SortOrderDirection {
                NONE = 0,
                ASC = 1,
                DESC = 2,
            }
        */
        const curDirection = Object.values(sortColumn)[0];
        let sortBy = SortOrderDirection.NONE;
        if (sortWhat in sortColumn) {
            sortBy = curDirection === SortOrderDirection.DESC ? SortOrderDirection.ASC : SortOrderDirection.DESC;
        } else {
            sortBy = Object.values(sortColumn)[0];
        }
        const sort = { [sortWhat]: isNaN(sortBy) ? SortOrderDirection.NONE : sortBy };

        return setSortColumn(sort);
    };

    const tableTheme = useMemo(() => {
        const obj: any = {
            root: {
                '&$disabled': {
                    color: '#ffdb38',
                },
            },
            MuiInputBase: { root: { color: '#fff' } },
            MuiTypography: { body: { color: '#fff' } },
            MuiTable: {
                root: {
                    '&:nth-child(odd)': {
                        background: '#424242',
                    },
                    '&:nth-child(even)': {
                        background: '#424242',
                    },
                },
            },
            MuiToolbar: { gutters: { display: 'none' } },
            MUIDataTableHeadCell: {
                fixedHeader: {
                    background: '#424242',
                    backgroundColor: '#424242',
                },
            },
            MUIDataTableBodyRow: {
                root: {
                    '&:nth-child(odd)': {
                        background: 'initial',
                    },
                    '&:nth-child(even)': {
                        background: 'initial',
                    },
                    backgroundColor: 'initial',
                },
            },
            MuiTableCell: {
                root: {
                    font: 'normal normal normal 18px/60px Open Sans',
                },
                footer: { color: '#fff', backgroundColor: '#424242' },
            },
            MUIDataTableBodyCell: {
                stackedCommon: {
                    color: '#fff',
                    textAlign: 'center',
                },
            },
            MUIDataTableJumpToPage: { root: { color: '#fff' } },
            MuiSelect: { icon: { color: '#fff' } },
            MuiMenuItem: { root: { color: '#fff' } },
        };

        return obj;
    }, []);

    const options = useMemo(
        () => ({
            filterType: 'checkbox',
            elavation: 4,
            enableNestedDataAccess: '.',
            // responsive: 'scrollMaxHeight',
            // responsive: 'sstackedcroll',
            // onRowClick: handleOnRowClick,
            textLabels: {
                body: {
                    noMatch: carbodyRiskIsLoading ? 'Loading data...' : 'Sorry, no matching records found',
                    toolTip: 'Sort',
                    columnHeaderTooltip: (column) => `Sort for ${column.label}`,
                },
            },
        }),
        [carbodyRiskIsLoading],
    );

    const tableColumns = useMemo(() => {
        const cols: any[] = [
            {
                name: 'carBody',
                label: t(messages['carBody']),
                options: {
                    sort: false,
                    customHeadRender: (columnMeta, handleToggleColumn, sortOrder) => {
                        return (
                            <React.Fragment key={`${Math.random()}`}>
                                <CarBodyHeader
                                    {...{ columnMeta, handleToggleColumn, sortOrder: sortColumn }}
                                    handleSortClick={handleSortClick}
                                    blank={false}
                                />
                            </React.Fragment>
                        );
                    },
                    customBodyRender: (value, tableMeta, updateValue) => (
                        <CarbodyIDColumnBody
                            {...{ value, tableMeta }}
                            handleSortClick={handleSortClick}
                            sortOrder={sortColumn}
                        />
                    ),
                    setCellProps: () => ({
                        className: 'cell-content carbodyid-cell',
                    }),
                },
            },

            {
                name: 'total',
                label: t(messages['total']),
                options: {
                    sort: false,
                    customHeadRender: (columnMeta, handleToggleColumn, sortOrder) => (
                        <React.Fragment key={`${Math.random()}`}>
                            <OverallRiskHeader
                                label={t(messages['total'])}
                                {...{ columnMeta, handleToggleColumn, sortOrder: sortColumn }}
                                overallRiskHeadPos={'overallRiskRow'}
                                handleSortClick={(who) => handleSortClick('overallRiskRow')}
                            />
                        </React.Fragment>
                    ),
                    customBodyRender: (value, tableMeta, updateValue) => <TableBody {...{ value, tableMeta }} />,
                    setCellProps: () => ({
                        className: 'cell-content overall-risk-cell',
                    }),
                },
            },
        ];

        // TODO: remove limit 50 columns;
        const numOfColumns = 50;
        // (carbodyRiskColumns || []).slice(0,numOfColumns).forEach(({ studId = '' }: RiskTableHeadValue, index: number) => {

        (carbodyRiskColumns || []).slice(0, numOfColumns).forEach((node: RiskTableHeadValue, index: number) => {
            const { studId = '' } = node;
            cols.push({
                name: `${studId}`,
                label: studId,
                options: {
                    customHeadRender: (columnMeta, handleToggleColumn, sortOrder) => (
                        <TableHeader
                            {...{
                                columnMeta,
                                handleToggleColumn,
                                sortOrder,
                                data: { ...node, studIdHighlight },
                                onHeaderClick,
                            }}
                        />
                    ),
                    customBodyRender: (value, tableMeta, updateValue) => (
                        <TableBody {...{ value, tableMeta, handleTableCellClick, carbodyHighlight, studIdHighlight }} />
                    ),
                    setCellProps: (cellValue) => ({ className: 'cell-content risk-cell' }),
                },
            });
        });

        cols.push({
            label: '',
            name: '',
            options: {
                setCellHeaderProps: () => ({
                    className: 'cell-header extra',
                    style: carbodyRiskColumns?.length > 0 ? {} : { width: '100%' },
                }),
                setCellProps: (cellValue) => ({ className: 'extra-cell-content extra-risk-cell' }),
            },
        }); // add extra column at end to prevent other columns from not using fixed width;

        return cols;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [carbodyRiskColumns, sortColumn, t, studIdHighlight, carbodyHighlight]);

    return (
        <Div className={`${className} x-cls-carbody-risk-table-widget ${!displayRows?.length ? 'empty-table' : ''}`}>
            <Table
                className={`x-cls-carbody-risk-table-widget-table`}
                data={displayRows}
                columns={tableColumns}
                options={options}
                themeObj={tableTheme}
                tableBodyHeight={1555}
                title={
                    <React.Fragment key={`${Math.random()}`}>
                        {displayRows.length > 0 && (
                            <CarBodyHeader
                                {...{ sortOrder: sortColumn }}
                                handleSortClick={handleSortClick}
                                blank={true}
                            />
                        )}
                    </React.Fragment>
                }
            />
        </Div>
    );
});

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    {
        name: FilterNames.studId,
        type: FilterType.Select,
        label: 'Stud Id',
        data: { options: [] } as SelectFilterData,
    },
];

export const CarbodyRiskTableProperty = Object.assign(
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

export default CarbodyRiskTableWidget;

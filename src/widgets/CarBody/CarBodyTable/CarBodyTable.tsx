/**
 *
 * CarBodyTable
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    carBodyTableReducer,
    carBodyTableKey,
    carBodyTableActions,
} from 'services/car-body-table/car-body-table-reducer';
import { getAllCarBodyTablesSaga } from 'services/car-body-table/sagas/car-body-table-saga-get-all';
import {
    selectCarBodyTableIsLoading,
    selectCarBodyTableColumns,
    selectCarBodyTables,
} from 'services/car-body-table/car-body-table-selectors';
import { CarBodyTables, Filters, SortOrderDirection } from 'models';
import Table from 'components/Table';
import {
    TableBody as CBTableBody,
    TableHeader as CBTableHead,
    CarBodyHeader,
    OverallRiskHeader,
    CarbodyIDColumnBody,
} from './components/TableComponents';
import { WidgetProps, Widget } from 'widgets';
import styled from 'styled-components/macro';
import { messages } from './messages';
import * as _ from 'lodash';

import 'scss/main.scss';
import './CarBodyTable.scss';
import Loader from 'components/Loader';
import { RiskTableHeadValue } from 'services/car-body-table';

interface CarBodyTableProps extends WidgetProps {}

export const CarBodyTableWidget: Widget<CarBodyTableProps> = memo((props: CarBodyTableProps) => {
    const { className = '', filters = {} } = props;

    useInjectReducer({ key: carBodyTableKey, reducer: carBodyTableReducer });
    useInjectSaga({ key: carBodyTableKey, saga: getAllCarBodyTablesSaga });

    const { t } = useTranslation();

    const carBodyTables: CarBodyTables | undefined = useSelector(selectCarBodyTables);
    const eColumns = useSelector(selectCarBodyTableColumns);

    const carBodyTableIsLoading: boolean = useSelector(selectCarBodyTableIsLoading);
    const dispatch = useDispatch();

    const [sortColumn, setSortColumn] = useState<{ [key: string]: SortOrderDirection }>({
        carbodyId: SortOrderDirection.ASC,
    });

    if (props.isLoading) {
        props.isLoading(carBodyTableIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        fromTime: '2018-11-20+00:00:00',
        toTime: '2018-11-20+23:00:00',
        // add your filters here
        ...filters,
    });

    useEffect(() => {
        dispatch(carBodyTableActions.getAllCarBodyTables(widgetFilters));
    }, [dispatch, widgetFilters]);

    useEffect(() => {
        const id = Object.keys(sortColumn)[0];
        const asc = Object.values(sortColumn)[0];

        if (id) {
            dispatch(carBodyTableActions.columnSort({ id, asc }));
        }
    }, [dispatch, sortColumn]);

    const handleSortClick = (sortWhat: string) => {
        /*
            SortOrderDirection {
                NONE = 0,
                ASC = 1,
                DESC = 2,
            }
        */
        let sortBy = SortOrderDirection.NONE;
        if (sortWhat in sortColumn) {
            sortBy = (sortColumn[sortWhat] + 1) % 3;
        } else {
            sortBy = Object.values(sortColumn)[0];
        }
        const sort = { [sortWhat]: isNaN(sortBy) ? SortOrderDirection.NONE : sortBy };

        return setSortColumn(sort);
    };

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
                                {...{ columnMeta, handleToggleColumn, sortOrder: sortColumn }}
                                overallRiskHeadPos={'overallRiskRow'}
                                handleSortClick={(who) => handleSortClick('overallRiskRow')}
                            />
                        </React.Fragment>
                    ),
                    customBodyRender: (value, tableMeta, updateValue) => <CBTableBody {...{ value, tableMeta }} />,

                    setCellProps: () => ({
                        className: 'cell-content overall-risk-cell',
                    }),
                },
            },
        ];

        (eColumns || []).forEach(({ studId = '' }: RiskTableHeadValue, index: number) => {
            cols.push({
                name: `${studId}`,
                label: studId,
                options: {
                    customHeadRender: (columnMeta, handleToggleColumn, sortOrder) => (
                        <CBTableHead {...{ columnMeta, handleToggleColumn, sortOrder }} />
                    ),
                    customBodyRender: (value, tableMeta, updateValue) => <CBTableBody {...{ value, tableMeta }} />,
                    setCellProps: (cellValue) => ({
                        className: 'cell-content risk-cell',
                    }),
                },
            });
        });

        cols.push({ label: '', name: '' }); // add extra column at end to prevent other columns from not using fixed width;

        return cols;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eColumns, sortColumn, t]);

    const tableOptions: any = useMemo(() => {
        return _.merge({
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
            // selectableRowsHideCheckboxes: true,
            // filterType: 'none',
            // ...options,
        });
    }, []);

    // add extra row at the top for Overall Risk
    let carBodyAnalysisData: any[] = [...(carBodyTables || [])];

    if (carBodyAnalysisData?.length > 0) {
        const newRow = (eColumns || []).reduce((acc, { studId, risk }) => {
            acc[studId] = risk;
            return acc;
        }, {});
        carBodyAnalysisData.unshift(newRow);
    }

    return !carBodyTableIsLoading || (carBodyTables || []).length > 0 ? (
        <Div className={`${className} x-cls-car-body-analysis-widget-table`}>
            <Table
                className={`x-cls-car-body-analysis-table`}
                data={carBodyAnalysisData || []}
                columns={tableColumns}
                options={tableOptions}
            />
        </Div>
    ) : (
        <Loader />
    );
});

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
*/
];
export const CarBodyTableProperty = Object.assign(
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

export default CarBodyTableWidget;

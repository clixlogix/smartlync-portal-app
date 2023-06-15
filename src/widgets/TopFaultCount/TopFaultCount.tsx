/**
 *
 * TopFaultCount
 *
 */

import Loader from 'components/Loader';
import moment from 'moment';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTopFaultCountsSaga } from 'services/top-fault-count/sagas/top-fault-count-saga-get-all';
import {
    topFaultCountActions,
    topFaultCountKey,
    topFaultCountReducer,
} from 'services/top-fault-count/top-fault-count-reducer';
import {
    selectTopFaultCountIsLoading,
    selectTopFaultCounts,
    selectTopFaultCountsColumns,
} from 'services/top-fault-count/top-fault-count-selectors';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import SquareIcon from '@mui/icons-material/Square';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import Table from 'components/Table';
import { FilterNames, Filters } from 'models';
import { WidgetProps } from 'widgets';
import { TableBody as WeeklyTableBody, TableHeader as WeeklyTableHead } from './components/weekly';
import { columns as initialColumns } from './deviceColumns';
import { messages } from './messages';

import 'scss/main.scss';
import { Box } from '@mui/material';

interface TopFaultCountProps extends WidgetProps {
    localFilters: Filters;
}

const intervalViews = {
    fn: 'week',
    colWidth: 110,
    threshold: { mtbf: 20 },
    customBodyRender: WeeklyTableBody,
    customHeadRender: WeeklyTableHead,
    sortCompare: true,
};

export const TopFaultCount: React.FC<TopFaultCountProps> = memo((props: TopFaultCountProps) => {
    const { filters = {} } = props;
    useInjectReducer({ key: topFaultCountKey, reducer: topFaultCountReducer });

    useInjectSaga({ key: topFaultCountKey, saga: getAllTopFaultCountsSaga });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t, i18n } = useTranslation();

    const topFaultCounts: any = useSelector(selectTopFaultCounts);
    const topFaultCountIsLoading: boolean = useSelector(selectTopFaultCountIsLoading);
    const dispatch = useDispatch();
    const [colGrouping /* setColGrouping */] = useState<string[]>(['deviceName']);
    const [sortColumn, setSortColumn] = useState<string>();
    const [order, setOrder] = useState<string>();

    if (props.isLoading) {
        props.isLoading(topFaultCountIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        // add your filters here
        ...filters,
    });

    const serviceFilters = useMemo(() => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }), [
        widgetFilters,
        filters,
        i18n.language,
    ]);

    useEffect(() => {
        dispatch(topFaultCountActions.getAllTopFaultCounts(serviceFilters));
    }, [dispatch, serviceFilters]);

    const extraColumns: any = useSelector(selectTopFaultCountsColumns);

    const tableColumns = useMemo(() => {
        const cols: Array<any> = initialColumns.map((c) => ({ ...c, label: t(messages[c.label]), name: c.name }));

        const dataCellCol = {
            options: {
                filter: false,
                sortThirdClickReset: true,
            },
        };

        const preHandleToggleColumn = (sortSubColumn: string, column: number, cb, order) => {
            setSortColumn(sortSubColumn);
            cb(column, order, sortSubColumn);
        };

        const dataColumnsOptions: any = {
            sortThirdClickReset: true,
        };

        const BodyCell = intervalViews.customBodyRender;

        dataColumnsOptions.customBodyRender = (value, tableMeta, updateValue) => (
            <BodyCell
                value={value}
                tableMeta={tableMeta}
                threshold={intervalViews.threshold}
                className={''}
                colGrouping={colGrouping}
                sortColumn={sortColumn}
            />
        );

        const HeadCell = intervalViews.customHeadRender;

        dataColumnsOptions.customHeadRender = (columnMeta, handleToggleColumn, sortOrder) => (
            <React.Fragment key={`${Math.random()}`}>
                <HeadCell
                    columnMeta={columnMeta}
                    handleToggleColumn={(columnName: string, index: number) =>
                        preHandleToggleColumn(columnName, index, handleToggleColumn, sortOrder)
                    }
                    sortOrder={sortOrder}
                    order={order}
                    className={'  '}
                    sortColumn={sortColumn}
                />
            </React.Fragment>
        );

        if (intervalViews.sortCompare) {
            dataColumnsOptions.sortCompare = (order) => (a, b) => {
                setOrder(order);
                switch (sortColumn) {
                    case 'all':
                        const data1 = a?.data,
                            data2 = b?.data;
                        return (data1 - data2) * (order === 'asc' ? 1 : -1);
                    default:
                        return 0;
                }
            };
        }

        extraColumns.forEach((data: any, index: number) => {
            let colData = dataCellCol;

            cols.push({
                name: data.faultCode,
                ...{
                    ...colData,
                    options: {
                        ...colData.options,
                        ...dataColumnsOptions,
                        description: data.description,
                        sortThirdClickReset: true,
                    },
                },
            });
        });

        return cols;
    }, [colGrouping, extraColumns, order, sortColumn, t]);

    const options: any = useMemo(() => {
        const height = 600;
        let params: any = {
            pagination: false,
            tableBodyHeight: height - 100,
        };

        return {
            filter: false,
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
            confirmFilters: true,
            sort: true,
            sortThirdClickReset: true,
            textLabels: {
                body: {
                    noMatch: 'Sorry, no records found',
                },
            },
            ...params,
        };
    }, []);

    return extraColumns.length > 0 ? (
        <>
            <Box>
                <Stack
                    direction="row"
                    divider={<Divider sx={{ background: '#333' }} orientation="vertical" flexItem />}
                    spacing={2}
                >
                    <Stack direction="row" spacing={1}>
                        <SquareIcon sx={{ color: 'red' }} />
                        <Typography variant="body1" sx={{ color: 'white' }}>
                            {'50 and above'}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <SquareIcon sx={{ color: 'orange' }} />
                        <Typography variant="body1" sx={{ color: 'white' }}>
                            {'25-49'}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <SquareIcon sx={{ color: 'rgb(189, 189, 23)' }} />
                        <Typography variant="body1" sx={{ color: 'white' }}>
                            {'15-24'}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <SquareIcon sx={{ color: 'green' }} />
                        <Typography variant="body1" sx={{ color: 'white' }}>
                            {'14 and below'}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
            <Table
                className={`x-cls-top-fault-count-widget-table maximize-widget`}
                data={topFaultCounts}
                columns={tableColumns}
                options={{ ...options }}
                tableBodyHeight={window.innerHeight - 280}
            />
        </>
    ) : (
        <>
            {topFaultCountIsLoading && <Loader circle />}
            {!topFaultCountIsLoading && <Loader noData />}
        </>
    );
});

// extra widget properties
const defaultFilters = [
    {
        name: FilterNames.eventType,
        type: FilterType.Select,
        data: {
            options: [
                'Filters.Fault',
                'Filters.Warning',
                'Filters.Componentexchange',
                'Filters.FirmwareUpdate',
                'Filters.Info',
                'Filters.Maintenance',
            ],
        } as SelectFilterData,
    },
    {
        name: FilterNames.faultCode,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.studType,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.deviceName,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
];
export const TopFaultCountProperty = Object.assign(
    {},
    {
        defaultFilters: defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 0,
            w: 4,
            h: 4,
            minW: 1,
            minH: 1,
        },
    },
);

export default TopFaultCount;

/**
 *
 * TtrTable
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { ttrTableActions, ttrTableReducer, ttrTableKey } from 'services/ttr-table/ttr-table-reducer';
import { selectTtrTables, selectTtrTableIsLoading, selectTtrColumns } from 'services/ttr-table/ttr-table-selectors';

import { getAllTtrTablesSaga } from 'services/ttr-table/sagas/ttr-table-saga-get-all';
import { selectFixedRanges } from 'services/fixed-range/fixed-range-selectors';
import { Filters, FilterNames, HeadType, TtrTables } from 'models';
import { GridTable } from 'components/GridTable';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { columns as initialColumns } from './ttrAnalysisColumn';
import moment from 'moment';
import Loader from 'components/Loader';
import replace from 'lodash/replace';
import upperFirst from 'lodash/upperFirst';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import { getKeyByValue } from 'utils/index';
import { messages } from './messages';
import { Box } from '@mui/material';
import indexOf from 'lodash/indexOf';

interface TtrTableProps extends WidgetProps {
    onFilterChange?(filter: Filters);
}

export const TtrTableWidget: Widget<TtrTableProps> = memo((props: TtrTableProps) => {
    const { filters = {}, onFilterChange = () => {} } = props;
    useInjectReducer({ key: ttrTableKey, reducer: ttrTableReducer });

    useInjectSaga({ key: ttrTableKey, saga: getAllTtrTablesSaga });

    const { t, i18n } = useTranslation();

    const ttrTables: TtrTables | undefined = useSelector(selectTtrTables);
    const ttrTableIsLoading: boolean = useSelector(selectTtrTableIsLoading);
    // const newOptions: any = useSelector(selectFixedRanges);
    // const initialFromWeek = moment().clone().subtract(9, 'isoWeek').startOf('isoWeek').format('YYYYWW');

    const eColumns = useSelector(selectTtrColumns);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(ttrTableIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        [FilterNames.carTypeId]: '0',
        // add your filters here
        ...filters,
        [FilterNames.groupBy]: 'outlet',
    });
    const serviceFilters = useMemo(
        () => ({
            [FilterNames.langCode]: i18n.language,
            ...widgetFilters,
            ...filters,
            groupBy: filters.groupBy === '' ? widgetFilters.groupBy : filters.groupBy,
        }),
        [widgetFilters, filters, i18n.language],
    );
    useEffect(
        () => {
            onFilterChange({
                ...serviceFilters,
                [FilterNames.toTime]: serviceFilters.toTime,
                [FilterNames.fromTime]: serviceFilters.fromTime,
                [FilterNames.groupBy]: serviceFilters.groupBy || 'outlet',
                [FilterNames.systemFaults]:
                    serviceFilters.groupBy === 'outlet' ? serviceFilters.systemFaults : undefined,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [serviceFilters.groupBy, serviceFilters.toTime, serviceFilters.fromTime],
    );

    useEffect(() => {
        const filter = omitBy(
            {
                [FilterNames.carType]: serviceFilters.carType,
                [FilterNames.fromTime]: serviceFilters.fromTime,
                [FilterNames.toTime]: serviceFilters.toTime,
                [FilterNames.langCode]: serviceFilters.langCode,
                [FilterNames.plantId]: serviceFilters.plantId,
                [FilterNames.systemType]: serviceFilters.systemType,
                [FilterNames.deviceLine]: serviceFilters.subLine,
                [FilterNames.groupBy]: serviceFilters.groupBy,
                [FilterNames.systemFaults]: serviceFilters.systemFaults,
                [FilterNames.deviceName]: serviceFilters.deviceName,
                [FilterNames.station]: serviceFilters.station,
                [FilterNames.headType]:
                    HeadType[serviceFilters.headType] === 'All'
                        ? '1,2'
                        : HeadType[serviceFilters.headType] || undefined,
            },
            isNil,
        );
        dispatch(ttrTableActions.getAllTtrTables(filter));
    }, [
        dispatch,
        serviceFilters.carType,
        serviceFilters.fromTime,
        serviceFilters.toTime,
        serviceFilters.langCode,
        serviceFilters.plantId,
        serviceFilters.systemType,
        serviceFilters.subLine,
        serviceFilters.headType,
        serviceFilters.groupBy,
        serviceFilters.systemFaults,
        serviceFilters.deviceName,
        serviceFilters.station,
    ]);
    const columnsWithLargeHeader = [
        //'outlet',
        //  'Event_Agnostic_Downtime',
        'Exclude_Process_Faults',
        'Exclude_Tolerance_Faults',
    ];

    const tableColumns = useMemo(() => {
        const cols: Array<any> = initialColumns.map((c, index) => ({
            field: index === 0 ? serviceFilters.groupBy : c.name,
            headerName: index === 0 ? upperFirst(replace(`${serviceFilters.groupBy}`, '_', ' ')) : t(messages[c.name]),
            ...c,
            renderCell: (params) => {
                if (serviceFilters.groupBy === 'head_type') {
                    return getKeyByValue(HeadType, params.value);
                }
            },
        }));

        (eColumns || []).forEach((data: any, index: number) => {
            const minWidth = indexOf(columnsWithLargeHeader, data) === -1 ? 0 : 200;
            if (data === 'Event_Agnostic_Downtime') {
                cols.push({
                    field: data,
                    headerName: t(messages[data]),
                    minWidth,
                    type: 'number',
                });
            }
            if (data !== 'Event_Agnostic_Downtime') {
                cols.push({
                    field: data,
                    headerName: data,
                    minWidth,
                    type: 'number',
                });
            }
        });

        return cols;
    }, [columnsWithLargeHeader, eColumns, serviceFilters.groupBy, t]);

    if (ttrTableIsLoading) {
        return <Loader />;
    }

    return (
        <Box sx={{ height: '100%', width: '100%', paddingTop: '10px' }}>
            {(ttrTables || []).length > 0 ? <GridTable tableColumns={tableColumns} tableRows={ttrTables} /> : <></>}
        </Box>
    );
});

// extra widget properties
const defaultFilters = [
    {
        name: FilterNames.groupBy,
        label: 'Filters.GroupBy',
        type: FilterType.Select,
        multiple: false,
        data: { options: ['subline', 'station', 'deviceName', 'outlet', 'head_type'] } as SelectFilterData,
    },
    {
        name: FilterNames.station,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    {
        name: FilterNames.headType,
        type: FilterType.Select,
        label: 'Filters.HeadType',
        data: { options: [...(Array.from(Object.keys(HeadType)) as any)] } as SelectFilterData,
    },
];
export const TtrTableProperty = Object.assign(
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

export default TtrTableWidget;

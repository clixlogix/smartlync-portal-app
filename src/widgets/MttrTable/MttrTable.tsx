/**
 *
 * MttrTable
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { mttrTableActions, mttrTableReducer, mttrTableKey } from 'services/mttr-table/mttr-table-reducer';
import {
    selectMttrTables,
    selectMttrTableIsLoading,
    selectMttrColumns,
} from 'services/mttr-table/mttr-table-selectors';
import { getAllMttrTablesSaga } from 'services/mttr-table/sagas/mttr-table-saga-get-all';
import { selectFixedRanges } from 'services/fixed-range/fixed-range-selectors';
import { Filters, MttrTables, FilterNames, HeadType } from 'models';
import { GridTable } from 'components/GridTable';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { columns as initialColumns } from './mttrAnalysisColumns';
import moment from 'moment';
import Loader from 'components/Loader';
import replace from 'lodash/replace';
import upperFirst from 'lodash/upperFirst';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import { getKeyByValue, getDefaultFilterDate } from 'utils/index';
import { messages } from './messages';
import { Box } from '@mui/material';
import indexOf from 'lodash/indexOf';
import Typography from '@mui/material/Typography';
import { Pages } from 'constants/defaultDateConfig';

interface MttrTableProps extends WidgetProps {
    onFilterChange?(filter: Filters);
}

export const MttrTableWidget: Widget<MttrTableProps> = memo((props: MttrTableProps) => {
    const { filters = {}, onFilterChange = () => {} } = props;
    useInjectReducer({ key: mttrTableKey, reducer: mttrTableReducer });

    useInjectSaga({ key: mttrTableKey, saga: getAllMttrTablesSaga });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t, i18n } = useTranslation();

    const mttrTables: MttrTables | undefined = useSelector(selectMttrTables);

    const mttrTableIsLoading: boolean = useSelector(selectMttrTableIsLoading);
    const newOptions: any = useSelector(selectFixedRanges);
    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.MTTR)), []);
    // const initialFromWeek = moment(START_TIME).subtract(8, 'isoWeek').startOf('isoWeek').format('YYYYWW');
    // const fromTime = moment(START_TIME).subtract(8, 'isoWeek').startOf('isoWeek');
    // const toTime = moment(START_TIME).endOf('day');
    const eColumns = useSelector(selectMttrColumns);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(mttrTableIsLoading);
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
            // weekRange: filters.weekRange === '' ? widgetFilters.weekRange : filters.weekRange,
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
        [serviceFilters.groupBy, serviceFilters.toTime, serviceFilters.fromTime, newOptions],
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
        dispatch(mttrTableActions.getAllMttrTables(filter));
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

        (eColumns || []).forEach((data: any) => {
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

    if (mttrTableIsLoading) {
        return <Loader />;
    }

    return (
        <Box sx={{ height: '100%', width: '100%', paddingTop: '10px' }}>
            <Box sx={{ marginTop: '8px', marginBottom: '8px' }}>
                <Typography>{`Mean Time To Repair (In Minutes)`}</Typography>
            </Box>
            {(mttrTables || []).length > 0 ? (
                <GridTable tableColumns={tableColumns} tableRows={mttrTables} />
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        height: '100%',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="subtitle1" gutterBottom>
                        {t(messages.noData)}
                    </Typography>
                </Box>
            )}
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
export const MttrTableProperty = Object.assign(
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

export default MttrTableWidget;

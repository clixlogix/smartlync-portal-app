/**
 *
 * TaTable
 *
 */

import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { taTableActions, taTableReducer, taTableKey } from 'services/ta-table/ta-table-reducer';
import { selectTaTables, selectTaColumns, selectTaTableIsLoading } from 'services/ta-table/ta-table-selectors';
import { getAllTaTablesSaga } from 'services/ta-table/sagas/ta-table-saga-get-all';
import { selectFixedRanges } from 'services/fixed-range/fixed-range-selectors';
import { Filters, TaTables, FilterNames, HeadType } from 'models';
import { GridTable } from 'components/GridTable';
import {
    // DashboardFilter,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { columns as initialColumns } from './taAnalysisColumns';
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

interface TaTableProps extends WidgetProps {
    onFilterChange?(filter: Filters);
}

export const TaTableWidget: Widget<TaTableProps> = memo((props: TaTableProps) => {
    const { filters = {}, onFilterChange = () => {} } = props;
    useInjectReducer({ key: taTableKey, reducer: taTableReducer });

    useInjectSaga({ key: taTableKey, saga: getAllTaTablesSaga });

    const { t, i18n } = useTranslation();

    const taTables: TaTables | undefined = useSelector(selectTaTables);
    const taTableIsLoading: boolean = useSelector(selectTaTableIsLoading);
    const eColumns = useSelector(selectTaColumns);
    const newOptions: any = useSelector(selectFixedRanges);
    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.TA)), []);
    const fromTime = moment(START_TIME).subtract(8, 'isoWeek').startOf('isoWeek');
    const toTime = moment(START_TIME).endOf('day');
    // const initialFromWeek = moment(START_TIME).subtract(8, 'isoWeek').startOf('isoWeek').format('YYYYWW');

    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(taTableIsLoading);
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
                // [FilterNames.weekRange]: serviceFilters.weekRange,
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
        dispatch(taTableActions.getAllTaTables(filter));
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
            // field: c.name,
            // headerName: t(messages[c.name]),
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
            cols.push({
                field: data,
                headerName: data,
                flex: 1,
                minWidth,
            });
        });

        return cols;
    }, [columnsWithLargeHeader, eColumns, serviceFilters.groupBy, t]);

    if (taTableIsLoading) {
        return <Loader />;
    }

    return (
        <>
            <Box sx={{ height: '100%', width: '100%', paddingTop: '10px' }}>
                <Box sx={{ marginTop: '8px', marginBottom: '8px' }}>
                    <Typography>{`Technical Availability (In %)`}</Typography>
                </Box>
                {(taTables || []).length > 0 ? (
                    <GridTable tableColumns={tableColumns} tableRows={taTables} />
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
        </>
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
export const TaTableProperty = Object.assign(
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

export default TaTableWidget;

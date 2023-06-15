/**
 *
 * MttrTableSpr
 *
 */
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import {
    mttrTableSprActions,
    mttrTableSprKey,
    mttrTableSprReducer,
} from 'services/mttr-table-spr/mttr-table-spr-reducer';
import {
    selectMttrColumns,
    selectMttrTableSprIsLoading,
    selectMttrTableSprs,
} from 'services/mttr-table-spr/mttr-table-spr-selectors';

import { GridTable } from 'components/GridTable';
import Loader from 'components/Loader';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import replace from 'lodash/replace';
import upperFirst from 'lodash/upperFirst';
import { FilterNames, Filters, HeadType, MttrTableSprs } from 'models';
import moment from 'moment';
import { selectFixedRanges } from 'services/fixed-range/fixed-range-selectors';
import { getAllMttrTableSprsSaga } from 'services/mttr-table-spr/sagas/mttr-table-spr-saga-get-all';
import { getKeyByValue, getDefaultFilterDate } from 'utils/index';
import { Widget, WidgetProps } from 'widgets';
import { messages } from './messages';
import { columns as initialColumns } from './mttrAnalysisColumns';
import Typography from '@mui/material/Typography';
import 'scss/main.scss';
import { Box } from '@mui/material';
import indexOf from 'lodash/indexOf';

interface MttrTableSprProps extends WidgetProps {
    onFilterChange?(filter: Filters);
}

export const MttrTableSprWidget: Widget<MttrTableSprProps> = memo((props: MttrTableSprProps) => {
    const { filters = {}, onFilterChange = () => {} } = props;
    useInjectReducer({ key: mttrTableSprKey, reducer: mttrTableSprReducer });
    useInjectSaga({ key: mttrTableSprKey, saga: getAllMttrTableSprsSaga });

    const { t, i18n } = useTranslation();

    const mttrTableSprs: MttrTableSprs | undefined = useSelector(selectMttrTableSprs);
    const mttrTableSprIsLoading: boolean = useSelector(selectMttrTableSprIsLoading);

    const eColumns = useSelector(selectMttrColumns);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(mttrTableSprIsLoading);
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

    // useEffect(
    //     () => {
    //         onFilterChange({
    //             ...serviceFilters,
    //             // [FilterNames.toTime]: serviceFilters.toTime,
    //             // [FilterNames.fromTime]: serviceFilters.fromTime,
    //             [FilterNames.groupBy]: serviceFilters.groupBy || 'outlet',
    //             [FilterNames.systemFaults]:
    //                 serviceFilters.groupBy === 'outlet' ? serviceFilters.systemFaults : undefined,
    //         });
    //     },
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     [serviceFilters.groupBy, serviceFilters.toTime, serviceFilters.fromTime],
    // );

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
        dispatch(mttrTableSprActions.getAllMttrTableSprs(filter));
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

    if (mttrTableSprIsLoading) {
        return <Loader />;
    }

    return (
        <Box sx={{ height: '100%', width: '100%', paddingTop: '10px' }}>
            <Box sx={{ marginTop: '8px', marginBottom: '8px' }}>
                <Typography>{`Mean Time To Repair (In Minutes)`}</Typography>
            </Box>
            {(mttrTableSprs || []).length > 0 ? (
                <GridTable tableColumns={tableColumns} tableRows={mttrTableSprs} />
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
        data: { options: ['subline', 'station', 'deviceName', 'outlet'] } as SelectFilterData,
    },
    {
        name: FilterNames.station,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
];
export const MttrTableSprProperty = Object.assign(
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

export default MttrTableSprWidget;

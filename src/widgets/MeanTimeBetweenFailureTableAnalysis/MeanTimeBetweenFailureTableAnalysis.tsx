/**
 *
 * MeanTimeBetweenFailureTableAnalysis
 *
 */
import GridTable from 'components/GridTable';
import Loader from 'components/Loader';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import replace from 'lodash/replace';
import upperFirst from 'lodash/upperFirst';
import { FilterNames, Filters, HeadType } from 'models';
import moment from 'moment';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { selectFixedRanges } from 'services/fixed-range/fixed-range-selectors';
import {
    mtbfAnalysisTableActions,
    mtbfAnalysisTableKey,
    mtbfAnalysisTableReducer,
} from 'services/mtbf-analysis-table/mtbf-analysis-table-reducer';
import {
    selectMtbfAnalysisTableIsLoading,
    selectMtbfAnalysisTables,
    selectMtbfColumns,
} from 'services/mtbf-analysis-table/mtbf-analysis-table-selectors';
import { getAllMtbfAnalysisTablesSaga } from 'services/mtbf-analysis-table/sagas/mtbf-analysis-table-saga-get-all';
import { getKeyByValue, getDefaultFilterDate } from 'utils/index';
import { Widget, WidgetProps } from 'widgets';
import { columns as initialColumns } from './Columns';
import { messages } from './messages';
import { Box } from '@mui/material';
import indexOf from 'lodash/indexOf';
import Typography from '@mui/material/Typography';
import { Pages } from 'constants/defaultDateConfig';

interface MeanTimeBetweenFailureTableAnalysisProps extends WidgetProps {
    onFilterChange?(filter: Filters);
}

export const MeanTimeBetweenFailureTableAnalysisWidget: Widget<MeanTimeBetweenFailureTableAnalysisProps> = memo(
    (props: MeanTimeBetweenFailureTableAnalysisProps) => {
        const { filters = {}, onFilterChange = () => {} } = props;
        const dispatch = useDispatch();
        useInjectReducer({ key: mtbfAnalysisTableKey, reducer: mtbfAnalysisTableReducer });
        useInjectSaga({ key: mtbfAnalysisTableKey, saga: getAllMtbfAnalysisTablesSaga });

        const { t, i18n } = useTranslation();

        const mtbfData: any = useSelector(selectMtbfAnalysisTables) || [];
        const eColumns = useSelector(selectMtbfColumns);
        const mtbfAnalysisTableIsLoading: boolean = useSelector(selectMtbfAnalysisTableIsLoading);
        // const newOptions: any = useSelector(selectFixedRanges);

        if (props.isLoading) {
            props.isLoading(mtbfAnalysisTableIsLoading);
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
            dispatch(mtbfAnalysisTableActions.getAllMtbfAnalysisTables(filter));
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
                headerName:
                    index === 0 ? upperFirst(replace(`${serviceFilters.groupBy}`, '_', ' ')) : t(messages[c.name]),
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

        if (mtbfAnalysisTableIsLoading) {
            return <Loader />;
        }

        return (
            <Box sx={{ height: '100%', width: '100%', paddingTop: '10px' }}>
                <Box sx={{ marginTop: '8px', marginBottom: '8px' }}>
                    <Typography>{`Mean Time Between Failures (In Hours)`}</Typography>
                </Box>
                {(mtbfData || []).length > 0 ? (
                    <GridTable tableColumns={tableColumns} tableRows={mtbfData} />
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
    },
);

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
export const MeanTimeBetweenFailureTableAnalysisProperty = Object.assign(
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

export default MeanTimeBetweenFailureTableAnalysisWidget;

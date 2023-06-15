/**
 *
 * PlantCycleAverages
 *
 */
import React, { useState, memo, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import Card from '@mui/material/Card';
import { FilterNames, Filters, PlantCycleAveragesCardName, ReportingDataView, CarTypes } from 'models';
import {
    totalWeeklyAveragesReducer,
    totalWeeklyAverageKey,
    totalWeeklyAveragesActions,
} from 'services/plant-overview/total-weekly-average/total-weekly-average-reducer';
import {
    selectTotalWeeklyAverages,
    selectTotalWeeklyAverageIsLoading,
} from 'services/plant-overview/total-weekly-average/total-weekly-average-selectors';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { getAllTotalWeeklyAveragesSaga } from 'services/plant-overview/total-weekly-average/sagas/total-weekly-average-saga-get-all';
import { CycleAveragesCard } from './components';
import { WidgetProps, Widget } from 'widgets';
import { useQueryParam } from 'utils';
import moment from 'moment';
import 'scss/main.scss';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import { messages } from './messages';
interface PlantCycleAveragesProps extends WidgetProps {
    showCard?: PlantCycleAveragesCardName[];
    onFilterChange?: any;
}

export const PlantCycleAveragesWidget: Widget<PlantCycleAveragesProps> = memo((props: PlantCycleAveragesProps) => {
    useInjectReducer({ key: totalWeeklyAverageKey, reducer: totalWeeklyAveragesReducer });
    useInjectSaga({ key: totalWeeklyAverageKey, saga: getAllTotalWeeklyAveragesSaga });

    const {
        // showCard = [PlantCycleAveragesCardName.TA, PlantCycleAveragesCardName.MTBF, PlantCycleAveragesCardName.MTTR],
        filters,
        onFilterChange = () => {},
    } = props;

    const { t, i18n } = useTranslation();
    const [plantId] = useQueryParam<string>(FilterNames.plantId, '1', true);
    const dispatch = useDispatch();

    const weeklyAverages: any = useSelector(selectTotalWeeklyAverages) || [];

    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };
    const isLoading: boolean = useSelector(selectTotalWeeklyAverageIsLoading);

    if (props.isLoading) {
        props.isLoading(isLoading);
    }

    const [widgetFilters] = useState<Filters>({
        ...filters,
        [FilterNames.view]: ReportingDataView.Weekly,
        [FilterNames.plantId]: plantId,
        // add your default filters for this page here ...
        [FilterNames.fromTime]: moment(filters?.toTime).subtract(8, 'isoWeek').startOf('isoWeek'),
    });

    const serviceFilters = useMemo(
        () => ({
            [FilterNames.langCode]: i18n.language,
            ...widgetFilters,
            ...filters,
        }),
        [filters, i18n.language, widgetFilters],
    );

    useEffect(
        () => {
            onFilterChange({
                ...serviceFilters,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(() => {
        const filter = { ...serviceFilters, [FilterNames.carType]: serviceFilters.carType, ...filters };
        dispatch(totalWeeklyAveragesActions.getAllTotalWeeklyAverages({ filter, carTypes }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, serviceFilters.carType, filters]);

    return (
        <Box sx={{ flex: 1, minHeight: '300px', display: 'flex', flexFlow: 'column nowrap' }}>
            <Card sx={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ flex: 1 }}>
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                padding: '10px',
                                flex: 1,
                                marginLeft: '7px',
                                marginBottom: ' 10px',
                            }}
                        >
                            {!isLoading ? (
                                weeklyAverages.length > 0 ? (
                                    weeklyAverages?.map((data, index) => (
                                        <CycleAveragesCard
                                            key={`key-averages-card-${index}`}
                                            data={data}
                                            carType={serviceFilters.carType}
                                        />
                                    ))
                                ) : (
                                    <Typography
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '255px',
                                            width: '100%',
                                        }}
                                    >
                                        {t(messages.noData)}
                                    </Typography>
                                )
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '255px',
                                        width: '100%',
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
});

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
*/
];
export const PlantCycleAveragesProperty = Object.assign(
    {},
    {
        defaultFilters: defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 0,
            w: 1,
            h: 2,
            minW: 1,
            minH: 1,
        },
    },
);

export default PlantCycleAveragesWidget;

/**
 *
 * PlantCycleAverages
 *
 */
import React, { useState, memo, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import styled from 'styled-components/macro';
import Card from '@mui/material/Card';
import { FilterNames, Filters, PlantCycleAveragesCardName, ReportingDataView, CarTypes } from 'models';
import {
    plantCycleAveragesWidgetSprActions,
    plantCycleAveragesWidgetSprReducer,
    plantCycleAveragesWidgetSprKey,
} from 'services/SPR/plant-cycle-averages-widget-spr/plant-cycle-averages-widget-spr-reducer';
import {
    selectPlantCycleAveragesWidgetSprs,
    selectPlantCycleAveragesWidgetSprIsLoading,
} from 'services/SPR/plant-cycle-averages-widget-spr/plant-cycle-averages-widget-spr-selectors';
import CircularProgress from '@mui/material/CircularProgress';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { getAllPlantCycleAveragesWidgetSprsSaga } from 'services/SPR/plant-cycle-averages-widget-spr/sagas/plant-cycle-averages-widget-spr-saga-get-all';
import { CycleAveragesCardSPR } from './components';
import { WidgetProps, Widget } from 'widgets';
import { useQueryParam } from 'utils';
import moment from 'moment';
import { messages } from './messages';
import 'scss/main.scss';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
// import { CustomChip } from 'components/CustomChip';

interface PlantCycleAveragesProps extends WidgetProps {
    showCard?: PlantCycleAveragesCardName[];
    onFilterChange?: any;
}

export const PlantCycleAveragesWidgetSprWidget: Widget<PlantCycleAveragesProps> = memo(
    (props: PlantCycleAveragesProps) => {
        useInjectReducer({ key: plantCycleAveragesWidgetSprKey, reducer: plantCycleAveragesWidgetSprReducer });
        useInjectSaga({ key: plantCycleAveragesWidgetSprKey, saga: getAllPlantCycleAveragesWidgetSprsSaga });

        const { filters, onFilterChange = () => {} } = props;

        const { t, i18n } = useTranslation();
        const [plantId] = useQueryParam<string>(FilterNames.plantId, '1', true);
        const dispatch = useDispatch();

        const weeklyAverages = useSelector(selectPlantCycleAveragesWidgetSprs) || [];

        const isLoading: boolean = useSelector(selectPlantCycleAveragesWidgetSprIsLoading);

        const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };
        if (props.isLoading) {
            props.isLoading(isLoading);
        }

        const [widgetFilters] = useState<Filters>({
            ...filters,
            [FilterNames.view]: ReportingDataView.Weekly,
            [FilterNames.plantId]: plantId,
            [FilterNames.langCode]: [i18n.language],
            // add your filters here
        });

        const serviceFilters = useMemo(
            () => ({
                [FilterNames.langCode]: i18n.language,
                ...widgetFilters,
                ...filters,
            }),
            [filters, i18n.language, widgetFilters],
        );

        useEffect(() => {
            const filter = { ...serviceFilters, [FilterNames.carType]: serviceFilters.carType, ...filters };
            dispatch(plantCycleAveragesWidgetSprActions.getAllPlantCycleAveragesWidgetSprs({ filter, carTypes }));
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [dispatch, serviceFilters.carType, filters]);

        return (
            <Box sx={{ flex: 1, minHeight: '300px', display: 'flex', flexFlow: 'column nowrap' }}>
                <Card
                    sx={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
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
                                            <CycleAveragesCardSPR
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
    },
);

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    /*
     { name: 'deviceName', type: FilterType.Select, label: 'Device' },
     { name: 'deviceType', type: FilterType.Select, label: 'Type' },
 */
];
export const PlantCycleAveragesWidgetSprProperty = Object.assign(
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

export default PlantCycleAveragesWidgetSprWidget;

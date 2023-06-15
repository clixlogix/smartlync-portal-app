/**
 *
 * PlantDeviceByDuration
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    plantDeviceByDurationActions,
    plantDeviceByDurationReducer,
    plantDeviceByDurationKey,
} from 'services/plant-device-by-duration/plant-device-by-duration-reducer';
import {
    selectPlantDeviceByDurations,
    selectPlantDeviceByDurationIsLoading,
} from 'services/plant-device-by-duration/plant-device-by-duration-selectors';
import { getAllPlantDeviceByDurationsSaga } from 'services/plant-device-by-duration/sagas/plant-device-by-duration-saga-get-all';
import { FilterNames, Filters, PlantDeviceByDurations, ReportingDataView, RouteTo } from 'models';
import { TopXTable } from 'components/panels';
import { Clickable } from 'components/Clickable';
import { PositionArrow } from 'components/cards';
import { TableTheme } from 'components/Table/Table';
import { useQueryParam } from 'utils';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';
import LaunchIcon from '@mui/icons-material/Launch';
import { ToggleOffOutlined, ToggleOnOutlined } from '@mui/icons-material';

import 'scss/main.scss';
import { SystemType } from 'constants/staticValues';
import { Box } from '@mui/material';
interface PlantDeviceByDurationProps extends WidgetProps {
    topX?: number;
    numberOfTable?: number;
}

export const PlantDeviceByDurationWidget: Widget<PlantDeviceByDurationProps> = memo(
    (props: PlantDeviceByDurationProps) => {
        const { filters = {}, topX = 10, numberOfTable = 1 } = props;
        useInjectReducer({ key: plantDeviceByDurationKey, reducer: plantDeviceByDurationReducer });
        useInjectSaga({ key: plantDeviceByDurationKey, saga: getAllPlantDeviceByDurationsSaga });

        const [treeView, setTreeView] = useState(false);
        const { t, i18n } = useTranslation();
        const [plantId] = useQueryParam<string>(FilterNames.plantId, '1');
        const plantDeviceByDurations: PlantDeviceByDurations | undefined = useSelector(selectPlantDeviceByDurations);
        const plantDeviceByDurationIsLoading: boolean = useSelector(selectPlantDeviceByDurationIsLoading);
        const dispatch = useDispatch();

        const displayRows = useMemo(() => {
            return plantDeviceByDurations || []; // .filter((row) => !row.hidden);
        }, [plantDeviceByDurations]);

        if (props.isLoading) {
            props.isLoading(plantDeviceByDurationIsLoading);
        }

        const [widgetFilters] = useState<Filters>({
            [FilterNames.plantId]: plantId,
            [FilterNames.view]: ReportingDataView.Weekly,
            // add your default filters for this page here ...
            [FilterNames.systemType]: SystemType.SWS,
            [FilterNames.carTypeId]: '0',
            ...filters,
        });

        const serviceFilters = useMemo(
            () => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }),
            [i18n.language, filters, widgetFilters],
        );

        useEffect(() => {
            if (treeView) {
                // const updatedServiceFilter = Object.fromEntries(
                //     Object.entries(serviceFilters).filter(([key]) => !key.includes('limit')),
                // );
                dispatch(plantDeviceByDurationActions.getAllPlantDeviceByDurations(serviceFilters));
                return;
            }
            dispatch(plantDeviceByDurationActions.getAllPlantDeviceByDurations(serviceFilters));
        }, [dispatch, serviceFilters, widgetFilters, treeView]);

        const faultDurationColumns = [
            {
                name: 'index',
                label: ' ',
                options: {
                    customBodyRender: (value) => {
                        return value + 1 + '.';
                    },
                },
            },
            {
                name: 'deviceName',
                label: t(messages.system),
                options: {
                    customBodyRender: (value) => {
                        return (
                            <Clickable
                                value={value}
                                label={FilterNames.deviceName}
                                params={{ [FilterNames.deviceName]: value }}
                                routeTo={RouteTo.fleetOverview}
                            ></Clickable>
                        );
                    },
                },
            },
            {
                name: 'duration',
                label: t(messages.duration),
            },
            {
                name: 'position',
                label: t(messages.position),
                options: {
                    customBodyRender: (value) => <PositionArrow value={value} />,
                },
            },
            {
                name: 'percentageChange',
                label: t(messages.percentageChange),
                options: {
                    customBodyRender: (value) => <PositionArrow value={value} />,
                },
            },
        ];

        const durationList: string | undefined = plantDeviceByDurations?.map(({ deviceName }) => deviceName).join(',');

        const options = {
            customToolbar: () => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div>
                            {!treeView ? (
                                <ToggleOffOutlined
                                    fontSize="large"
                                    style={{ color: 'primary.main', cursor: 'pointer' }}
                                    onClick={() => setTreeView(true)}
                                />
                            ) : (
                                <ToggleOnOutlined
                                    fontSize="large"
                                    style={{ color: 'primary.main', cursor: 'pointer' }}
                                    onClick={() => setTreeView(false)}
                                />
                            )}
                        </div>
                        <div>
                            <Clickable
                                label={'deviceName'}
                                value={durationList}
                                params={{ [FilterNames.deviceName]: durationList }}
                                routeTo={RouteTo.reportingView}
                            >
                                <LaunchIcon style={{ color: 'primary.main', margin: '5px 0 0 10px' }} />
                            </Clickable>
                        </div>
                    </div>
                );
            },
        };

        return (
            <Box sx={{ height: '355px', minWidth: '645px', display: 'flex' }}>
                <TopXTable
                    title={t(messages.faultByDuration, { topX })}
                    columns={faultDurationColumns}
                    tableData={displayRows}
                    theme={TableTheme.Nine}
                    topX={treeView ? 10000 : topX}
                    numberOfTable={numberOfTable}
                    isLoading={plantDeviceByDurationIsLoading}
                    options={options}
                    treeView={treeView}
                />
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

export const PlantDeviceByDurationProperty = Object.assign(
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

export default PlantDeviceByDurationWidget;

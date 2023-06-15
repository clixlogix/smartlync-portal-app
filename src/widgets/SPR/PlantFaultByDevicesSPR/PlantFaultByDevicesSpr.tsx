/**
 *
 * PlantFaultByDevicesSpr
 *
 */
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
    plantFaultByDevicesSprActions,
    plantFaultByDevicesSprKey,
    plantFaultByDevicesSprReducer,
} from 'services/SPR/plant-fault-by-devices-spr/plant-fault-by-devices-spr-reducer';
import {
    selectPlantFaultByDevicesSprIsLoading,
    selectPlantFaultByDevicesSprs,
} from 'services/SPR/plant-fault-by-devices-spr/plant-fault-by-devices-spr-selectors';
import styled from 'styled-components/macro';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { getAllPlantFaultByDevicesSprsSaga } from 'services/SPR/plant-fault-by-devices-spr/sagas/plant-fault-by-devices-spr-saga-get-all';

import { FilterNames, Filters, PlantFaultByDevicesSprs, ReportingDataView, RouteTo } from 'models';

import LaunchIcon from '@mui/icons-material/Launch';
import { PositionArrow } from 'components/cards';
import { Clickable } from 'components/Clickable';
import { TopXTable } from 'components/panels';
import { TableTheme } from 'components/Table/Table';
import { useQueryParam } from 'utils';
import { Widget, WidgetProps } from 'widgets';
import { messages } from './messages';

import { ToggleOffOutlined, ToggleOnOutlined } from '@mui/icons-material';
import 'scss/main.scss';
import { Box } from '@mui/material';

interface PlantFaultByDevicesSprProps extends WidgetProps {
    topX?: number;
    numberOfTable?: number;
}

export const PlantFaultByDevicesSprWidget: Widget<PlantFaultByDevicesSprProps> = memo(
    (props: PlantFaultByDevicesSprProps) => {
        const { className = '', filters = {}, topX = 10, numberOfTable = 1 } = props;
        useInjectReducer({ key: plantFaultByDevicesSprKey, reducer: plantFaultByDevicesSprReducer });
        useInjectSaga({ key: plantFaultByDevicesSprKey, saga: getAllPlantFaultByDevicesSprsSaga });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        const [plantId] = useQueryParam<string>('plantId', '1', true);

        const [treeView, setTreeView] = useState(false);
        const { t, i18n } = useTranslation();

        const topTenSystemFaults: PlantFaultByDevicesSprs | undefined = useSelector(selectPlantFaultByDevicesSprs);
        const isLoading: boolean = useSelector(selectPlantFaultByDevicesSprIsLoading);
        const dispatch = useDispatch();

        const displayRows = useMemo(() => {
            return topTenSystemFaults || []; // .filter((row) => !row.hidden);
        }, [topTenSystemFaults]);

        if (props.isLoading) {
            props.isLoading(isLoading);
        }

        const [widgetFilters] = useState<Filters>({
            [FilterNames.plantId]: plantId,
            [FilterNames.view]: ReportingDataView.Weekly,
            // add your default filters for this page here ...
            [FilterNames.systemType]: 'SWS',
            ...filters,
        });

        const serviceFilters = useMemo(
            () => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }),
            [widgetFilters, filters, i18n.language],
        );

        useEffect(() => {
            if (treeView) {
                // const updatedServiceFilter = Object.fromEntries(
                //     Object.entries(serviceFilters).filter(([key]) => !key.includes('limit')),
                // );
                dispatch(plantFaultByDevicesSprActions.getAllPlantFaultByDevicesSprs(serviceFilters));
                return;
            }
            dispatch(plantFaultByDevicesSprActions.getAllPlantFaultByDevicesSprs(serviceFilters));
        }, [dispatch, serviceFilters, treeView]);

        const systemFaultColumns = [
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
                name: 'occurrences',
                label: t(messages.fault),
            },
            {
                name: 'faultRatio',
                label: t(messages.ratio),
            },
            {
                name: 'cycleOccurrences',
                label: t(messages.cycle),
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

        const deviceNamesList: string | undefined = topTenSystemFaults?.map(({ deviceName }) => deviceName).join(',');

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
                                value={deviceNamesList}
                                params={{ [FilterNames.deviceName]: deviceNamesList }}
                                routeTo={RouteTo.rca}
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
                    title={t(messages.systemWithFaults, { topX })}
                    columns={systemFaultColumns}
                    tableData={displayRows}
                    theme={TableTheme.Nine}
                    topX={topX}
                    numberOfTable={numberOfTable}
                    isLoading={isLoading}
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
export const PlantFaultByDevicesSprProperty = Object.assign(
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

export default PlantFaultByDevicesSprWidget;

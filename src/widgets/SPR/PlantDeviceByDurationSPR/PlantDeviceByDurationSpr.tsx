/**
 *
 * PlantDeviceByDurationSpr
 *
 */
import { ToggleOffOutlined, ToggleOnOutlined } from '@mui/icons-material';
import LaunchIcon from '@mui/icons-material/Launch';
import { Box } from '@mui/material';
import { PositionArrow } from 'components/cards';
import { Clickable } from 'components/Clickable';
import { TopXTable } from 'components/panels';
import { TableTheme } from 'components/Table/Table';
import { SystemType } from 'constants/staticValues';
import { FilterNames, Filters, PlantDeviceByDurationSprs, ReportingDataView, RouteTo } from 'models';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import 'scss/main.scss';
import {
    plantDeviceByDurationSprActions,
    plantDeviceByDurationSprKey,
    plantDeviceByDurationSprReducer,
} from 'services/SPR/plant-device-by-duration-spr/plant-device-by-duration-spr-reducer';
import {
    selectPlantDeviceByDurationSprIsLoading,
    selectPlantDeviceByDurationSprs,
} from 'services/SPR/plant-device-by-duration-spr/plant-device-by-duration-spr-selectors';
import { getAllPlantDeviceByDurationSprsSaga } from 'services/SPR/plant-device-by-duration-spr/sagas/plant-device-by-duration-spr-saga-get-all';
import styled from 'styled-components/macro';
import { useQueryParam } from 'utils';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Widget, WidgetProps } from 'widgets';
import { messages } from './messages';

interface PlantDeviceByDurationSprProps extends WidgetProps {
    topX?: number;
    numberOfTable?: number;
}
export const PlantDeviceByDurationSprWidget: Widget<PlantDeviceByDurationSprProps> = memo(
    (props: PlantDeviceByDurationSprProps) => {
        const { className = '', filters = {}, topX = 10, numberOfTable = 1 } = props;
        useInjectReducer({ key: plantDeviceByDurationSprKey, reducer: plantDeviceByDurationSprReducer });

        useInjectSaga({ key: plantDeviceByDurationSprKey, saga: getAllPlantDeviceByDurationSprsSaga });
        const [treeView, setTreeView] = useState(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { t, i18n } = useTranslation();
        const [plantId] = useQueryParam<string>(FilterNames.plantId, '1');

        const plantDeviceByDurationSprs: PlantDeviceByDurationSprs | undefined = useSelector(
            selectPlantDeviceByDurationSprs,
        );
        const plantDeviceByDurationSprIsLoading: boolean = useSelector(selectPlantDeviceByDurationSprIsLoading);
        const dispatch = useDispatch();
        const displayRows = useMemo(() => {
            return plantDeviceByDurationSprs || []; // .filter((row) => !row.hidden);
        }, [plantDeviceByDurationSprs]);

        if (props.isLoading) {
            props.isLoading(plantDeviceByDurationSprIsLoading);
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
                dispatch(plantDeviceByDurationSprActions.getAllPlantDeviceByDurationSprs(serviceFilters));
                return;
            }
            dispatch(plantDeviceByDurationSprActions.getAllPlantDeviceByDurationSprs(serviceFilters));
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

        const durationList: string | undefined = plantDeviceByDurationSprs
            ?.map(({ deviceName }) => deviceName)
            .join(',');

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
                    topX={topX}
                    numberOfTable={numberOfTable}
                    isLoading={plantDeviceByDurationSprIsLoading}
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
export const PlantDeviceByDurationSprProperty = Object.assign(
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

export default PlantDeviceByDurationSprWidget;

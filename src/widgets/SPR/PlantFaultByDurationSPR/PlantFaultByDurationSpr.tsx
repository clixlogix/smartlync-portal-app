/**
 *
 * PlantFaultByDuration
 *
 */
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
    plantFaultByDurationSprActions,
    plantFaultByDurationSprKey,
    plantFaultByDurationSprReducer,
} from 'services/SPR/plant-fault-by-duration-spr/plant-fault-by-duration-spr-reducer';
import {
    selectPlantFaultByDurationSprIsLoading,
    selectPlantFaultByDurationSprs,
} from 'services/SPR/plant-fault-by-duration-spr/plant-fault-by-duration-spr-selectors';
import styled from 'styled-components/macro';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { ToggleOffOutlined, ToggleOnOutlined } from '@mui/icons-material';
import LaunchIcon from '@mui/icons-material/Launch';
import { PositionArrow } from 'components/cards';
import { Clickable } from 'components/Clickable';
import { TopXTable } from 'components/panels';
import { TableTheme } from 'components/Table/Table';
import { FilterNames, Filters, ReportingDataView, RouteTo } from 'models';
import 'scss/main.scss';
import { getAllPlantFaultByDurationSprsSaga } from 'services/SPR/plant-fault-by-duration-spr/sagas/plant-fault-by-duration-spr-saga-get-all';
import { useQueryParam } from 'utils';
import { Widget, WidgetProps } from 'widgets';
import { messages } from './messages';
import { Box } from '@mui/material';

interface PlantFaultByDurationProps extends WidgetProps {
    topX?: number;
    numberOfTable?: number;
}

export const PlantFaultByDurationSprWidget: Widget<PlantFaultByDurationProps> = memo(
    (props: PlantFaultByDurationProps) => {
        useInjectReducer({ key: plantFaultByDurationSprKey, reducer: plantFaultByDurationSprReducer });
        useInjectSaga({ key: plantFaultByDurationSprKey, saga: getAllPlantFaultByDurationSprsSaga });

        const { className = '', filters = {}, topX = 10, numberOfTable = 2 } = props;
        const [plantId] = useQueryParam<string>(FilterNames.plantId, '1');
        const { t, i18n } = useTranslation();
        const [treeView, setTreeView] = useState(false);
        const topTenFaultDuration = useSelector(selectPlantFaultByDurationSprs);
        const isLoading: boolean = useSelector(selectPlantFaultByDurationSprIsLoading);
        const dispatch = useDispatch();

        const displayRows = useMemo(() => {
            return topTenFaultDuration || [];
        }, [topTenFaultDuration]);

        if (props.isLoading) {
            props.isLoading(isLoading);
        }

        const [widgetFilters] = useState<Filters>({
            [FilterNames.plantId]: plantId,
            [FilterNames.view]: ReportingDataView.Weekly,
            // add your default filters for this page here ...
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
                dispatch(plantFaultByDurationSprActions.getAllPlantFaultByDurationSprs(serviceFilters));
                return;
            }
            dispatch(plantFaultByDurationSprActions.getAllPlantFaultByDurationSprs(serviceFilters));
        }, [dispatch, serviceFilters, treeView]);

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
                name: 'faultCode',
                label: t(messages.fault),
                options: {
                    customBodyRender: (value) => {
                        return (
                            <Clickable
                                value={value}
                                label={FilterNames.faultCode}
                                params={{ [FilterNames.faultCode]: value }}
                                routeTo={RouteTo.rca}
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

        const durationList: string | undefined = topTenFaultDuration?.map(({ faultCode }) => faultCode).join(',');

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
                                label={'faultCode'}
                                value={durationList}
                                params={{ [FilterNames.eventCode]: durationList }}
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
                    isLoading={isLoading}
                    numberOfTable={numberOfTable}
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
export const PlantFaultByDurationSprProperty = Object.assign(
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

export default PlantFaultByDurationSprWidget;

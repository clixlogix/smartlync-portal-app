/**
 *
 * PlantFaultByDevices
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    systemFaultsActions,
    systemFaultsReducer,
    systemFaultsKey,
} from 'services/plant-overview/system-fault/system-fault-reducer';
import {
    selectSystemFaults,
    selectSystemFaultsIsLoading,
} from 'services/plant-overview/system-fault/system-fault-selectors';
import { getAllSystemFaultsSaga } from 'services/plant-overview/system-fault/system-fault-saga-get-all';
import { FilterNames, Filters, ReportingDataView, RouteTo } from 'models';
import { TableTheme } from 'components/Table/Table';
import { Clickable } from 'components/Clickable';
import { PositionArrow } from 'components/cards';
import { TopXTable } from 'components/panels';
import { useQueryParam } from 'utils';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';
import LaunchIcon from '@mui/icons-material/Launch';
import { ToggleOffOutlined, ToggleOnOutlined } from '@mui/icons-material';

import 'scss/main.scss';
import { Box } from '@mui/material';

interface PlantFaultByDevicesProps extends WidgetProps {
    topX?: number;
    numberOfTable?: number;
}

export const PlantFaultByDevicesWidget: Widget<PlantFaultByDevicesProps> = memo((props: PlantFaultByDevicesProps) => {
    const { className = '', filters = {}, topX = 10, numberOfTable = 1 } = props;
    useInjectReducer({ key: systemFaultsKey, reducer: systemFaultsReducer });
    useInjectSaga({ key: systemFaultsKey, saga: getAllSystemFaultsSaga });

    const [treeView, setTreeView] = useState(false);
    const [plantId] = useQueryParam<string>('plantId', '1', true);
    const { t, i18n } = useTranslation();

    const topTenSystemFaults = useSelector(selectSystemFaults);
    const isLoading: boolean = useSelector(selectSystemFaultsIsLoading);
    const dispatch = useDispatch();

    const displayRows = useMemo(() => {
        return topTenSystemFaults || [];
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

    const serviceFilters = useMemo(() => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }), [
        widgetFilters,
        filters,
        i18n.language,
    ]);

    useEffect(() => {
        if (treeView) {
            // const updatedServiceFilter = Object.fromEntries(
            //     Object.entries(serviceFilters).filter(([key]) => !key.includes('limit')),
            // );
            dispatch(systemFaultsActions.getAllSystemFaults(serviceFilters));
            return;
        }
        dispatch(systemFaultsActions.getAllSystemFaults(serviceFilters));
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
});

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
*/
];
export const PlantFaultByDevicesProperty = Object.assign(
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

export default PlantFaultByDevicesWidget;

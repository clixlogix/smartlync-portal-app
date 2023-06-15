/**
 *
 * PlantFaultByStudType
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    studIdFaultsActions,
    studIdFaultsReducer,
    studIdFaultsKey,
} from 'services/plant-overview/stud-id-fault/stud-id-fault-reducer';
import {
    selectStudIdFaults,
    selectStudIdFaultsIsLoading,
} from 'services/plant-overview/stud-id-fault/stud-id-fault-selectors';
import { getAllStudIdFaultsSaga } from 'services/plant-overview/stud-id-fault/stud-id-fault-saga-get-all';
import { FilterNames, Filters, ReportingDataView, RouteTo } from 'models';
import { TableTheme } from 'components/Table/Table';
import { Clickable } from 'components/Clickable';
import { TopXTable } from 'components/panels';
import { PositionArrow } from 'components/cards';
import { useQueryParam } from 'utils';
import { WidgetProps, Widget } from 'widgets';
import { messages } from './messages';
import LaunchIcon from '@mui/icons-material/Launch';
import { ToggleOffOutlined, ToggleOnOutlined } from '@mui/icons-material';

import 'scss/main.scss';
import { Box } from '@mui/material';

interface PlantFaultByStudTypeProps extends WidgetProps {
    topX?: number;
    numberOfTable?: number;
}

export const PlantFaultByStudTypeWidget: Widget<PlantFaultByStudTypeProps> = memo(
    (props: PlantFaultByStudTypeProps) => {
        useInjectReducer({ key: studIdFaultsKey, reducer: studIdFaultsReducer });
        useInjectSaga({ key: studIdFaultsKey, saga: getAllStudIdFaultsSaga });

        const [treeView, setTreeView] = useState(false);
        const { className = '', filters = {}, topX = 10, numberOfTable = 2 } = props;
        const [plantId] = useQueryParam<string>('plantId', '1', true);
        const { t, i18n } = useTranslation();

        const topTenStudIDFaults = useSelector(selectStudIdFaults);
        const isLoading: boolean = useSelector(selectStudIdFaultsIsLoading);
        const dispatch = useDispatch();

        const displayRows = useMemo(() => {
            return topTenStudIDFaults || [];
        }, [topTenStudIDFaults]);

        if (props.isLoading) {
            props.isLoading(isLoading);
        }

        const [widgetFilters] = useState<Filters>({
            [FilterNames.plantId]: plantId,
            [FilterNames.view]: ReportingDataView.Weekly,
            // add your default filters for this page here ...
            [FilterNames.systemType]: 'SWS',
        });

        const serviceFilters = useMemo(
            () => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }),
            [widgetFilters, i18n.language, filters],
        );

        useEffect(() => {
            if (treeView) {
                // const updatedServiceFilter = Object.fromEntries(
                //     Object.entries(serviceFilters).filter(([key]) => !key.includes('limit')),
                // );
                dispatch(studIdFaultsActions.getAllStudIdFaults(serviceFilters));
                return;
            }
            dispatch(studIdFaultsActions.getAllStudIdFaults(serviceFilters));
        }, [dispatch, serviceFilters, treeView]);

        const studTypeFaultColumns = [
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
                name: 'studType',
                label: t(messages.studType),
                options: {
                    customBodyRender: (value) => {
                        return (
                            <Clickable
                                value={value}
                                label={FilterNames.studType}
                                params={{ [FilterNames.studType]: value }}
                                routeTo={RouteTo.rca}
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

        const studTypesList: string | undefined = topTenStudIDFaults?.map(({ studType }) => studType).join(',');

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
                                label={'studType'}
                                value={studTypesList}
                                params={{ [FilterNames.studType]: studTypesList }}
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
                    title={t(messages.studTypeWithFaults, { topX })}
                    columns={studTypeFaultColumns}
                    tableData={displayRows}
                    topX={topX}
                    theme={TableTheme.Nine}
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
export const PlantFaultByStudTypeProperty = Object.assign(
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

export default PlantFaultByStudTypeWidget;

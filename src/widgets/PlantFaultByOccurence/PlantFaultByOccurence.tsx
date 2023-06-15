/**
 *
 * PlantFaultByOccurence
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    faultOccurrencesReducer,
    faultOccurrencesKey,
    faultOccurrencesActions,
} from 'services/plant-overview/fault-occurrence/fault-occurrence-reducer';
import {
    selectFaultOccurrences,
    selectFaultOccurrencesIsLoading,
} from 'services/plant-overview/fault-occurrence/fault-occurrence-selectors';
import { getAllFaultOccurrencesSaga } from 'services/plant-overview/fault-occurrence/fault-occurrence-saga-get-all';
import { FilterNames, Filters, ReportingDataView, RouteTo } from 'models';
import { PositionArrow, TopXTable } from 'components';
import { Clickable } from 'components/Clickable';
import { TableTheme } from 'components/Table/Table';
import { WidgetProps, Widget } from 'widgets';
import { useQueryParam } from 'utils';
import { messages } from './messages';
import LaunchIcon from '@mui/icons-material/Launch';

import 'scss/main.scss';
import { ToggleOffOutlined, ToggleOnOutlined } from '@mui/icons-material';
import { Box } from '@mui/material';

interface PlantFaultByOccurenceProps extends WidgetProps {
    theme?: TableTheme;
    topX?: number;
    numberOfTable?: number;
}

export const PlantFaultByOccurenceWidget: Widget<PlantFaultByOccurenceProps> = memo(
    (props: PlantFaultByOccurenceProps) => {
        useInjectReducer({ key: faultOccurrencesKey, reducer: faultOccurrencesReducer });
        useInjectSaga({ key: faultOccurrencesKey, saga: getAllFaultOccurrencesSaga });

        const [treeView, setTreeView] = useState(false);
        const { className = '', filters = {}, theme = TableTheme.Nine, topX = 10, numberOfTable = 2 } = props;
        const [plantId] = useQueryParam<string>(FilterNames.plantId, '1', true);
        const { t, i18n } = useTranslation();

        const topTenfaultOccurrences = useSelector(selectFaultOccurrences);
        const isLoading: boolean = useSelector(selectFaultOccurrencesIsLoading);
        const dispatch = useDispatch();

        const displayRows = useMemo(() => {
            return topTenfaultOccurrences || [];
        }, [topTenfaultOccurrences]);

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
                dispatch(faultOccurrencesActions.getAllFaultOccurrences(serviceFilters));
                return;
            }
            dispatch(faultOccurrencesActions.getAllFaultOccurrences(serviceFilters));
        }, [dispatch, serviceFilters, treeView]);

        const faultOccurrenceColumns = [
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
                                label={FilterNames.faultCode}
                                value={value}
                                params={{ [FilterNames.faultCode]: value }}
                                routeTo={RouteTo.rca}
                            ></Clickable>
                        );
                    },
                },
            },
            {
                name: 'occurrences',
                label: t(messages.occurrences),
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

        const faultsList: string | undefined = topTenfaultOccurrences?.map(({ faultCode }) => faultCode).join(',');

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
                                value={faultsList}
                                params={{ [FilterNames.eventCode]: faultsList }}
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
                    title={t(messages.faultByOccurrence, { topX })}
                    columns={faultOccurrenceColumns}
                    tableData={displayRows}
                    theme={theme}
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

// const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
*/
];
export const PlantFaultByOccurenceProperty = Object.assign(
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

export default PlantFaultByOccurenceWidget;

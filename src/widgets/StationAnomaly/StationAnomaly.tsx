/**
 *
 * StationAnomaly
 *
 */
import CircleIcon from '@mui/icons-material/Circle';
import { useTheme } from '@mui/material/styles';
import { DashboardFilter } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { Filters, OperationItems, SidePanelOpenState } from 'models';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { processOperationKey, processOperationReducer } from 'services/process-operation/process-operation-reducer';
import { selectOperationItems } from 'services/process-operation/process-operation-selectors';
import { getAllOperationItemsSaga } from 'services/process-operation/sagas/process-operation-saga-get-all';
import styled from 'styled-components/macro';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Widget, WidgetProperty, WidgetProps } from 'widgets';
import IoTFlowsLineChart from './components/IoTFlowsLineChart';
import RivetingGraph from './components/RivetingGraph';
import { messages } from './messages';

import { Box, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import moment from 'moment';
import {
    historicalDiagnosticGraphActions,
    historicalDiagnosticGraphKey,
    historicalDiagnosticGraphReducer,
} from 'services/historical-diagnostic-graph/historical-diagnostic-graph-reducer';
import {
    selectHistoricalDiagnosticGraphs,
    selectHistoricalGraphsSpr,
} from 'services/historical-diagnostic-graph/historical-diagnostic-graph-selectors';
import { getAllHistoricalDiagnosticGraphsSaga } from 'services/historical-diagnostic-graph/sagas';
import {
    selectHistoricalDiagnostics,
    selectHistoricalSprs,
} from 'services/historical-diagnostic/historical-diagnostic-selectors';
import { selectProcessLogSprs } from 'services/process-log-spr/process-log-spr-selectors';
import { ExtraData } from './ExtraData/ExtraData';
import './StationAnomaly.scss';
import { ExtraDataSpr } from './ExtraDataSpr/ExtraDataSpr';

interface StationAnomalyProps extends WidgetProps {
    activityState?: string;
    extraPanelState: string;
    filters?: any;
    selectedIndex?: number;
    handleExtraPanelState: (value: SidePanelOpenState) => void;
    width?: number;
    dataType?: string;
    type?: string;
}

export const StationAnomaly: Widget<StationAnomalyProps> = memo(
    ({
        extraPanelState,
        filters = {},
        selectedIndex = 0,
        activityState,
        width = 400,
        dataType = 'SWS',
    }: StationAnomalyProps) => {
        useInjectReducer({ key: processOperationKey, reducer: processOperationReducer });
        useInjectSaga({ key: processOperationKey, saga: getAllOperationItemsSaga });
        useInjectReducer({ key: historicalDiagnosticGraphKey, reducer: historicalDiagnosticGraphReducer });
        useInjectSaga({ key: historicalDiagnosticGraphKey, saga: getAllHistoricalDiagnosticGraphsSaga });

        const [search, setSearch] = useState<string>('');
        const OperationLogs: OperationItems | undefined = useSelector(selectOperationItems);
        const OperationLogsSPR: OperationItems | undefined = useSelector(selectProcessLogSprs);
        const HistoricalLogs: any = useSelector(selectHistoricalDiagnostics);
        const HistoricalLogsSPR: any = useSelector(selectHistoricalSprs);
        const HistoricalGraphSWSLog: any = useSelector(selectHistoricalDiagnosticGraphs);
        const HistoricalGraphSprLog: any = useSelector(selectHistoricalGraphsSpr);

        const HistoricalGraphLog = dataType === 'SPR' ? HistoricalGraphSprLog : HistoricalGraphSWSLog;

        const historicalSWS = HistoricalLogs && HistoricalLogs[selectedIndex];
        const historicalSPR = HistoricalLogsSPR && HistoricalLogsSPR[selectedIndex];
        const historical = dataType === 'SPR' ? historicalSPR : historicalSWS;
        const operation = OperationLogs && OperationLogs[selectedIndex];
        const operationSPR = OperationLogsSPR && OperationLogsSPR[selectedIndex];
        const selectedDevice =
            activityState === 'active' ? (dataType === 'SPR' ? operationSPR : operation) : historical;

        const dispatch = useDispatch();
        filters.systemType = dataType;
        const [widgetFilters] = useState<Filters>({
            plantId: 1,
            ...filters,
            fromTime: moment(selectedDevice?.time || '2022-01-05T08:11:46Z'),
            toTime: moment(selectedDevice?.time || '2022-01-05T08:11:46Z').add(1, 'hours'),
        });
        const onSearchChanged = (text) => {
            setSearch(`${text}`.trim());
        };
        const serviceFilters = useMemo(
            () => ({
                ...widgetFilters,
                ...filters,
                graphData: true,
                deviceName: selectedDevice?.deviceName,
                studId: selectedDevice?.device?.studId,
                feederNo: selectedDevice?.otherData?.tags?.feederNo || selectedDevice?.otherData?.FeederNo,
                outletNo: selectedDevice?.otherData?.tags?.outletNo || selectedDevice?.otherData?.OutletNo,
                fromTime: moment(selectedDevice?.time),
                toTime: moment(selectedDevice?.time).add(1, 'hours'),
            }),
            [widgetFilters, filters, selectedDevice],
        );
        useEffect(() => {
            if (!selectedDevice || activityState === 'active') return;
            dispatch(historicalDiagnosticGraphActions.getAllHistoricalDiagnosticGraphs({ ...serviceFilters }));
        }, [activityState, dispatch, selectedDevice, serviceFilters]);

        const processLogs: OperationItems | undefined = useSelector(selectOperationItems);

        const { t } = useTranslation();
        const {
            palette,
            palette: { mode },
        } = useTheme();
        const { device = {} as any, anomaly = '', attachments = [], confidence = 80, feedback = {} as any } =
            processLogs?.length > 0 ? processLogs[0] : {};

        const graphData =
            activityState === 'active' ? selectedDevice?.data : HistoricalGraphLog.length && HistoricalGraphLog[0].data;

        const renderImageList = () => {
            return attachments.map((img, index) => (
                <Box
                    style={{
                        flex: 1,
                        width: '50%',
                        maxWidth: '50%',
                    }}
                    key={`img-key-${index}`}
                    className={`img ${img}`}
                />
            ));
        };

        const height = width * 0.6;

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Chip
                        sx={{ width: 'fit-content', marginTop: '10px' }}
                        label={`${selectedDevice?.deviceName || device?.name} ${
                            dataType === 'SPR' ? '' : selectedDevice?.stationName
                        }`}
                    />
                    <Chip
                        sx={{ width: 'fit-content', margin: '10px 0px' }}
                        icon={
                            <CircleIcon
                                sx={{
                                    fontSize: '14px !important',
                                    color: `${palette.warning} !important`,
                                }}
                            />
                        }
                        label={`${selectedDevice?.anomaly} ${selectedDevice?.confidence || confidence} %`}
                    />
                </Box>

                <Box>
                    {dataType === 'SPR' ? (
                        <RivetingGraph graphData={graphData} width={width} />
                    ) : (
                        <IoTFlowsLineChart name="Current" data={graphData} height={height} width={width} />
                    )}
                </Box>
                {dataType !== 'SPR' ? (
                    <ExtraData activityState={activityState} extraPanelState={extraPanelState} />
                ) : (
                    <ExtraDataSpr extraPanelState={extraPanelState} activityState={activityState} />
                )}

                {dataType !== 'SPR' && <Box className="attachment">{renderImageList()}</Box>}
                {dataType !== 'SPR' && (
                    <Box>
                        <Typography>{t(messages.anomalyFeedback)}</Typography>
                        <Box>
                            <Typography>
                                {feedback.user}
                                {feedback.role ? ` - ${feedback.role}` : ''}
                            </Typography>
                            <Typography>
                                {!!feedback.message && <Typography>&nbsp; {feedback.message}</Typography>}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        );
    },
);

const Table = styled.table``;

// extra widget properties
const defaultFilters: DashboardFilter[] = [];
export const StationAnomalyProperty: WidgetProperty = Object.assign(
    {},
    {
        defaultFilters,
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

export default StationAnomaly;

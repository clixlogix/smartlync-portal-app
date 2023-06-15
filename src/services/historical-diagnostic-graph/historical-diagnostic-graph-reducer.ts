import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { Filters, HistoricalDiagnosticGraph } from 'models';
import { HistoricalDiagnosticGraphsState } from '.';
import { convertGraphicalDataToTimerSeries } from 'services/cycle-gap-meta-data/sagas/data';
import moment from 'moment';
import get from 'lodash/get';

export const initialState: HistoricalDiagnosticGraphsState = {
    historicalDiagnosticGraphs: [],
    historicalDiagnosticGraph: undefined,
    historicalDiagnosticGraphsFilteredByRules: [],
    filters: {},
    historicalSprGraphs: [],

    error: undefined,
    isLoading: false,
    pins: [],
};

const historicalDiagnosticGraphsSlice = createSlice({
    name: 'historicalDiagnosticGraphs',
    initialState,
    reducers: {
        getAllHistoricalDiagnosticGraphs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllHistoricalSprGraphs(state, action: any) {
            const { metaData, graphData } = action.payload;
            const meta = metaData.META;
            const graph = {
                rivetData: {
                    y: graphData[0].RIVET_CURVE.dataY,
                    x: graphData[0].RIVET_CURVE.dataX,
                },
                referenceData: {
                    y: graphData[0].REFERENCE_CURVE.dataY,
                    x: graphData[0].REFERENCE_CURVE.dataX,
                },
            };
            const refXmin =
                Number.parseFloat(meta['rivetLength']) - Number.parseFloat(meta['rrcOffsetReference']) / 100;
            const actXmin = Number.parseFloat(meta['rivetLength']) - Number.parseFloat(meta['rrcOffsetActual']) / 100;
            const dataRivet = graph.rivetData.y.map((item, i) => {
                return { y: graph.rivetData.y[i], x: graph.rivetData.x[i] + actXmin };
            });
            const dataReference = graph.referenceData.y.map((item, i) => {
                return { y: graph.referenceData.y[i], x: graph.referenceData.x[i] + refXmin };
            });
            const data = {
                ...action.payload?.data,
                data: {
                    rivetData: dataRivet,
                    referenceData: dataReference,
                },
                meta,
            };
            state.historicalSprGraphs = [data];
        },
        setAllHistoricalDiagnosticGraphs(state, action: any) {
            const { metaData, graphData } = action.payload;
            const { filters } = state;

            const dateTime: number = moment(filters.fromTime).unix() * 1000;
            const currentData = get(graphData, [0, 'CURRENT'], {});
            const voltageData = get(graphData, [0, 'VOLTAGE'], {});
            const liftPositionData = get(graphData, [0, 'LIFT_POSITION'], {});
            const data = {
                voltageData: convertGraphicalDataToTimerSeries(voltageData, dateTime),
                currentData: convertGraphicalDataToTimerSeries(currentData, dateTime),
                liftPositionData: convertGraphicalDataToTimerSeries(liftPositionData, dateTime),
            };
            const parsedData = {
                data,
                graphData,
                meta: metaData?.META,
            };
            state.historicalDiagnosticGraphs = [parsedData];
        },
        getHistoricalDiagnosticGraph(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setHistoricalDiagnosticGraph(state, action: PayloadAction<HistoricalDiagnosticGraph>) {
            state.historicalDiagnosticGraph = action.payload;
        },
        error(state, action: PayloadAction<CustomError>) {
            state.error = action.payload;
        },
        loading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setPins(state, action) {
            state.pins = action.payload;
        },
        clear(state) {
            state = { ...initialState };
        },
    },
});

export const {
    actions: historicalDiagnosticGraphActions,
    reducer: historicalDiagnosticGraphReducer,
    name: historicalDiagnosticGraphKey,
} = historicalDiagnosticGraphsSlice;

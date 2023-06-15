/*
 * Msg Slice
 *
 * Here we define:
 * - The shape of our auth container's slice of Redux store,
 * - All the actions which can be triggered for this slice, including their effects on the store.
 *
 * Note that, while we are using dot notation in our reducer, we are not actually mutating the state
 * manually. Under the hood, we use immer to apply these updates to a new copy of the state.
 * Please see https://immerjs.github.io/immer/docs/introduction for more information.
 *
 */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { Filters, CarBodyDurationWidget, CarBodyDurationWidgets } from 'models';
import { CarBodyDurationWidgetsState } from '.';
import moment from 'moment';

// The initial state of the CarBodyDurationWidget page
export const initialState: CarBodyDurationWidgetsState = {
    carBodyDurationWidgets: [],
    carBodyDurationWidget: undefined,
    filters: {},
    categories: [],
    graphData: [],
    secondaryGraphData: [],

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const carBodyDurationWidgetsSlice = createSlice({
    name: 'carBodyDurationWidgets',
    initialState,
    reducers: {
        getAllCarBodyDurationWidgets(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllCarBodyDurationWidgets(state, action: PayloadAction<CarBodyDurationWidgets>) {
            state.carBodyDurationWidgets = action.payload;
        },

        setCarBodyDurationWidget(state, action: PayloadAction<CarBodyDurationWidget>) {
            const { payload } = action;
            const { durations = [], events = [] } = payload;

            const eventTypes = ['Info', 'Storung', 'Warnung'];
            const eventColorCodes = ['rgb(92,200,154)', 'rgb(221,96,70)', 'rgb(101,113,242)'];
            const graphData: any = [];
            const setData = new Set<string>();

            durations.forEach((data: any) => setData.add(data?.carbodyID));
            const categories: any[] = Array.from(setData);

            durations.forEach((item: any) => {
                graphData.push({
                    x: moment(item?.datetimeFirst).valueOf(),
                    x2: moment(item?.datetimeLast).valueOf(),
                    y: categories.indexOf(item?.carbodyID),
                    ...item,
                    cycleDuration: item?.cycleDuration.toFixed(2),
                });
            });

            const secondaryGraphData: any = [];
            events.forEach((item: any) => {
                secondaryGraphData.push({
                    x: moment(item?.occurredOn || '').valueOf(),
                    y: eventTypes.indexOf(item?.eventType || ''),
                    color: eventColorCodes[eventTypes.indexOf(item?.eventType) || 0],
                    ...item,
                    occurredOn: moment(item?.occurredOn).format('MMM DD, YYYY, hh:mm:ss'),
                });
            });

            state.carBodyDurationWidget = action.payload;
            state.categories = categories;
            state.graphData = graphData;
            state.secondaryGraphData = secondaryGraphData;
        },

        error(state, action: PayloadAction<CustomError>) {
            state.error = action.payload;
        },
        loading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        clear(state) {
            state = { ...initialState };
        },
    },
});

export const {
    actions: carBodyDurationWidgetActions,
    reducer: carBodyDurationWidgetReducer,
    name: carBodyDurationWidgetKey,
} = carBodyDurationWidgetsSlice;

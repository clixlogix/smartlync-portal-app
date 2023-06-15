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
import { Filters, Event, Events } from 'models';
import { EventsState } from '.';
import data from './sagas/data';

// The initial state of the Event page
export const initialState: EventsState = {
    events: data,
    event: undefined,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        getAllEvents(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllEvents(state, action: PayloadAction<Events>) {
            state.events = action.payload;
        },

        setEvent(state, action: PayloadAction<Event>) {
            state.event = action.payload;
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

export const { actions: eventActions, reducer: eventReducer, name: eventKey } = eventsSlice;

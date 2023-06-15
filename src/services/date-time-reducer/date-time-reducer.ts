import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Moment } from 'moment';

export interface DateTimeFilterState {
    fromTime: string | Moment | null;
    toTime: string | Moment | null;
}

export const initialState: DateTimeFilterState = {
    fromTime: '2021-07-28 04:25:47',
    toTime: '2021-07-28 05:25:47',
};

export const DateTimeFilterSlice = createSlice({
    name: 'dateTimeFilter',
    initialState,
    reducers: {
        setFromTime: (state, action: PayloadAction<string | Moment | null>) => {
            state.fromTime = action.payload;
        },
        setToTime: (state, action: PayloadAction<string | Moment | null>) => {
            state.toTime = action.payload;
        },
    },
});

export const {
    actions: DateTimeFilterActions,
    reducer: DateTimeFilterReducer,
    name: DateTimeFilterKey,
} = DateTimeFilterSlice;

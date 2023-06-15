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
import { Filters, EventRateCycleCountSpr, EventRateCycleCountSprs, FilterNames } from 'models';
import { EventRateCycleCountSprsState } from '.';
import moment from 'moment';

// The initial state of the EventRateCycleCountSpr page
export const initialState: EventRateCycleCountSprsState = {
    eventRateCycleCountSprs: [],
    eventRateCycleCountSpr: undefined,
    filters: {},
    filterValues: {},
    error: undefined,
    isLoading: false,
};

const enumerateDaysBetweenDates = function (startDate, endDate) {
    var dates: any = [];

    var currDate: any = moment(startDate).startOf('day');
    var lastDate: any = moment(endDate).startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push({
            occurredOn: currDate.format('YYYY-MM-DD'),
        });
    }
    return dates;
};
const enumerateWeekBetweenWeeks = function (start, end, dataArray) {
    try {
        dataArray = dataArray.reduce((o, obj) => ({ ...o, [obj['week']]: obj }), {});
        start = parseInt(start);
        end = parseInt(end + 1);
        const arr: any = [];
        for (let i = start; i < end; i++) {
            if (dataArray[i]) {
                arr.push(dataArray[i]);
            } else {
                const item = dataArray[i - 1];
                if (item) {
                    const date = moment(dataArray[i - 1].occurredOn)
                        ?.add(7, 'days')
                        ?.format('YYYY-MM-DD');
                    arr.push({
                        week: i,
                        view: 'Weekly',
                        eventCount: 0,
                        cycleCount: 0,
                        occurredOn: date,
                        year: moment(date).year(),
                    });
                }
            }
        }
        return arr;
    } catch (err) {
        console.log(err, 'event-data-err');
    }
};
const eventRateCycleCountSprsSlice = createSlice({
    name: 'eventRateCycleCountSprs',
    initialState,
    reducers: {
        getAllEventRateCycleCountSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },

        setAllEventRateCycleCountSprs(state, action: PayloadAction<EventRateCycleCountSprs>) {
            const { payload = [] } = action;

            let { eventRateCycleCountSprs = [] as any, filterValues = {} as any } = payload.reduce(
                (acc, row: EventRateCycleCountSpr, index) => {
                    acc.eventRateCycleCountSprs.push({
                        ...row,
                        occurredOn: moment(row.occurredOn).format('YYYY-MM-DD'),
                    });
                    acc.filterValues[FilterNames.week].add(row['week']);
                    return acc;
                },
                {
                    eventRateCycleCountSprs: [] as EventRateCycleCountSprs,
                    filterValues: {
                        [FilterNames.studType]: new Set(),
                        [FilterNames.week]: new Set(),
                        [FilterNames.deviceLine]: new Set(),
                        [FilterNames.deviceName]: new Set(),
                    },
                },
            );
            const obj: any = {};
            const type = eventRateCycleCountSprs[0]?.view;
            eventRateCycleCountSprs.forEach((cycle) => {
                const year = moment(cycle.occurredOn).year();
                if (obj[year]) {
                    obj[year] = [...obj[year], cycle];
                } else {
                    obj[year] = [cycle];
                }
            });
            if (type && type === 'Daily') {
                let arr: any = [];
                Object.values(obj).forEach((item: any) => {
                    const endIndex = item.length - 1;
                    const dates = enumerateDaysBetweenDates(item[0].occurredOn, item[endIndex].occurredOn);
                    const data = findArrayInArr(dates, item);
                    arr = [...arr, ...data];
                    eventRateCycleCountSprs = arr;
                });
            } else if (type) {
                let arr: any = [];
                Object.values(obj).forEach((item: any) => {
                    item = item.sort((a, b) => a.week - b.week);
                    const startWeek = item[0].week;
                    const endWeek = item[item.length - 1].week;
                    const data = enumerateWeekBetweenWeeks(startWeek, endWeek, item);
                    arr = [...arr, ...data];
                });
                eventRateCycleCountSprs = arr;
            }
            state.eventRateCycleCountSprs = eventRateCycleCountSprs;
            state.filterValues = filterValues;
        },

        setEventRateCycleCountSpr(state, action: PayloadAction<EventRateCycleCountSpr>) {
            state.eventRateCycleCountSpr = action.payload;
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
    actions: eventRateCycleCountSprActions,
    reducer: eventRateCycleCountSprReducer,
    name: eventRateCycleCountSprKey,
} = eventRateCycleCountSprsSlice;

export const findArrayInArr = (refArray: any, dataArray: any) => {
    if (!refArray || !dataArray) return [];
    let insides: any = [];
    try {
        refArray = refArray?.reduce((o, obj) => ({ ...o, [obj['occurredOn']]: obj }), {});
        dataArray = dataArray.reduce((o, obj) => ({ ...o, [obj['occurredOn']]: obj }), {});
        for (const [key] of Object.entries(refArray)) {
            if (dataArray[key]) {
                insides.push(dataArray[key]);
            } else {
                insides.push({
                    cycleCount: 0,
                    eventCount: 0,
                    week: moment(key)?.week(),
                    occurredOn: key,
                    year: moment(key).year(),
                    view: 'Daily',
                });
            }
        }
    } catch (err) {
        console.log(err, 'refArray');
    }
    return insides;
};

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
import { Filters, Plants } from 'models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { PlantsState } from '.';
import capitalize from 'lodash/capitalize';
import { Images } from 'constants/index';

let tenant = window.location.href.replace('http://', '').replace('https://', '').split('.')[0];
const environment = window.location.href
    .replace('http://', '')
    .replace('https://', '')
    .split('.')[1]
    .toLocaleLowerCase();
tenant = tenant === 'demo' && environment === 'stage' ? 'demoStage' : tenant;
let plantName = [];

export const initialState: PlantsState = {
    plants: plantName,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const plantsSlice = createSlice({
    name: 'plants',
    initialState,
    reducers: {
        plants(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setPlants(state, action: PayloadAction<any>) {
            const { plantData = [] } = action.payload;
            let plants: Plants = [];
            if (plantData.length > 0) {
                plantData.forEach((item, index) => {
                    plants.push({
                        ...item,
                        active: true,
                        id: item?.plantId,
                        route: '/plantHealthOverview',
                        thumbnail: tenant === 'rivian' ? Images.RivianLanding : Images.TileImage,
                        name: capitalize(item?.plantName),
                        technicalAvailability: +item?.ta || undefined,
                        eventRate: +item?.eventRate || undefined,
                    });
                });
            } else {
                plants = plantData;
            }

            state.plants = plants;
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

export const { actions: plantsActions, reducer: plantsReducer, name: plantsKey } = plantsSlice;

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
import { Settings, Settingss } from 'models';
import { SettingssState } from '.';
import data from './sagas/data';

// The initial state of the Settings page
export const initialState: SettingssState = {
    settingss: data,
    settings: undefined,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const settingssSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        getAllSettingss(state, action: PayloadAction<any>) {},

        setAllSettingss(state, action: PayloadAction<Settingss>) {
            // state.settingss = action.payload;
            state.settingss = [...state.settingss, action.payload];
        },

        setSettings(state, action: PayloadAction<Settings>) {
            state.settings = action.payload;
        },

        setEditedSettings(state, action: PayloadAction<any>) {
            state.settingss = state.settingss?.map((item) => {
                return item.id === action.payload.id ? action.payload : item;
            });
        },

        setOperation(state, action: PayloadAction<any>) {},

        editOperation(state, action: PayloadAction<any>) {},

        deleteOperation(state, action: PayloadAction<any>) {
            state.settingss = state.settingss?.filter((item) => action.payload !== item.id);
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

export const { actions: settingsActions, reducer: settingsReducer, name: settingsKey } = settingssSlice;

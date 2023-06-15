import { createTheme, ThemeOptions } from '@mui/material/styles';
import { darkThemeConfig } from './darkTheme';
import { lightThemeConfig } from './lightTheme';

export const lightTheme: ThemeOptions = createTheme(lightThemeConfig);

export const darkTheme: ThemeOptions = createTheme(darkThemeConfig);

// TODO: light should be '#fff' and dark should be '#000'
export const chartTheme = {
    light: '#000000',
    dark: '#ffffff',
    backgroundDark: '#212121',
    backgroundLight: '#fff',
};

export enum ThemeModes {
    light = 'light',
    dark = 'dark',
}

export type Theme = typeof lightTheme;

export const themes = {
    light: lightTheme,
    dark: darkTheme,
};

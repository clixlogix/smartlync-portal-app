import { ThemeOptions } from '@mui/material/styles';

export const lightThemeConfig: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#2F61BF',
        },
        secondary: {
            main: '#FFD20A',
        },
        background: {
            default: '#FAFAFA',
            paper: '#FFF',
        },
        common: {
            black: '#000',
            white: '#fff',
        },
        error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
            contrastText: '#fff',
        },
        warning: {
            main: '#ffa726',
            light: '#ffb74d',
            dark: '#f57c00',
            contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        info: {
            main: '#29b6f6',
            light: '#4fc3f7',
            dark: '#0288d1',
            contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        success: {
            main: '#66bb6a',
            light: '#81c784',
            dark: '#388e3c',
            contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        text: {
            primary: 'rgba(0, 0, 0, 1)',
            secondary: 'rgba(0, 0, 0, 0.7)',
            disabled: 'rgba(0, 0, 0, 0.5)',
            // icon: 'rgba(255, 255, 255, 0.5)',
            // primaryChannel: '255 255 255',
            // secondaryChannel: '255 255 255',
        },
        divider: 'rgba(47, 97, 191, 0.12)',
        action: {
            active: 'rgba(47, 97, 191, 1)',
            hover: 'rgba(47, 97, 191, 0.08)',
            hoverOpacity: 0.08,
            selected: 'rgba(47, 97, 191, 0.16)',
            selectedOpacity: 0.16,
            disabled: 'rgba(47, 97, 191, 0.3)',
            disabledBackground: 'rgba(47, 97, 191, 0.12)',
            disabledOpacity: 0.38,
            focus: 'rgba(47, 97, 191, 0.12)',
            focusOpacity: 0.12,
            activatedOpacity: 0.24,
            // activeChannel: '255 255 255',
            // selectedChannel: '255 255 255',
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    height: 56,
                    minHeight: 56,
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    // borderBottom: '1px solid rgba(0,0,0,0.12)',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: 'rgba(0, 0, 0, 0.87)',
                },
            },
        },
    },
    shape: {
        borderRadius: 4,
    },
    mixins: {
        toolbar: {
            minHeight: 56,
            '@media (min-width:0px)': {
                '@media (orientation: landscape)': {
                    minHeight: 48,
                },
            },
            '@media (min-width:600px)': {
                minHeight: 64,
            },
        },
    },
};

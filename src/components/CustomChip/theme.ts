import { createTheme, DeprecatedThemeOptions } from '@mui/material';

import { adaptV4Theme } from '@mui/material/styles';

interface ChipThemeParams {
    color?: string;
    variant?: string;
}

export enum ChipColors {
    Primary = 'primary',
    Secondary = 'secondary',
    Error = 'error',
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Default = 'default',
}

export enum ChipVariants {
    Outlined = 'outlined',
    Filled = 'filled',
}

export enum ColorCodes {
    White = '#ffffff',
    PrimaryMain = '#FFD20A',
    PrimaryDark = '#C7A100',
    SecondaryMain = '#C3D4FB',
    SuccessMain = '#81C784',
    SuccessDark = '#66BB6A',
    ErrorMain = '#F44336',
    ErrorOutlined = '#F76E64',
    ErrorFilled = '#D32F2F',
    InfoMain = '#29B6F6',
    InfoDark = '#0288D1',
    WarningMain = '#FF6720',
    DefaultBackground = 'rgba(255, 255, 255, 0.16)',
    TransparentBlack = 'rgba(0, 0, 0, 0.2)',
    IconDefault = '#BDBDBD',
    AvatarColorWarning = '#CC521A',
    TextBlack = 'rgba(0, 0, 0, 0.87);',
}

const labelColor = (color?: string, variant?: string): string => {
    if (color === ChipColors.Default) return ColorCodes.White;
    if (color === ChipColors.Error && variant === ChipVariants.Outlined) return ColorCodes.ErrorOutlined;

    return '';
};

export const Theme = ({ color, variant }: ChipThemeParams) => {
    const obj: DeprecatedThemeOptions = {
        palette: {
            primary: {
                main: ColorCodes.PrimaryMain,
                dark: ColorCodes.PrimaryDark,
            },
            secondary: {
                main: ColorCodes.SecondaryMain,
                dark: ColorCodes.SecondaryMain,
            },
            success: {
                main: ColorCodes.SuccessMain,
                dark: ColorCodes.SuccessDark,
            },
            error: {
                main: ColorCodes.ErrorMain,
            },
            info: {
                main: ColorCodes.InfoMain,
                dark: ColorCodes.InfoDark,
            },
            warning: {
                main: ColorCodes.WarningMain,
                contrastText: ColorCodes.White,
            },
        },
        components: {
            MuiChip: {
                styleOverrides: {
                    label: {
                        fontFamily: 'Roboto',
                        color: labelColor(color, variant),
                    },
                    avatarColorSecondary: {
                        backgroundColor: variant === ChipVariants.Outlined ? '' : ColorCodes.TransparentBlack,
                    },
                    //@ts-ignore
                    colorDefault: {
                        backgroundColor: ColorCodes.DefaultBackground,
                    },
                    outlinedError: {
                        borderColor: ColorCodes.ErrorOutlined,
                    },
                    avatarColorDefault: {
                        backgroundColor: ColorCodes.IconDefault,
                    },
                    avatarColorError: {
                        backgroundColor:
                            variant === ChipVariants.Outlined ? ColorCodes.ErrorOutlined : ColorCodes.ErrorFilled,
                        color: variant === ChipVariants.Outlined ? ColorCodes.TextBlack : ColorCodes.White,
                    },
                    avatarColorSuccess: {
                        backgroundColor: ColorCodes.SuccessDark,
                        color: ColorCodes.TextBlack,
                    },
                    avatarColorInfo: {
                        backgroundColor: ColorCodes.InfoDark,
                        color: ColorCodes.TextBlack,
                    },
                    avatarColorWarning: {
                        backgroundColor:
                            variant === ChipVariants.Outlined
                                ? ColorCodes.AvatarColorWarning
                                : ColorCodes.TransparentBlack,
                        color: ColorCodes.White,
                    },
                    deleteIconFilledColorWarning: {},
                    deleteIconColorDefault: {
                        color: ColorCodes.IconDefault,
                    },
                    deleteIconColorError: {
                        color: variant === ChipVariants.Outlined ? ColorCodes.ErrorOutlined : '',
                    },
                },
            },
        },
    };
    return createTheme(adaptV4Theme(obj));
};

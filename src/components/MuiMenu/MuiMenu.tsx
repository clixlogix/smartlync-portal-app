/**
 *
 * MuiMenu
 *
 */
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { memo } from 'react';

import { Box, Typography } from '@mui/material';

export enum MenuPanelTitleType {
    Selection = 'Selection',
    Icon = 'Icon',
}

export class MenuOptionModel {
    label: string;
    value?: string;
    href?: string;
    icon?: string;
    toggle?: boolean;
    children?: MenuOptions;

    constructor(o?: any) {
        const { label, value, href = '', icon, toggle = false, children = [] } = o || ({} as any);

        this.label = label;
        this.value = value;
        this.href = href;
        this.icon = icon;
        this.toggle = toggle;
        this.children = children;
    }

    toString = (): string => {
        return this.value || this.label;
    };
}

export type MenuOption = MenuOptionModel;
export type MenuOptions = Array<MenuOption>;

export type MenuAlign =
    | 'left'
    | 'right'
    | { sm: 'left' | 'right' }
    | { md: 'left' | 'right' }
    | { lg: 'left' | 'right' }
    | { xl: 'left' | 'right' };

export enum MenuOptionItem {
    DIVIDER = ':divider:',
}

interface MuiMenuProps {
    options: MenuOptions;
    className?: string;
    selected?: MenuOption | MenuOptions;
    icon?: string;
    iconSize?: string;
    showIcons?: boolean;
    direction?: MenuAlign;
    crumbThemeActiveBool?: boolean;
    titleType?: MenuPanelTitleType;
    onClick?(item: MenuOption): void;
}

export const MuiMenu: React.FC<MuiMenuProps> = memo(
    ({
        icon = 'sliders',
        iconSize = '2x',
        options = [],
        selected = '',
        crumbThemeActiveBool = false,
        titleType = MenuPanelTitleType,
        onClick,
    }) => {
        const sanitiezeOptions = (options: MenuOptions): MenuOptions => {
            return options.reduce((acc: MenuOptions, o: MenuOption): MenuOptions => {
                let option = o;

                if (!o) {
                    return acc;
                }

                if (typeof o === 'string') {
                    option = new MenuOptionModel({ value: o, label: o });
                }

                acc.push(option);

                return acc;
            }, []);
        };

        const menuOptions: MenuOptions = sanitiezeOptions(options);

        const selections: string[] = (Array.isArray(selected) ? selected : [selected]).map((s) =>
            typeof s === 'string' ? s : s?.label,
        );
        const [anchorEl, setAnchorEl] = React.useState(null);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleMenuItemClicked = (item) => {
            handleClose();

            if (onClick) {
                onClick(item);
            }
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        let title = <></>;
        switch (titleType) {
            case MenuPanelTitleType.Selection:
                // @ts-ignore
                const titleLabels: string[] = menuOptions.reduce((acc: string[], item: MenuOptionModel) => {
                    if (selections.includes(item.value || '')) {
                        acc.push(item.label || '');
                    }
                    return acc;
                }, [] as string[]);

                const titleOptions = titleLabels.length > 0 ? titleLabels.join(',') : 'select';

                title = (
                    <Typography
                        variant={crumbThemeActiveBool ? 'inherit' : 'subtitle1'}
                        sx={{
                            ...(crumbThemeActiveBool
                                ? {
                                      fontWeight: 'bold',
                                      fontSize: 20,
                                      display: 'flex',
                                      alignItems: 'center !important',
                                      padding: 0,
                                      margin: 0,
                                      color: 'primary.main',
                                  }
                                : {
                                      display: 'flex',
                                      alignItems: 'center !important',
                                      padding: 0,
                                      margin: 0,
                                  }),
                        }}
                    >
                        {titleOptions}
                        <ArrowDropDownIcon
                            style={{
                                fontSize: crumbThemeActiveBool ? '18px' : '14px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '2px',
                            }}
                        />
                    </Typography>
                );
                break;
            case MenuPanelTitleType.Icon:
            default:
                title = <i className={`fa fa-${icon} fa-fw fa-${iconSize}`}></i>;
        }

        return (
            <Box>
                <Button
                    variant="text"
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    sx={
                        crumbThemeActiveBool
                            ? {
                                  padding: 0,
                                  paddingRight: 1,
                              }
                            : {}
                    }
                >
                    {title}
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    {menuOptions.map((item, index) => {
                        const { label } = item as MenuOptionModel;
                        return (
                            <MenuItem
                                key={label + index}
                                onClick={(e) => handleMenuItemClicked(item)}
                                selected={label === selected}
                                autoFocus={true}
                            >
                                {label}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </Box>
        );
    },
);

export default MuiMenu;

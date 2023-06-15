import React from 'react';
import { DropdownButton, Col, Dropdown } from 'react-bootstrap';
import Switch from 'react-switch';
import './Menu.scss';

export enum MenuPanelTitleType {
    Selection = 'Selection',
    Icon = 'Icon',
}
export class MenuOption {
    label: string;
    value?: string;
    href?: string;
    icon?: string;
    toggle?: boolean;

    constructor(o?: any) {
        const { label, value, href = '', icon, toggle = false } = o || ({} as any);

        this.label = label;
        this.value = value;
        this.href = href;
        this.icon = icon;
        this.toggle = toggle;
    }

    toString = (): string => {
        return this.value || this.label;
    };
}

export type MenuOptionType = MenuOption | string;
export type MenuOptionArray = Array<MenuOption | string>;
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

interface MenuProps {
    options: MenuOptionArray;
    className?: string;
    selected?: MenuOptionType | MenuOptionArray;
    icon?: any;
    iconSize?: string;
    direction?: MenuAlign;
    titleType?: MenuPanelTitleType;

    onClick?(item: MenuOption): void;
}

const itemSelected = (selected: MenuOptionArray = [], item = '') => {
    const value = typeof item === 'string' ? item : (item as MenuOption)?.value;

    return !!selected.find((s: MenuOptionType) =>
        typeof s === 'string' ? value === s : (s as MenuOption)?.value === value,
    );
};

const sanitiezeOptions = (options: MenuOptionArray): MenuOptionArray => {
    return options.reduce((acc: MenuOptionArray, o: MenuOptionType): MenuOptionArray => {
        let option = o;

        if (!o) {
            return acc;
        }

        if (typeof o === 'string') {
            option = new MenuOption({ value: o, label: o });
        }

        acc.push(option);

        return acc;
    }, []);
};

export const MenuPanel: React.FC<MenuProps> = React.memo(
    ({
        icon = 'sliders',
        iconSize = '2x',
        options = [],
        selected = [],
        className = '',
        direction = 'left',
        titleType = MenuPanelTitleType,
        onClick,
        children,
    }) => {
        const selectedItems: MenuOptionArray = sanitiezeOptions(Array.isArray(selected) ? selected : [selected]);
        const menuOptions: MenuOptionArray = sanitiezeOptions(options);

        const selections: string[] = (Array.isArray(selected) ? selected : [selected]).map((s) =>
            typeof s === 'string' ? s : s?.label,
        );

        let title = <></>;
        switch (titleType) {
            case MenuPanelTitleType.Selection:
                title = (
                    <>
                        {options
                            .reduce((acc: string[], o) => {
                                // @ts-ignore
                                const label: string = o?.label || o;
                                // @ts-ignore
                                const value: string = o?.value || o;
                                if (selections.includes(value)) {
                                    acc.push(label);
                                }
                                return acc;
                            }, [])
                            .join(',') || 'select'}
                    </>
                );
                break;
            case MenuPanelTitleType.Icon:
            default:
                title = (
                    <span>
                        <i className={`fa fa-${icon} fa-fw fa-${iconSize}`}></i>
                    </span>
                );
        }

        return (
            <Col className={`x-cls-menu-panel-panels ${className}`}>
                <DropdownButton
                    // id="dropdown-basic-button"
                    menuAlign={direction}
                    alignRight
                    style={{ backgroundColor: 'red' }}
                    title={title}
                    variant="outline-light"
                >
                    {menuOptions.map((option: MenuOptionType, index: number) => {
                        if ((option as MenuOption).label === MenuOptionItem.DIVIDER) {
                            return <Dropdown.Divider key={`menu-option-divider-key-${index}`} />;
                        }

                        const { label, value, href = '', icon = '', toggle = false } = option as MenuOption;

                        const checked = itemSelected(selectedItems, value);

                        return (
                            <Dropdown.Item
                                className={`x-cls-menu-item${toggle ? '-toggle' : ''} x-cls-menu-item-${value}`}
                                key={`menu-option-key-${index}`}
                                style={{ backgroundColor: 'red' }}
                                href={`#${href}`}
                                {...(href ? { href: `#${href}` } : {})}
                                {...(onClick
                                    ? {
                                          onClick: () => onClick(option as MenuOption),
                                      }
                                    : {})}
                            >
                                {toggle ? (
                                    <Switch
                                        className={`${className} react-switch`}
                                        onChange={() => {}}
                                        checked={checked}
                                        height={12}
                                        width={32}
                                        aria-label={`${label} ${checked ? 'on' : 'off'}`}
                                    />
                                ) : (
                                    <span
                                        className={`fa fa-fw  ${checked && 'fa-check'} ${
                                            icon && `fa-${icon}`
                                        } x-cls-menu-option x-cls-menu-option-${label.toLocaleLowerCase()}`}
                                    ></span>
                                )}
                                {label}
                            </Dropdown.Item>
                        );
                    })}
                    {children}
                </DropdownButton>
            </Col>
        );
    },
);

export default MenuPanel;

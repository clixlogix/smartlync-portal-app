/**
 *
 * Breadcrumb
 *
 */
import { Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { MuiMenu } from 'components';
import { MenuOption, MenuPanelTitleType } from 'components/Menu';
import { DashboardFilter } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { FilterNames, Filters, Plants } from 'models';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { selectPlants } from 'services/plant/plant-selectors';
import { useDisplayFilters } from 'utils/hooks/useDisplayFilters';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';

export interface BreadcrumbLink {
    color?: string;
    href?: string;
    label?: string;
    name?: string;
    children?: BreadcrumbLink;
    menu?: string;
    options?: string[];
    inactive?: boolean;
    icon?: any;
    onClick?();
}

export type BreadcrumbLinks = (BreadcrumbLink | string)[];
interface BreadcrumbProps {
    crumbs?: BreadcrumbLinks;
    selected?: BreadcrumbLink;
    separator?: Node;
    className?: string;
    filters?: Filters;
    availableFilters?: DashboardFilter[];
    maxItems?: number;
    crumbThemeActiveBool?: boolean;

    filterValues?: () => void;
    onClick?(crumb: BreadcrumbLink | string | Filters);
}

const defaultCrumb: BreadcrumbLink = {
    href: undefined,
    onClick: () => { },
    label: undefined,
    icon: undefined,
};

export const Breadcrumb = memo((props: BreadcrumbProps) => {
    const {
        onClick,
        crumbs = [],
        separator = '/',
        filters = [],
        availableFilters = [],
        crumbThemeActiveBool,
        filterValues,
    } = props;

    const plants: Plants = useSelector(selectPlants);
    const history = useHistory();
    const location = useLocation();
    const { pathname } = location;

    let values;
    if (filterValues) {
        values = filterValues();
    }

    const displayFilters = useDisplayFilters(availableFilters, values);
    const neededFilters = []; //[FilterNames.bodyshop, FilterNames.carTypeId, FilterNames.deviceName];

    const additionalCrumbs = displayFilters
        ?.filter(({ name }) => (neededFilters.includes(name) ? filters[name] : null))
        .map(({ name, data: { options } }) => {
            const stringedOptions = options?.map((opt) => {
                return typeof opt === 'number' ? opt.toString() : opt;
            });
            return {
                name,
                menu: filters[name],
                options: stringedOptions,
            };
        })
        .sort((filterA, filterB) => neededFilters.indexOf(filterA.name) - neededFilters.indexOf(filterB.name));

    const theCrumbs = [...crumbs, ...additionalCrumbs].reduce((acc = [], crumb, index) => {
        if (!crumb.inactive) {
            acc.push({
                ...defaultCrumb,
                ...(typeof crumb === 'string'
                    ? // temporary fix to show first value
                    { label: crumb.split(',')[0] }
                    : crumb.menu
                        ? { name: crumb.name, label: crumb.menu, value: crumb.menu, children: crumb.options }
                        : crumb),
            });
        }
        return acc;
    }, []);

    const handCrumbChange = (crumb, filterName) => {
        const jlr = plants.filter((plant) => plant.name === crumb);
        if (jlr && jlr.length) {
            const plant = plants.filter((plant) => plant.name === crumb);
            const plantId: any = plant[0]?.id?.toString();
            localStorage.setItem('plant__id', plantId);
            history.push({
                pathname,
            });
        } else {
            localStorage.setItem(filterName, crumb);
        }
        if (onClick) {
            onClick({ [filterName]: crumb });
        }
    };

    return (
        <Breadcrumbs
            sx={{ minWidth: 'fit-content' }}
            aria-label={'breadcrumb'}
            separator={<Typography>{separator}</Typography>}
        // maxItems={maxItems}  // Muting in Order to show all breadcrumb Items
        >
            {theCrumbs.map((crumb, index: number) => {
                if (Array.isArray(crumb.children)) {
                    const menuOptions = {
                        name: crumb.name || crumb.label || 'crumb',
                        label: crumb.label,
                        value: crumb.value || crumb.label,
                        selected: crumb.value || crumb.label,
                        options: [...crumb.children],
                        titleType: MenuPanelTitleType.Selection,
                        key: `key-${Math.random()}`,
                        crumbThemeActiveBool,
                    };
                    return (
                        <MuiMenu
                            {...menuOptions}
                            onClick={(v: MenuOption) => {
                                return handCrumbChange(v.value, menuOptions.name);
                            }}
                            direction={'left'}
                        />
                    );
                }
                return (
                    <Chip
                        sx={{ cursor: crumb.href ? 'pointer' : undefined }}
                        icon={crumb.href === '/home' ? <HomeIcon sx={{ fontSize: '13px' }} /> : crumb.icon || undefined}
                        label={crumb.label}
                        component="a" // "a" component to tell it has link
                        href={crumb.href || undefined} // path to the link
                    />
                );
            })}
        </Breadcrumbs>
    );
});

export default Breadcrumb;

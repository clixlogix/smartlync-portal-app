import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { actions as authActions } from 'services/auth/auth-reducer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { RouteItems } from 'models';
interface SubMenuProps {
    menuItems: RouteItems;
    neededMenus: string[];
    className?: string;
    index: number;
}

export const SubMenu = ({ menuItems, neededMenus }: SubMenuProps) => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();

    const plantId = localStorage.getItem('plantId') || '';
    const actualMenuItems = menuItems.filter(({ disabled }) => !disabled);
    const menuIndex = actualMenuItems.findIndex((item) => item?.children ? item?.children.length > 0 : item.route === neededMenus[0]);

    const activateRoute = (label: string, route: string) => {
        if (label === 'Sidebar.Logout') {
            dispatch(authActions.logout());
        }
        if (route !== '/home') {
            history.push(`${route}?plantId=${plantId}`);
        }
        // Hide Plant ID when in Landing Page
        if (route === '/home') {
            history.push(`${route}`);
        }
    };

    return (
        <>
            <Tabs
                value={menuIndex}
                onChange={(_value, index) => {
                    const { label = '', route = '' } = actualMenuItems[index];
                    activateRoute(label as string, route);
                }}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="scrollable force tabs"
            >
                {actualMenuItems.map(({ label }) => (
                    <Tab label={t(label as string).toUpperCase() || ''} />
                ))}
            </Tabs>
            {actualMenuItems?.map((elem) => {
                let childArray = elem?.children?.filter(({ disabled }) => !disabled);
                const childMenuIndex = childArray?.findIndex((item) => item?.route === neededMenus[0]);
                //@ts-ignore
                if (childArray?.length > 0) {
                    return (
                        <Tabs
                            key={`${elem}`}
                            value={childMenuIndex}
                            onChange={(_value, index) => {
                                const { label = '', route = '' } = childArray[index];
                                activateRoute(label as string, route);
                            }}
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            aria-label="scrollable force tabs"
                        >
                            {childArray?.length > 0 &&
                                childArray?.map(({ label }) => <Tab label={t(label as string).toUpperCase() || ''} />)}
                        </Tabs>
                    );
                }
            })}
        </>
    );
};

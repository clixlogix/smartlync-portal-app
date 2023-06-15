import React, { memo, ReactNode, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { actions as authActions } from 'services/auth/auth-reducer';
import { RouteItems, RouteItem } from 'models';
import ListItemButton from '@mui/material/ListItemButton';
import * as _ from 'lodash';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Collapse from '@mui/material/Collapse';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

interface Props {
    open: boolean;
    routes?: RouteItems;
    children?: ReactNode | ReactNode[];
    getChildren?: (children: RouteItems, label?: string) => void;
    neededMenus?: string[];

    closeSideNav(): void;
}

export const MenuItemsNew = memo(({ routes = [], neededMenus = [], open }: Props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const plantId = localStorage.getItem('plantId') || '';
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [indexArray, setIndexArray] = useState<string[]>([]);
    const [activatedRouteParents, setActivatedRouteParents] = useState<any>([]);

    useEffect(() => {
        function findRoutes(routes: RouteItems, path: string) {
            if (!routes || !routes.length) return [];
            for (let i = 0; i < routes.length; i++) {
                if (routes[i].route === path) return [routes[i]];
                const retVal = findRoutes(routes[i].children, path);
                if (retVal.length) {
                    retVal.push(routes[i]);
                    return retVal;
                }
            }
            return [];
        }
        setActivatedRouteParents(findRoutes(routes, history.location.pathname));
    }, [history.location.pathname, routes]);

    const activateRoute = (label: string, route: string, hasChildren: boolean) => {
        if (hasChildren && open) {
            indexArray.includes(label)
                ? _.remove(indexArray, function (n) {
                      return n === label;
                  })
                : indexArray.push(label);
            setIndexArray(indexArray);
            setIsOpen(!isOpen);
            return;
        }
        if (label === 'Sidebar.Logout') {
            dispatch(authActions.logout());
        }
        if (route !== '/home') {
            if (route === '/dashboards' && !open) {
                history.push(`${route}/0?plantId=${plantId}`);
                return;
            }
            history.push(`${route}?plantId=${plantId}`);
        }
        // Hide Plant ID when in Landing Page
        if (route === '/home' || route === '/') {
            history.push(`${route}`);
        }
    };

    let indx = 0;

    const isHomeScreen: boolean = window.location.pathname === '/home';

    const renderRoutes = (routes: RouteItems = []) => {
        if (routes?.length <= 0) {
            return;
        }

        return (
            <List sx={{ p: 0, display: 'flex', flexDirection: 'column', flex: 1 }} key={`key-lists-${indx++}`}>
                {routes.map((routeitem: RouteItem, index) => {
                    const { label = '', icon = '', route = '', children = [], disabled } = routeitem;
                    return label === '-' ? (
                        <>
                            <li style={{ flex: 1 }}></li>
                            <Divider key={`key-${label}-{i}`} />
                        </>
                    ) : (
                        !disabled && (
                            <>
                                <ListItem key={`key-${label}-{i}`} sx={{ p: 0 }}>
                                    <ListItemButton
                                        sx={{ pt: '9px', pb: '9px' }}
                                        disabled={isHomeScreen}
                                        selected={history.location.pathname === route}
                                        onClick={() => activateRoute(label, route, children.length > 0)}
                                    >
                                        <ListItemIcon>{icon}</ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography component="div" variant="subtitle2">
                                                    {t(label)}
                                                </Typography>
                                            }
                                        />
                                        {children.length > 0 && (
                                            <> {!indexArray.includes(label) ? <ExpandLess /> : <ExpandMore />} </>
                                        )}
                                    </ListItemButton>
                                </ListItem>
                                {children.length > 0 && (
                                    <Collapse
                                        sx={{
                                            '&>div': {
                                                pl: '20px',
                                            },
                                        }}
                                        key={`sideBar-subMenu-key-${index}`}
                                        in={!indexArray.includes(label) && open}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        {renderRoutes(children)}
                                    </Collapse>
                                )}
                            </>
                        )
                    );
                })}
            </List>
        );
    };

    const renderRoutesClosed = (routes: RouteItems = []) => {
        if (routes?.length <= 0) {
            return;
        }
        return (
            <List key={`key-lists-${indx++}`} sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {routes.map((routeitem: RouteItem) => {
                    const { label = '', icon = '', route = '', children = [], disabled } = routeitem;
                    return label === '-' ? (
                        <>
                            {/* <li style={{ flex: 1 }}></li> */}
                            <Divider key={`key-${label}-{i}`} />
                        </>
                    ) : (
                        !disabled && (
                            <Tooltip title={!isHomeScreen ? t(label) : ''} placement="right-start">
                                <ListItem key={`key-${label}-{i}`} sx={{ pt: 0, pl: 0, pr: 0 }}>
                                    <ListItemButton
                                        disabled={isHomeScreen}
                                        selected={
                                            history.location.pathname === route ||
                                            !!activatedRouteParents.find((r) => r.route === route)
                                        }
                                        onClick={() => activateRoute(label, route, children.length > 0)}
                                        sx={{ pl: 1 / 4, pr: 1 / 4 }}
                                    >
                                        <ListItemIcon sx={{ justifyContent: 'center' }}>{icon}</ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                            </Tooltip>
                        )
                    );
                })}
            </List>
        );
    };

    return (
        <Drawer
            PaperProps={{ sx: { top: 56, height: 'calc(100vh - 56px)' } }}
            anchor="left"
            open={open || true}
            variant="persistent"
        >
            <Box
                sx={{ width: !open ? 'auto' : '285px', display: 'flex', flex: 1 }}
                role="presentation"
                key={`key-lists-${indx++}`}
            >
                {open ? renderRoutes(routes) : renderRoutesClosed(routes)}
                <Divider />
            </Box>
        </Drawer>
    );
});

export default MenuItemsNew;

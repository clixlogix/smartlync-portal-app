import Container from '@mui/material/Container';
import PageHeaderNew from 'components/PageHeaderNew/PageHeaderNew';
import React, { memo, useState, useEffect } from 'react';
// import ProgressBar from 'components/LinearProgress/LinearProgress';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';

import MenuItemsNew from 'components/SidebarNew/MenuItemsNew';
import { Filters, RouteItems } from 'models';
import { DashboardFilter } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { SubMenu } from './SubMenu/SubMenu';
import { selectDashboards } from 'services/dashboard/dashboard-selectors';
interface PageLayoutProps {
    className?: string;
    children: JSX.Element | JSX.Element[];
    filters?: Filters;
    availableFilters?: DashboardFilter[];
    editPageLayout?: boolean;
    title?: JSX.Element;
    isLoading?: Boolean;

    onFilterChange?: (filter: Filters) => any;
    filterValues?();
    onLayoutSwitch?(switchLayout: boolean);
}

export const PageLayout = memo(
    ({
        //className = '',
        children,
    }: // editPageLayout,
    // // isLoading = false,
    // onLayoutSwitch = () => {},
    PageLayoutProps) => {
        const history = useHistory();

        const routes: RouteItems = useSelector(selectDashboards);
        const [arrOfNeededRoutes, setArrOfNeededRoutes] = useState<RouteItems[]>([]);
        const [arrOfNeededMenus, setArrOfNeededMenuss] = useState<string[]>([]);
        const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

        const neededMenus: string[] = [];
        const neededRoutes: RouteItems[] = [];

        const findParentElement = (menus: RouteItems, needToFind: string, parent?: string) => {
            menus.forEach(({ route, children }) => {
                const parentName = route;

                if (route === needToFind) {
                    neededMenus.push(route);
                    children && neededRoutes.push(children);
                    setArrOfNeededRoutes(neededRoutes.reverse());
                    if (parent) {
                        findParentElement(routes, parent);
                    }
                    return;
                }

                if (children) {
                    findParentElement(children, needToFind, parentName);
                }
            });
            setArrOfNeededMenuss(neededMenus);
        };

        useEffect(() => {
            if (history.location.pathname && routes) {
                findParentElement(routes, history.location.pathname);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [history.location.pathname, routes]);

        return (
            <>
                <PageHeaderNew title={''} isOpen={sideBarOpen} setIsOpen={setSideBarOpen} />
                <Box sx={{ display: 'flex', height: '100vh', position: 'relative' }}>
                    <Box sx={{ width: sideBarOpen ? '185px' : '0px', transition: '0.3s' }}>
                        <MenuItemsNew
                            key={'menu-items'}
                            routes={routes}
                            open={sideBarOpen}
                            closeSideNav={() => setSideBarOpen(false)}
                            neededMenus={arrOfNeededMenus}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            transition: '0.3s',
                            width: sideBarOpen ? 'calc(100vw - 285px)' : 'calc(100vw - 60px)',
                            marginLeft: 'auto',
                        }}
                    >
                        {arrOfNeededRoutes.map((menu, index) => {
                            return <SubMenu index={index} menuItems={menu} neededMenus={arrOfNeededMenus} />;
                        })}
                        <Container sx={{ display: 'flex', flex: 1 }} style={{ paddingRight: 0 }} maxWidth={false}>
                            {children}
                        </Container>
                    </Box>
                </Box>
            </>
        );
    },
);

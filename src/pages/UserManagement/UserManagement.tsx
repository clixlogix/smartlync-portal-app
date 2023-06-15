/**
 *
 * UserManagement
 *
 */
import React, { useState, memo, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQueryParam, useLocalStorage } from 'utils';
import { DashboardFilter } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { FilterNames, Filters, LoadingValue } from 'models';
import { buildAvailableFiltersFromData, buildFiltersFromData } from 'utils';
import { Page, PageProps } from 'pages';

import Constant from 'constants/index';

import 'pages/../../node_modules/react-grid-layout/css/styles.css';
import 'pages/../../node_modules/react-resizable/css/styles.css';
import 'scss/main.scss';
import './UserManagement.scss';
import { useDispatch } from 'react-redux';
import { UserManagementWidgetProperty } from 'widgets';
import UserTable from 'components/userTable/userTable.component';

interface UserManagementProps extends PageProps {}

const pageFilters = [...(UserManagementWidgetProperty?.defaultFilters || [])];

const originalLayouts = {
    lg: [
        {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: 'key-user-management-widget-0',
        },
    ],
};

export const UserManagement: Page<UserManagementProps> = memo((props: UserManagementProps) => {
    const [plantId] = useQueryParam<string>(FilterNames.plantId, '1', true);
    const dispatch = useDispatch();

    const [filters, setFilters] = useState<Filters>({
        [FilterNames.plantId]: plantId,
        ...buildFiltersFromData(pageFilters),
        // add your default filters for this page here ...
        [FilterNames.systemType]: 'SWS',
    });

    const [editPageLayout, setEditPageLayout] = useState<boolean>(false);
    const [layouts, setLayouts] = useLocalStorage<any>(Constant.storageKeys.userManagementPage, originalLayouts);

    const onHandleEditClick = () => {
        setEditPageLayout(!editPageLayout);
    };

    const onLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
    };

    const [availableFilters] = useState<DashboardFilter[]>(buildAvailableFiltersFromData(pageFilters));

    const onFilterChange = (filter: Filters) => {
        setFilters({ ...filters, ...filter });
    };

    const [loadingState, setLoadingState] = useState<LoadingValue>({});
    const updateLoadingState = (key: string, loading: boolean) => {
        loadingState[key] = loading;
        setLoadingState(loadingState);
    };
    const isLoading: boolean = useMemo(() => {
        return [
            ...(Object.values(loadingState) as boolean[]),
            // add your isLoading here
        ].reduce((acc: boolean, value: boolean) => {
            acc = acc ? acc : value;
            return acc;
        }, false);
    }, [
        loadingState,
        // add your other Widget isLoading code here
    ]);

    const crumbs = [
        { name: FilterNames.plantId, label: `Plant : ${plantId}` },
        { name: FilterNames.systemType, menu: filters[FilterNames.systemType], options: ['SWS', 'SPR', 'SAT'] },
    ];
    const onBreadcrumbChange = (crumb: string | Filters) => {
        if (typeof crumb === 'string') {
        }
    };

    if (filters[FilterNames.deviceName]) {
        crumbs.push(filters[FilterNames.deviceName]);
    }

    return (
        <>
            <Helmet>
                <title>userManagement</title>

                <meta name="description" content="Description of UserManagement" />
            </Helmet>
            <UserTable />
        </>
    );
});

export default UserManagement;

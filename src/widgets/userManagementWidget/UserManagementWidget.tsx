/**
 *
 * UserManagementWidget
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';

import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    userManagementWidgetActions,
    userManagementWidgetReducer,
    userManagementWidgetKey,
} from 'services/user-management-widget/user-management-widget-reducer';
import {
    selectUserManagementWidgets,
    selectUserManagementWidgetIsLoading,
} from 'services/user-management-widget/user-management-widget-selectors';

import { getAllUserManagementWidgetsSaga } from 'services/user-management-widget/sagas/user-management-widget-saga-get-all';
import { getUserManagementWidgetByIdSaga } from 'services/user-management-widget/sagas/user-management-widget-saga-get-by-id';

import { Filters, UserManagementWidgets } from 'models';
import Table from 'components/Table';
import {
    DashboardFilter,
    DateFilterData,
    FilterType,
    SelectFilterData,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';

import 'scss/main.scss';
import './UserManagementWidget.scss';

interface UserManagementWidgetProps extends WidgetProps {}

export const UserManagementWidget: Widget<UserManagementWidgetProps> = memo((props: UserManagementWidgetProps) => {
    const { className = '', filters = {} } = props;
    useInjectReducer({ key: userManagementWidgetKey, reducer: userManagementWidgetReducer });

    useInjectSaga({ key: userManagementWidgetKey, saga: getAllUserManagementWidgetsSaga });
    useInjectSaga({ key: userManagementWidgetKey, saga: getUserManagementWidgetByIdSaga });

    const userManagementWidgets: UserManagementWidgets | undefined = useSelector(selectUserManagementWidgets);
    const userManagementWidgetIsLoading: boolean = useSelector(selectUserManagementWidgetIsLoading);
    const dispatch = useDispatch();

    const displayRows = useMemo(() => {
        return userManagementWidgets || []; // .filter((row) => !row.hidden);
    }, [userManagementWidgets]);

    if (props.isLoading) {
        props.isLoading(userManagementWidgetIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        ...defaultFilters,
        // add your filters here
        ...filters,
    });

    useEffect(() => {
        dispatch(userManagementWidgetActions.getAllUserManagementWidgets(widgetFilters));
    }, [dispatch, widgetFilters]);

    return <Div className={` ${className} x-cls-user-management-widget-widget`}></Div>;

    /*
        const tableTheme = useMemo(() => {
            const obj: any = {
                root: {
                    '&$disabled': {
                        color: '#ffdb38',
                    },
                },
                MuiTableCell: {
                    root: {
                        font: 'normal normal normal 18px/60px Open Sans',
                    },
                },
                MUIDataTableBodyCell: {
                    stackedCommon: {
                        color: '#fff',
                        textAlign: 'center',
                    },
                },
            };

            return obj;
        }, []);

        const columns = [];

        const options = {
            filterType: 'checkbox',
            elavation: 4,
            enableNestedDataAccess: '.',
            // responsive: 'scrollMaxHeight',
            // responsive: 'sstackedcroll',
            // onRowClick: handleOnRowClick,
        };

        return (
            <Div className={`${className} x-cls-user-management-widget-widget`}>
                <SizeMe>
                    {({ size }) => {
                        const { height = 0 } = size as any;
                        const tableBodyHeight = height - 220;

                        return (
                            <Table
                                className={`x-cls-user-management-widget-widget-table`}
                                data={displayRows}
                                columns={columns}
                                options={ { ...options, tableBodyHeight } }
                                themeObj={tableTheme}
                            />
                        );
                    }}
                </SizeMe>
            </Div>
        );
      */
});

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
*/
];
export const UserManagementWidgetProperty = Object.assign(
    {},
    {
        defaultFilters: defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 0,
            w: 2,
            h: 3,
            minW: 1,
            minH: 1,
        },
    },
);

export default UserManagementWidget;

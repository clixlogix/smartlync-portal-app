/**
 *
 * MaintainanceActionTable
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    maintainanceActionTableActions,
    maintainanceActionTableReducer,
    maintainanceActionTableKey,
} from 'services/maintainance-action-table/maintainance-action-table-reducer';
import {
    selectMaintainanceActionTables,
    selectMaintainanceActionTableIsLoading,
} from 'services/maintainance-action-table/maintainance-action-table-selectors';

import { getAllMaintainanceActionTablesSaga } from 'services/maintainance-action-table/sagas/maintainance-action-table-saga-get-all';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { Filters, MaintainanceActionTables, FilterNames } from 'models';
import { GridTable } from 'components/GridTable';

import { WidgetProps, Widget } from 'widgets';

import 'scss/main.scss';
import './MaintainanceActionTable.scss';

interface MaintainanceActionTableProps extends WidgetProps {}

export const MaintainanceActionTableWidget: Widget<MaintainanceActionTableProps> = memo(
    (props: MaintainanceActionTableProps) => {
        const { className = '', filters = {} } = props;
        useInjectReducer({ key: maintainanceActionTableKey, reducer: maintainanceActionTableReducer });

        useInjectSaga({ key: maintainanceActionTableKey, saga: getAllMaintainanceActionTablesSaga });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { t } = useTranslation();

        const maintainanceActionTables: MaintainanceActionTables | undefined = useSelector(
            selectMaintainanceActionTables,
        );
        const maintainanceActionTableIsLoading: boolean = useSelector(selectMaintainanceActionTableIsLoading);

        const dispatch = useDispatch();

        const tableData = useMemo(() => {
            return maintainanceActionTables || []; // .filter((row) => !row.hidden);
        }, [maintainanceActionTables]);

        if (props.isLoading) {
            props.isLoading(maintainanceActionTableIsLoading);
        }

        const [widgetFilters] = useState<Filters>({
            ...defaultFilters,
            // add your filters here
            ...filters,
        });

        useEffect(() => {
            dispatch(maintainanceActionTableActions.getAllMaintainanceActionTables(widgetFilters));
        }, [dispatch, widgetFilters]);

        const tableColumns = [
            { field: 'date', headerName: 'Date', minWidth: '150' },
            {
                field: 'shiftInTime',
                minWidth: '150',
                headerName: 'Shift Time-in',
            },
            {
                field: 'plantStation',
                minWidth: '250',
                headerName: 'Plant Station',
            },
            {
                field: 'boltType',
                minWidth: '200',
                headerName: 'Bolt Type',
            },
            { field: 'service', minWidth: '200', headerName: 'Service' },
            { field: 'comment', minWidth: '380', headerName: 'Comment' },
            {
                field: 'otherReadings',
                minWidth: '280',
                headerName: 'Other meter readings',
            },
        ];

        return (
            <Div className={`${className} x-cls-maintainance-action-table-widget`}>
                <GridTable tableColumns={tableColumns} tableRows={tableData} />
            </Div>
        );
    },
);

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
];
export const MaintainanceActionTableProperty = Object.assign(
    {},
    {
        defaultFilters: defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 0,
            w: 2,
            h: 4,
            minW: 1,
            minH: 1,
        },
    },
);

export default MaintainanceActionTableWidget;

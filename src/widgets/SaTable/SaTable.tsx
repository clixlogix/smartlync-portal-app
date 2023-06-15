/**
 *
 * SaTable
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { saTableActions, saTableReducer, saTableKey } from 'services/sa-table/sa-table-reducer';
import { selectSaTables, selectSaTableIsLoading } from 'services/sa-table/sa-table-selectors';
import { getAllSaTablesSaga } from 'services/sa-table/sagas/sa-table-saga-get-all';
import { FilterNames, Filters, SaTables } from 'models';
import { WidgetProps, Widget } from 'widgets';
import GridTable from 'components/GridTable';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { messages } from './messages';
import { initialColumns } from './saTableColumns';

import 'scss/main.scss';
import './SaTable.scss';
import Loader from 'components/Loader';

interface SaTableProps extends WidgetProps {}

export const SaTableWidget: Widget<SaTableProps> = memo((props: SaTableProps) => {
    const { className = '', filters = {} } = props;

    useInjectReducer({ key: saTableKey, reducer: saTableReducer });
    useInjectSaga({ key: saTableKey, saga: getAllSaTablesSaga });

    const { t } = useTranslation();

    const saTables: SaTables | undefined = useSelector(selectSaTables);
    const saTableIsLoading: boolean = useSelector(selectSaTableIsLoading);
    const dispatch = useDispatch();

    const displayRows = useMemo(() => {
        return saTables || []; // .filter((row) => !row.hidden);
    }, [saTables]);

    const columns = initialColumns.map((col) => {
        return {
            field: col.name,
            headerName: t(messages[col.name]),
            ...col,
        };
    });

    if (props.isLoading) {
        props.isLoading(saTableIsLoading);
    }

    const [widgetFilters] = useState<Filters>({
        ...defaultFilters,
        // add your filters here
        ...filters,
    });

    useEffect(() => {
        dispatch(saTableActions.getAllSaTables(widgetFilters));
    }, [dispatch, widgetFilters]);

    return !saTableIsLoading || (saTables || []).length > 0 ? (
        <Div className={`${className} x-cls-sa-table-widget`}>
            <GridTable className={`x-cls-sa-table-widget-table`} tableRows={displayRows} tableColumns={columns} />
        </Div>
    ) : (
        <Loader />
    );
});

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    { name: FilterNames.stationName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
];
export const SaTableProperty = Object.assign(
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

export default SaTableWidget;

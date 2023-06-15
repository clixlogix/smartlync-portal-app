/**
 *
 * CarBodyGraph
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    carBodyGraphActions,
    carBodyGraphReducer,
    carBodyGraphKey,
} from 'services/car-body-graph/car-body-graph-reducer';
import { selectCarBodyGraphs, selectCarBodyGraphIsLoading } from 'services/car-body-graph/car-body-graph-selectors';
import { getAllCarBodyGraphsSaga } from 'services/car-body-graph/sagas/car-body-graph-saga-get-all';
import { Filters, CarBodyGraphs, FilterNames } from 'models';
import { FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { WeldSignalChart } from 'components';
import { messages } from './messages';

import 'scss/main.scss';
import './CarBodyGraph.scss';

interface CarBodyGraphProps extends WidgetProps {}

export const CarBodyGraphWidget: Widget<CarBodyGraphProps> = memo((props: CarBodyGraphProps) => {
    const { className = '', filters = {} } = props;

    useInjectReducer({ key: carBodyGraphKey, reducer: carBodyGraphReducer });
    useInjectSaga({ key: carBodyGraphKey, saga: getAllCarBodyGraphsSaga });

    const { t, i18n } = useTranslation();

    const carBodyGraphs: CarBodyGraphs | undefined = useSelector(selectCarBodyGraphs);
    const carBodyGraphIsLoading: boolean = useSelector(selectCarBodyGraphIsLoading);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(carBodyGraphIsLoading);
    }
    const [widgetFilters] = useState<Filters>({
        [FilterNames.view]: 'voltage',
        // add your filters here
        ...filters,
    });

    const serviceFilters = useMemo(
        (): Filters => ({ [FilterNames.langCode]: i18n.language, ...widgetFilters, ...filters }),
        [widgetFilters, filters, i18n.language],
    );

    useEffect(() => {
        const { carbodyId = '', studId = '' } = serviceFilters as Filters;
        const weldId = serviceFilters[FilterNames.weldId] || undefined;

        if (carbodyId || studId || weldId) {
            dispatch(
                carBodyGraphActions.getAllCarBodyGraphs({
                    ...serviceFilters,
                    [FilterNames.carbodyId]: carbodyId,
                    [FilterNames.studId]: studId,
                    [FilterNames.weldId]: weldId,
                }),
            );
        }
    }, [dispatch, serviceFilters]);

    return (
        <Div className={`${className} x-cls-car-body-graph-widget-chart`}>
            <WeldSignalChart
                title="Carbody Risk Weld"
                color="green"
                data={carBodyGraphs}
                nodatamessage={t(messages.noData)}
                nodatamessageSub={t(messages.noDataSub)}
            />
        </Div>
    );
});

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    {
        name: FilterNames.carBody,
        type: FilterType.Select,
        label: 'Filters.CarBodyIDLabel',
        placeholder: 'Filters.FilterByCarBodyIDPlaceholder',
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.studId,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.engine,
        type: FilterType.Select,
        label: 'Filters.EngineLabel',
        placeholder: 'Filters.FilterByEnginePlaceholder',
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.carModel,
        type: FilterType.Select,
        label: 'Filters.CarModelLabel',
        placeholder: 'Filters.FilterByCarModelPlaceholder',
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.carTypeId,
        type: FilterType.Select,
        label: 'Filters.CarTypeLabel',
        placeholder: 'Filters.FilterByCarTypePlaceholder',
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.direction,
        type: FilterType.Select,
        label: 'Filters.DirectionLabel',
        placeholder: 'Filters.FilterByDirectionPlaceholder',
        data: { options: [] } as SelectFilterData,
    },
];
export const CarBodyGraphProperty = Object.assign(
    {},
    {
        defaultFilters: defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 0,
            w: 3,
            h: 2,
            minW: 1,
            minH: 1,
        },
    },
);

export default CarBodyGraphWidget;

/**
 *
 * CycleGap
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { cycleGapActions, cycleGapReducer, cycleGapKey } from 'services/cycle-gap/cycle-gap-reducer';
import {
    selectCycleGapIsLoading,
    selectFormattedCycleGaps,
    selectFormattedCycleGapEvents,
} from 'services/cycle-gap/cycle-gap-selectors';
import { getAllCycleGapsSaga } from 'services/cycle-gap/sagas/cycle-gap-saga-get-all';
import {
    cycleGapMetaDataActions,
    cycleGapMetaDataReducer,
    cycleGapMetaDataKey,
} from 'services/cycle-gap-meta-data/cycle-gap-meta-data-reducer';
import { getAllCycleGapMetaDatasSaga } from 'services/cycle-gap-meta-data/sagas/cycle-gap-meta-data-saga-get-all';
import { selectDeviceNames } from 'services/device/device-name/device-name-selectors';
import { Filters, FilterNames, SidePanelOpenState, DeviceNames, Stations, CycleGapLocalFilter } from 'models';
import { Chart } from 'components/panels';
import { DashboardFilter, FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { ChartRef } from 'components/panels/Chart/Chart';
import moment from 'moment';
import ToggleButton, { ToggleButtonProps } from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { messages } from './messages';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import has from 'lodash/has';
import './CycleGap.scss';
import { ExtraPanel } from './ExtraPanel/ExtraPanel';
import { Options } from 'highcharts';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import { selectStations } from 'services/station/station-selectors';

interface CycleGapProps extends WidgetProps {
    localFilters?: Filters;
    getRef?(ref: ChartRef);
    refs?: ChartRef[];
    onFilterChange?(filter: Filters);
}

export const CycleGapWidget: Widget<CycleGapProps> = memo((props: CycleGapProps) => {
    const { className = '', filters = {}, onFilterChange = () => { } } = props;
    useInjectReducer({ key: cycleGapKey, reducer: cycleGapReducer });

    useInjectSaga({ key: cycleGapKey, saga: getAllCycleGapsSaga });

    useInjectReducer({ key: cycleGapMetaDataKey, reducer: cycleGapMetaDataReducer });
    useInjectSaga({ key: cycleGapMetaDataKey, saga: getAllCycleGapMetaDatasSaga });

    const { t, i18n } = useTranslation();

    const formattedCycleGaps: any = useSelector(selectFormattedCycleGaps);
    const formattedCycleGapEvents: any = useSelector(selectFormattedCycleGapEvents);

    const cycleGapIsLoading: boolean = useSelector(selectCycleGapIsLoading);

    const deviceNames: DeviceNames = useSelector(selectDeviceNames);
    const stations: Stations = useSelector(selectStations);

    const [extraPanelState, setExtraPanelState] = useState<SidePanelOpenState>(SidePanelOpenState.Close);

    const [isEmptyData, setEmptyData] = useState<boolean>(false);

    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(cycleGapIsLoading);
    }

    const [wipOrWop, setWipOrWop] = useState(null);
    const GROUP_BY_DEFAULT = 'deviceName,outletNo,feederNo,studId';
    const [widgetFilters /*, setWidgetFilters*/] = useState<Filters>({
        // add your filters here
        ...filters,
        [FilterNames.groupBy]: GROUP_BY_DEFAULT,
    });
    const serviceFilters = useMemo(
        () => ({
            [FilterNames.langCode]: i18n.language,
            [FilterNames.deviceName]: deviceNames[0],
            [FilterNames.station]: stations[0],
            ...widgetFilters,
            ...filters,
        }),
        [i18n.language, widgetFilters, filters, deviceNames, stations],
    );
    useEffect(
        () => {
            onFilterChange({
                ...serviceFilters,
                [FilterNames.groupBy]: serviceFilters.groupBy,
                [FilterNames.deviceName]: deviceNames[0],
                [FilterNames.station]: stations[0],
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deviceNames, stations, serviceFilters.groupBy],
    );

    useEffect(
        () => {
            if (isEmpty(formattedCycleGaps)) {
                setEmptyData(true);
            } else {
                setEmptyData(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [formattedCycleGaps],
    );

    useEffect(() => {
        const filter = omitBy(
            {
                [FilterNames.deviceName]: serviceFilters.deviceName,
                [FilterNames.station]: serviceFilters.station,
                [FilterNames.langCode]: serviceFilters.selectedLanguage,
                [FilterNames.fromTime]: serviceFilters.fromTime,
                [FilterNames.toTime]: serviceFilters.toTime,
                [FilterNames.systemType]: serviceFilters.systemType,
                [FilterNames.plantId]: serviceFilters.plantId,
                [FilterNames.groupBy]: serviceFilters.groupBy,
                structured: true,
            },
            isNil,
        );
        if (!filter[FilterNames.groupBy]) {
            filter[FilterNames.groupBy] = GROUP_BY_DEFAULT;
        }
        has(filter, [FilterNames.deviceName]) &&
            has(filter, [FilterNames.station]) &&
            dispatch(
                cycleGapActions.getAllCycleGaps({
                    filter,
                    localFilters: omitBy(
                        {
                            [FilterNames.studId]: serviceFilters.studId,
                            [FilterNames.outletNo]: serviceFilters.outletNo,
                            [FilterNames.feederNo]: serviceFilters.feederNo,
                            wip: wipOrWop,
                        },
                        isNil,
                    ),
                }),
            );
    }, [
        dispatch,
        serviceFilters.deviceName,
        serviceFilters.station,
        serviceFilters.fromTime,
        serviceFilters.selectedLanguage,
        serviceFilters.station,
        serviceFilters.systemType,
        serviceFilters.plantId,
        serviceFilters.toTime,
        serviceFilters.groupBy,
    ]);

    useEffect(() => {
        const filter = omitBy(
            {
                [FilterNames.studId]: serviceFilters.studId,
                [FilterNames.outletNo]: serviceFilters.outletNo,
                [FilterNames.feederNo]: serviceFilters.feederNo,
                wip: wipOrWop,
            },
            isNil,
        ) as CycleGapLocalFilter;

        dispatch(cycleGapActions.localFiltering(filter));
    }, [dispatch, serviceFilters.studId, serviceFilters.outletNo, serviceFilters.feederNo, wipOrWop]);

    const theme = useTheme();
    const textColor = theme.palette.text.primary;
    const options: Options = {
        chart: {
            type: 'scatter',
            zoomType: 'xy',
        },
        title: {
            text: t(messages.cycleGapGraphTitle, {
                stationName: serviceFilters[FilterNames.station] || serviceFilters.station || t(messages.none),
            }),
        },
        legend: {
            enabled: formattedCycleGaps.length > 0 ? true : false,
        },
        xAxis: {
            type: 'datetime',
            labels: {
                step: 1,
            },
            scrollbar: {
                enabled: true,
            },
            min: moment(filters.fromTime).valueOf(),
            max: moment(filters.toTime).add(2, 'hours').valueOf(),
        },
        tooltip: {
            useHTML: true,
            headerFormat: '<table><tr><th colspan="2">{series.name}</th></tr>',
            pointFormat:
                '<tr><td style="color: {series.color}">Time : </td>' +
                '<td style="text-align: left"><b>{point.time}</b></td></tr>' +
                '<tr><td style="color: {series.color}">CycleGap : </td>' +
                '<td style="text-align: left"><b>{point.gap} minutes</b></td></tr>' +
                '<tr><td style="color: {series.color}">FeederNo : </td>' +
                '<td style="text-align: left"><b>{point.feederNo}</b></td></tr>' +
                '<tr><td style="color: {series.color}">OutletNo : </td>' +
                '<td style="text-align: left"><b>{point.outletNo}</b></td></tr>' +
                '<tr><td style="color: {series.color}">WIP : </td>' +
                '<td style="text-align: left"><b>{point.wip}</b></td></tr>' +
                '<tr><td style="color: {series.color}">StudId : </td>' +
                '<td style="text-align: left"><b>{point.studId}</b></td></tr>',
            footerFormat: '</table>',
        },
        yAxis: [
            {
                type: 'logarithmic',
                height: '70%',
                gridLineColor: '#424242',
                title: {
                    text: t(messages.unitslabel),
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: textColor,
                    },
                },
                labels: {
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: textColor,
                    },
                },
                tickmarkPlacement: 'on',
                minorTickInterval: 0.1,
                plotLines: [
                    {
                        value: 45,
                        width: 1,
                        color: '#999',
                    },
                ],
            },
            {
                top: '75%',
                height: '20%',
                gridLineColor: '#424242',
                title: {
                    text: t(messages.eventTypeLabel),
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: textColor,
                    },
                },
                labels: {
                    x: 55,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: textColor,
                    },
                },
                tickmarkPlacement: 'between',
                tickColor: 'transparent',
                categories: [t('Filters.Info'), t('Filters.Fault'), t('Filters.Warning')],
                min: 0,
                max: 2,
                reversed: true,
            },
        ],
        series: [...formattedCycleGaps, ...formattedCycleGapEvents],
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            if (!isEmpty(filters)) {
                                dispatch(
                                    cycleGapMetaDataActions.getAllCycleGapMetaDatas({
                                        systemType: filters?.systemType,
                                        plantId: filters?.plantId,
                                        deviceName: this?.series?.name,
                                        fromTime: this?.series?.options?.data[this.index]?.time,
                                        toTime: this?.series?.options?.data[this.index]?.time,
                                        feederNo: this?.series?.options?.data[this.index]?.feederNo,
                                        outletNo: this?.series?.options?.data[this.index]?.outletNo,
                                        studId: this?.series?.options?.data[this.index]?.studId,
                                        graphData: false,
                                    }),
                                );
                                setExtraPanelState(SidePanelOpenState.Open);
                            }
                        },
                    },
                },
            },
            scatter: {
                turboThreshold: 100000000,
            },
        },
    };

    const handleMoreClick = () => {
        if (extraPanelState === 'open') {
            setExtraPanelState(SidePanelOpenState.Close);
        } else {
            setExtraPanelState(SidePanelOpenState.Open);
        }
    };

    const handleWipWop = (event, wipOrWop = null) => {
        setWipOrWop(wipOrWop);
    };

    const WipWopButton = styled(ToggleButton)<ToggleButtonProps>(() => ({
        width: '60px',
    }));

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                position: 'relative',
                marginTop: '50px',
                padding: '10px',
            }}
        >
            <Button
                variant="contained"
                size="small"
                sx={{ position: 'absolute', top: '-30px', right: '23px', display: 'flex' }}
                onClick={handleMoreClick}
            >
                {extraPanelState === SidePanelOpenState.Close ? 'Details' : 'Close'}
            </Button>
            <Chart
                chartType={'scatter'}
                xChartTitle=""
                yChartTitle=""
                className={` ${className} x-cls-cycle-gap-widget`}
                options={options}
                isLoading={cycleGapIsLoading}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: '-40px',
                    right: extraPanelState === SidePanelOpenState.Close ? '120px' : '430px',
                }}
            >
                <ToggleButtonGroup
                    size="medium"
                    value={wipOrWop}
                    exclusive
                    onChange={handleWipWop}
                    aria-label={'Wip/Wop'}
                >
                    <WipWopButton value={null} aria-label={'All'} disabled={isEmptyData}>
                        ALL
                    </WipWopButton>
                    <WipWopButton value={true} aria-label={'WOP'} disabled={isEmptyData}>
                        WIP
                    </WipWopButton>
                    <WipWopButton value={false} aria-label={'WOP'} disabled={isEmptyData}>
                        WOP
                    </WipWopButton>
                </ToggleButtonGroup>
            </Box>

            {extraPanelState === SidePanelOpenState.Open && <ExtraPanel extraPanelState={extraPanelState} />}
        </Box>
    );
});

// extra widget properties
const defaultFilters: DashboardFilter[] = [
    {
        name: FilterNames.station,
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
        disableClearable: true,
    },
    { name: FilterNames.deviceName, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    { name: FilterNames.studId, type: FilterType.Select, data: { options: [] } as SelectFilterData },
    {
        name: FilterNames.outletNo,
        label: 'Filters.OutletLabel',
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.feederNo,
        label: 'Filters.FeederLabel',
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.groupBy,
        label: 'Filters.GroupBy',
        type: FilterType.Select,
        multiple: true,
        data: {
            options: ['deviceName', 'outletNo', 'feederNo', 'studId'],
        } as SelectFilterData,
    },
];

export const CycleGapProperty = Object.assign(
    {},
    {
        defaultFilters: defaultFilters,
        type: 'panel',
        layout: {
            x: 0,
            y: 0,
            w: 4,
            h: 5,
            minW: 1,
            minH: 1,
        },
    },
);

export default CycleGapWidget;

/**
 *
 * CycleGapSpr
 *
 */

import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { cycleGapSprActions, cycleGapSprReducer, cycleGapSprKey } from 'services/cycle-gap-spr/cycle-gap-spr-reducer';
import {
    selectCycleGapSprIsLoading as selectCycleGapIsLoading,
    selectFormattedCycleSprGaps as selectFormattedCycleGaps,
    selectFormattedCycleGapSprEvents,
} from 'services/cycle-gap-spr/cycle-gap-spr-selectors';
import moment from 'moment';
import { getAllCycleGapSprsSaga as getAllCycleGapsSaga } from 'services/cycle-gap-spr/sagas/cycle-gap-spr-saga-get-all';
import {
    cycleGapMetaDataSprActions,
    cycleGapMetaDataSprReducer,
    cycleGapMetaDataSprKey,
} from 'services/cycle-gap-meta-data-spr/cycle-gap-meta-data-spr-reducer';
import { selectStations } from 'services/station/station-selectors';

import { getAllCycleGapMetaDataSprsSaga } from 'services/cycle-gap-meta-data-spr/sagas/cycle-gap-meta-data-spr-saga-get-all';
import { selectDeviceNames } from 'services/device/device-name/device-name-selectors';
import { Filters, FilterNames, SidePanelOpenState, DeviceNames, Stations } from 'models';
import { Chart } from 'components/panels';
import { DashboardFilter, FilterType, SelectFilterData } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import { ChartRef } from 'components/panels/Chart/Chart';
import { messages } from './messages';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';

import { ExtraPanel } from './ExtraPanel/ExtraPanel';
import { Options } from 'highcharts';
import { Box } from '@mui/material';

interface CycleGapProps extends WidgetProps {
    localFilters?: Filters;
    getRef?(ref: ChartRef);
    refs?: ChartRef[];
    onFilterChange?(filter: Filters);
}

let tenant = window.location.href.replace('http://', '').replace('https://', '').split('.')[0];
const environment = window.location.href
    .replace('http://', '')
    .replace('https://', '')
    .split('.')[1]
    .toLocaleLowerCase();
tenant = tenant === 'demo' && environment === 'stage' ? 'demoStage' : tenant;

export const CycleGapSprWidget: Widget<CycleGapProps> = memo((props: CycleGapProps) => {
    const { className = '', filters = {}, onFilterChange = () => { } } = props;
    useInjectReducer({ key: cycleGapSprKey, reducer: cycleGapSprReducer });

    useInjectSaga({ key: cycleGapSprKey, saga: getAllCycleGapsSaga });

    useInjectReducer({ key: cycleGapMetaDataSprKey, reducer: cycleGapMetaDataSprReducer });
    useInjectSaga({ key: cycleGapMetaDataSprKey, saga: getAllCycleGapMetaDataSprsSaga });

    const { t, i18n } = useTranslation();

    const formattedCycleGaps: any = useSelector(selectFormattedCycleGaps);
    const formattedCycleGapSprEvents: any = useSelector(selectFormattedCycleGapSprEvents);

    const cycleGapIsLoading: boolean = useSelector(selectCycleGapIsLoading);

    const deviceNames: DeviceNames = useSelector(selectDeviceNames);
    const stations: Stations = useSelector(selectStations);
    const [extraPanelState, setExtraPanelState] = useState<SidePanelOpenState>(SidePanelOpenState.Close);

    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(cycleGapIsLoading);
    }
    const GROUP_BY_DEFAULT = 'deviceName,outletNo,program';
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
        [i18n.language, deviceNames, stations, widgetFilters, filters],
    );

    useEffect(
        () => {
            onFilterChange({
                ...serviceFilters,
                [FilterNames.groupBy]: serviceFilters.groupBy,
                [FilterNames.deviceName]: deviceNames[0],
                [FilterNames.station]: tenant === 'jlr' ? 'Z10LH_050' : stations[0],
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deviceNames, stations, serviceFilters.groupBy],
    );

    useEffect(() => {
        const filter = omitBy(
            {
                [FilterNames.plantId]: serviceFilters.plantId,
                [FilterNames.deviceName]: serviceFilters.deviceName,
                [FilterNames.station]: serviceFilters.station,
                [FilterNames.fromTime]: serviceFilters.fromTime,
                [FilterNames.toTime]: serviceFilters.toTime,
                [FilterNames.systemType]: serviceFilters.systemType,
                [FilterNames.plantId]: serviceFilters.plantId,
                [FilterNames.station]: serviceFilters.station,
                [FilterNames.groupBy]: serviceFilters.groupBy,
            },
            isNil,
        );
        if (!filter[FilterNames.groupBy]) {
            filter[FilterNames.groupBy] = GROUP_BY_DEFAULT;
        }
        has(filter, [FilterNames.deviceName]) &&
            has(filter, [FilterNames.station]) &&
            dispatch(
                cycleGapSprActions.getAllCycleGapSprs({
                    filter,
                    localFilters: omitBy(
                        {
                            [FilterNames.studId]: serviceFilters.studId,
                            [FilterNames.outletNo]: filters.outletNo,
                        },
                        isNil,
                    ),
                }),
            );
    }, [
        dispatch,
        serviceFilters.plantId,
        serviceFilters.deviceName,
        serviceFilters.station,
        serviceFilters.fromTime,
        serviceFilters.selectedLanguage,
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
            },
            isNil,
        );
        dispatch(cycleGapSprActions.localFiltering(filter));
    }, [dispatch, serviceFilters.studId, serviceFilters.outletNo]);

    const theme = useTheme();
    const textColor = theme.palette.text.primary;

    const options: Options = {
        chart: {
            type: 'scatter',
            zoomType: 'xy',
            height: window.innerHeight - 210,
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
                '<tr><td style="color: {series.color}">OutletNo : </td>' +
                '<td style="text-align: left"><b>{point.outletNo}</b></td></tr>' +
                '<tr><td style="color: {series.color}">Program : </td>' +
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
                categories: ['Regler', 'Feeder', 'Spindle'],
                min: 0,
                max: 2,
                reversed: true,
            },
        ],
        series: [...formattedCycleGaps, ...formattedCycleGapSprEvents],
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            if (!isEmpty(filters)) {
                                dispatch(
                                    cycleGapMetaDataSprActions.getAllCycleGapMetaDataSprs({
                                        plantId: filters.plantId,
                                        systemType: filters?.systemType,
                                        deviceName: this?.series?.name,
                                        fromTime: this?.series?.options?.data[this.index]?.time,
                                        toTime: this?.series?.options?.data[this.index]?.time,
                                        outletNo: this?.series?.options?.data[this.index]?.outletNo,
                                        program: this?.series?.options?.data[this.index]?.studId,
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
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Button
                variant="contained"
                size="small"
                // sx={{ position: 'absolute', top: '0px', right: '23px', display: 'flex' }}
                sx={{ marginLeft: 'auto', marginRight: '20px' }}
                onClick={handleMoreClick}
            >
                {extraPanelState === SidePanelOpenState.Close ? 'Details' : 'Close'}
            </Button>
            <Box
                sx={{
                    opacity: 1,
                    padding: '10px',
                    display: 'flex',
                    position: 'relative',
                    //  height: 'calc(100vh - 210px)',
                    // height: window.innerHeight - 171,
                    //overflowY: 'auto !important',
                }}
            >
                <Chart
                    chartType={'scatter'}
                    xChartTitle=""
                    yChartTitle=""
                    className={className}
                    options={options}
                    isLoading={cycleGapIsLoading}
                />
                {extraPanelState === SidePanelOpenState.Open && <ExtraPanel extraPanelState={extraPanelState} />}
            </Box>
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
    {
        name: FilterNames.studId,
        label: 'Program',
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.outletNo,
        label: 'Filters.OutletLabel',
        type: FilterType.Select,
        data: { options: [] } as SelectFilterData,
    },
    {
        name: FilterNames.groupBy,
        label: 'Filters.GroupBy',
        type: FilterType.Select,
        multiple: true,
        data: { options: [FilterNames.deviceName, 'outletNo', 'program'] } as SelectFilterData,
    },
];

export const CycleGapSprProperty = Object.assign(
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

export default CycleGapSprWidget;

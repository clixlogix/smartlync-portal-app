/**
 *
 * PlantCycleCountSpr
 *
 */
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import {
    plantCycleCountSprActions,
    plantCycleCountSprKey,
    plantCycleCountSprReducer,
} from 'services/SPR/plant-cycle-count-spr/plant-cycle-count-spr-reducer';
import {
    selectPlantCycleCountSprIsLoading,
    selectPlantCycleCountSprs,
} from 'services/SPR/plant-cycle-count-spr/plant-cycle-count-spr-selectors';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

import { getAllPlantCycleCountSprsSaga } from 'services/SPR/plant-cycle-count-spr/sagas/plant-cycle-count-spr-saga-get-all';
import { FilterNames, Filters, ReportingDataView } from 'models';
import moment from 'moment';
import { formatNumber, useQueryParam } from 'utils';
import { Widget, WidgetProps } from 'widgets';
import { messages } from './messages';
import { useTheme } from '@mui/material';
import { chartTheme, ThemeModes } from 'styles/theme/themes';
import 'scss/main.scss';
import { Box, Typography } from '@mui/material';
interface PlantCycleCountSprProps extends WidgetProps {}

const chartColor = '#149B74';
// const colorWhite = '#FFFFFF';

const someFilters = {
    [FilterNames.view]: ReportingDataView.Weekly,
};

const thisYearWeeks: any[] = Array(moment(moment()).isoWeek())
    .fill('')
    .map((_, index) => {
        return index + 1;
    });

const dateKeys = ['weekNumber', 'occurredOn'];
const badKeys = ['occurredOn'];

export const PlantCycleCountSprWidget: Widget<PlantCycleCountSprProps> = memo((props: PlantCycleCountSprProps) => {
    useInjectReducer({ key: plantCycleCountSprKey, reducer: plantCycleCountSprReducer });
    useInjectSaga({ key: plantCycleCountSprKey, saga: getAllPlantCycleCountSprsSaga });
    const theme = useTheme();
    const palette = theme.palette;
    const themeMode: 'light' | 'dark' = palette.mode;

    const { filters = {} } = props;
    const { toTime } = filters;
    const { t, i18n } = useTranslation();
    const [plantId] = useQueryParam<string>('plantId', '');
    const totalCyclesData: any = useSelector(selectPlantCycleCountSprs);
    const isLoading: boolean = useSelector(selectPlantCycleCountSprIsLoading);
    // const [plantId] = useQueryParam<string>(FilterNames.plantId, '1');
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(isLoading);
    }

    const [widgetFilters] = useState<Filters>({
        ...filters,
        ...someFilters,
        [FilterNames.view]: ReportingDataView.Weekly,
        [FilterNames.plantId]: plantId,
        [FilterNames.langCode]: [i18n.language],
        // add your filters here
    });

    const serviceFilters = useMemo(
        () => ({
            [FilterNames.langCode]: i18n.language,
            ...widgetFilters,
            ...someFilters,
            ...filters,
            [FilterNames.systemType]: filters.systemType,
        }),
        [i18n.language, widgetFilters, filters],
    );

    useEffect(() => {
        dispatch(plantCycleCountSprActions.getAllPlantCycleCountSprs({ ...serviceFilters, ...filters }));
    }, [dispatch, serviceFilters, filters]);

    const data = totalCyclesData?.cyclesData?.slice() || [];
    const taData = totalCyclesData?.taData?.slice() || [];

    const getKey = (obj = {}): string => {
        const [key] = Object.keys(obj).filter((item) => dateKeys.includes(item));
        return key;
    };

    const formatDates = (data, key) => {
        if (badKeys.includes(key)) {
            return data.map((item) => {
                if (item.cycleCount) {
                    return {
                        ...item,
                        cycleCount: +item.cycleCount,
                        [key]: +moment(item[key]).startOf('isoWeek').format('w'),
                    };
                }
                return {
                    ...item,
                    ta: +item.ta,
                    [key]: +moment(item[key]).startOf('isoWeek').format('w'),
                };
            });
        }

        return data;
    };

    const getExistingDates = (indexName: string | undefined) => {
        if (!indexName) return;
        return dataWithFormattedDates.map((item) => item[indexName]);
    };

    const key = getKey(totalCyclesData?.cyclesData?.[0]);
    const dataWithFormattedDates = formatDates(data, key);
    const existingDates = getExistingDates(key);

    const taKey = getKey(taData[0]);
    const taDataWithFormattedDates = formatDates(taData, taKey);
    const taExistingDates = getExistingDates(taKey);

    thisYearWeeks.forEach((weekNumber, index) => {
        const currentItem = dataWithFormattedDates[index];
        const taCurrentItem = taDataWithFormattedDates[index];
        if (!currentItem || !existingDates.includes(weekNumber)) {
            dataWithFormattedDates.splice(index, 0, { cycleCount: 0, [key]: weekNumber });
        }
        if (!taCurrentItem || !taExistingDates.includes(weekNumber)) {
            taDataWithFormattedDates.splice(index, 0, { ta: null, [key]: weekNumber }); // ta set to null to skip while rendering (Request from Amir)
        }
    });

    const weeklyDataFormatted: [] = dataWithFormattedDates.reduce((acc, row, index) => {
        if (index !== dataWithFormattedDates.length - 1) {
            acc.push({
                name: row?.[key],
                y: row?.cycleCount,
                color:
                    index === toTime?.week() - 1
                        ? themeMode === 'light'
                            ? palette?.primary?.light
                            : palette?.primary?.dark
                        : chartColor,
                borderColor:
                    index === toTime?.week() - 1
                        ? themeMode === 'light'
                            ? palette?.primary?.light
                            : palette?.primary?.dark
                        : chartColor,
            });
        }

        if (index === dataWithFormattedDates.length - 1) {
            acc.push({
                name: row?.[key],
                y: row?.cycleCount,
                color: '#565',
                borderColor: '#ffdb0a',
            });
        }

        return acc;
    }, []);

    const taWeeklyDataFormatted: any[] = taDataWithFormattedDates.reduce((acc, row, index) => {
        acc.push({
            name: row?.[key],
            y: row?.ta,
            color: 'red',
            borderColor: 'red',
        });
        return acc;
    }, []);

    const dataLength = weeklyDataFormatted?.length || 0;

    const totalCyclesOptions = useMemo(() => {
        const options = {
            chart: {
                animation: false,
                backgroundColor: 'transparent',
                height: 250,
            },
            credits: {
                enabled: false,
            },
            title: {
                text: '',
            },

            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: false,
                    },
                },
            },
            xAxis: {
                type: 'category',
                labels: {
                    step: dataLength >= 15 ? 4 : 1,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: 'Open Sans',
                        color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    },
                },
                title: {
                    text: `${t(messages.week)}`,
                    style: {
                        color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                        fontFamily: 'Open Sans',
                    },
                },
            },
            yAxis: [
                {
                    gridLineColor: 'transparent',
                    title: {
                        text: '',
                        style: {
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                            fontFamily: 'Open Sans',
                        },
                    },
                    labels: {
                        style: {
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                            fontFamily: 'Open Sans',
                        },
                    },
                },
                {
                    gridLineColor: 'transparent',
                    opposite: true,
                    min: 0,
                    max: 100,
                    tickPositions: [0, 20, 40, 60, 80, 100],
                    title: {
                        text: 'TA %',
                        style: {
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                            fontFamily: 'Open Sans',
                        },
                    },
                    labels: {
                        style: {
                            color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                            fontFamily: 'Open Sans',
                        },
                    },
                },
            ],
            legend: {
                enabled: false,
            },
            tooltip: {
                headerFormat: undefined,
                pointFormat: `<b>{point.y} {series.name} ${t(messages.totalCyclesTooltip)} {point.name}</b>`,
                style: {
                    color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    fontFamily: 'Open Sans',
                },
                backgroundColor: palette.background.default,
            },
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG'],
                    },
                },
            },
            navigation: {
                menuItemStyle: {
                    fontFamily: 'Open Sans',
                    fontSize: '16px',
                },
            },
            series: [
                {
                    type: 'column',
                    name: 'Cycle Count',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    },
                    data: weeklyDataFormatted,
                },
                {
                    type: 'scatter',
                    name: 'TA %',
                    color: 'red',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Open Sans',
                        color: themeMode === ThemeModes.dark ? chartTheme.dark : chartTheme.light,
                    },
                    data: taWeeklyDataFormatted,
                    yAxis: 1,
                },
            ],
        };
        return options;
    }, [dataLength, t, themeMode, weeklyDataFormatted, taWeeklyDataFormatted]);

    const cycleCount = totalCyclesData?.previousWeekCyclesCountData?.[0]?.cycleCount;
    const currentWeek = taWeeklyDataFormatted.length ? taWeeklyDataFormatted[toTime?.week()]?.name : 0;

    const currentYear = useMemo(() => {
        if (moment(serviceFilters?.fromTime).year() !== moment(serviceFilters?.toTime).year()) {
            return `${moment(serviceFilters?.fromTime).year()} - ${moment(serviceFilters?.toTime).year()}`;
        }
        return `${moment(serviceFilters?.toTime).year()}`;
    }, [serviceFilters.fromTime, serviceFilters.toTime]);

    return (
        <Box
            sx={{
                flex: 1,
                minHeight: '300px',
                display: 'flex',
                flexFlow: 'column nowrap',
                paddingLeft: '15px',
                marginLeft: '20px',
                backgroundColor: themeMode === ThemeModes.dark ? chartTheme.backgroundDark : chartTheme.backgroundLight,
                boxShadow:
                    '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
            }}
        >
            <Box sx={{ display: 'flex', flexFlow: 'row wrap' }}>
                <Typography>{t(messages.totalCycles)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: ' space-between' }}>
                {currentWeek && (
                    <Box sx={{ display: 'flex', flexFlow: 'row nowrap' }}>
                        <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{ alignSelf: 'center', justifySelf: 'center' }}
                        >
                            {t(messages.currentWeekText)}: &nbsp;
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>{`${
                            currentWeek ? formatNumber(currentWeek) : ''
                        }`}</Typography>
                    </Box>
                )}
                <Box sx={{ display: 'flex', flexFlow: 'row nowrap' }}>
                    {' '}
                    <Typography variant="subtitle1" gutterBottom>
                        {`${t(messages.currentYear)}:`} {currentYear}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexFlow: 'row nowrap' }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {`${t(messages.previousWeek)}`} : &nbsp;
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>{`${
                        cycleCount ? formatNumber(cycleCount) : ''
                    }`}</Typography>
                </Box>
            </Box>
            {!Object.keys(totalCyclesData).length && !Object.keys(totalCyclesData).length ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        height: '100%',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="subtitle1" gutterBottom>
                        {t(messages.noData)}
                    </Typography>
                </Box>
            ) : (
                <HighchartsReact highcharts={Highcharts} options={totalCyclesOptions} immutable={true} />
            )}
        </Box>
    );
});

// extra widget properties
const defaultFilters = [
    /*
     { name: 'deviceName', type: FilterType.Select, label: 'Device' },
     { name: 'deviceType', type: FilterType.Select, label: 'Type' },
 */
];
export const PlantCycleCountSprProperty = Object.assign(
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

export default PlantCycleCountSprWidget;

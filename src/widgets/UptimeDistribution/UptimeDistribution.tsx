/**
 *
 * UptimeDistribution
 *
 */
import React, { useState, memo, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import styled from 'styled-components/macro';
import {
    uptimeDistributionActions,
    uptimeDistributionReducer,
    uptimeDistributionKey,
} from 'services/uptime-distribution/uptime-distribution-reducer';
import {
    selectUptimeDistributions,
    selectUptimeDistributionIsLoading,
} from 'services/uptime-distribution/uptime-distribution-selectors';
import { getAllUptimeDistributionsSaga } from 'services/uptime-distribution/sagas/uptime-distribution-saga-get-all';
import { Filters } from 'models';
import { WidgetProps, Widget } from 'widgets';
import Chart from 'components/panels/Chart';
import { messages } from './messages';

import 'scss/main.scss';
import './UptimeDistribution.scss';

interface UptimeDistributionProps extends WidgetProps {}

export const UptimeDistributionWidget: Widget<UptimeDistributionProps> = memo((props: UptimeDistributionProps) => {
    const { className = '', filters = {} } = props;

    useInjectReducer({ key: uptimeDistributionKey, reducer: uptimeDistributionReducer });
    useInjectSaga({ key: uptimeDistributionKey, saga: getAllUptimeDistributionsSaga });

    const { t } = useTranslation();

    const uptimeDistributions: [string[], number[]] = useSelector(selectUptimeDistributions);
    const uptimeDistributionIsLoading: boolean = useSelector(selectUptimeDistributionIsLoading);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(uptimeDistributionIsLoading);
    }
    const roundToFive = (num: number) => {
        return +(Math.round(+(num + 'e+5')) + 'e-5');
    };

    const getNeededValues = (values: number[]): number[] => {
        const firstPart = values.slice(0, Math.floor(values.length / 2));
        const lastPart = values.slice(Math.floor(values.length / 2));

        return [
            values[0],
            firstPart[Math.floor(firstPart.length / 2)],
            values[Math.floor(values.length / 2)],
            lastPart[Math.floor(lastPart.length / 2)],
            values[values.length - 1],
        ];
    };

    const namesNoDupl: string[] = Array.from(new Set(uptimeDistributions[0]));

    const data: number[][] = namesNoDupl.map((item, i) => {
        const sortedValues: number[] = uptimeDistributions[0]
            .reduce((acc, curr, index) => {
                curr === item && acc.push(roundToFive(uptimeDistributions[1][index]));
                return acc;
            }, [] as number[])
            .sort((a, b) => a - b);

        return getNeededValues(sortedValues);
    });

    const [widgetFilters] = useState<Filters>({
        ...defaultFilters,
        // add your filters here
        ...filters,
    });

    useEffect(() => {
        dispatch(uptimeDistributionActions.getAllUptimeDistributions(widgetFilters));
    }, [dispatch, widgetFilters]);

    const options = useMemo(
        () => ({
            chart: {
                type: 'boxplot',
                backgroundColor: '#243240',
                width: 1480,
            },

            title: {
                text: t(messages.distributionDailyText),
                align: 'left',
                x: 25,
                y: 30,
                margin: 40,
                style: {
                    color: '#FFFFFF',
                    fontsize: '20px',
                    fontWeight: '500',
                    fontFamily: 'Roboto',
                    textTransform: 'capitalize',
                },
            },

            legend: {
                enabled: false,
            },

            xAxis: {
                categories: namesNoDupl,
                labels: {
                    style: {
                        fontFamily: 'Open Sans',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    },
                },
            },

            yAxis: {
                gridLineColor: 'transparent',
                title: {
                    text: 'Uptime (min)',
                    style: {
                        fontFamily: 'Open Sans',
                        fontSize: '18px',
                        color: '#ffffff',
                    },
                },
            },
            tooltip: {
                style: {
                    fontSize: '15px',
                    fontFamily: 'Open Sans',
                    color: '#ffffff',
                },
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
                    fontSize: '16px',
                },
            },

            series: [
                {
                    name: 'Uptime (min)',
                    data,
                    color: '#149B74',
                    borderColor: '#149B74',
                    fillColor: '#ffffff',
                    tooltip: {
                        headerFormat: '<em>{point.key}</em><br/>',
                    },
                },
                {
                    name: 'Outliers',
                    type: 'scatter',
                    data: [
                        // x, y positions where 0 is the first category
                        [0, 644],
                        [1, 718],
                        [2, 951],
                        [3, 969],
                    ],
                    marker: {
                        fillColor: 'white',
                        lineWidth: 1,
                    },
                    tooltip: {
                        pointFormat: 'Uptime (min): {point.y}',
                    },
                },
            ],
        }),
        [data, namesNoDupl, t],
    );

    return (
        <Div className={`${className} x-cls-uptime-distribution-widget`}>
            <Chart
                overrideOptions={options}
                className={`x-cls-uptime-distribution-chart`}
                highchartsMore={true}
                isLoading={uptimeDistributionIsLoading}
            />
        </Div>
    );
});

const Div = styled.div``;

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
*/
];
export const UptimeDistributionProperty = Object.assign(
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

export default UptimeDistributionWidget;

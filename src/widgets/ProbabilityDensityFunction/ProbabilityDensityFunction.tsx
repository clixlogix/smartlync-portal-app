/**
 *
 * ProbabilityDensityFunction
 *
 */
import React, { /*useMemo, */ useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    probabilityDensityFunctionActions,
    probabilityDensityFunctionReducer,
    probabilityDensityFunctionKey,
} from 'services/probability-density-function/probability-density-function-reducer';
import {
    // selectProbabilityDensityFunctions,
    selectProbabilityDensityFunctionIsLoading,
} from 'services/probability-density-function/probability-density-function-selectors';
import { Chart } from 'components/panels';
import { getAllProbabilityDensityFunctionsSaga } from 'services/probability-density-function/sagas/probability-density-function-saga-get-all';

import { Filters /*, ProbabilityDensityFunctions */ } from 'models';
import { WidgetProps, Widget } from 'widgets';
// import { messages } from './messages';

import 'scss/main.scss';
import './ProbabilityDensityFunction.scss';

interface ProbabilityDensityFunctionProps extends WidgetProps {
    localFilters?: Filters;
}

export const ProbabilityDensityFunctionWidget: Widget<ProbabilityDensityFunctionProps> = memo(
    (props: ProbabilityDensityFunctionProps) => {
        const { className = '', filters = {} } = props;
        useInjectReducer({ key: probabilityDensityFunctionKey, reducer: probabilityDensityFunctionReducer });

        useInjectSaga({ key: probabilityDensityFunctionKey, saga: getAllProbabilityDensityFunctionsSaga });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { t } = useTranslation();

        // const probabilityDensityFunctions: ProbabilityDensityFunctions | undefined = useSelector(
        //     selectProbabilityDensityFunctions,
        // );
        const probabilityDensityFunctionIsLoading: boolean = useSelector(selectProbabilityDensityFunctionIsLoading);
        const dispatch = useDispatch();

        // const displayRows = useMemo(() => {
        //     return probabilityDensityFunctions || []; // .filter((row) => !row.hidden);
        // }, [probabilityDensityFunctions]);

        if (props.isLoading) {
            props.isLoading(probabilityDensityFunctionIsLoading);
        }

        const [widgetFilters] = useState<Filters>({
            ...defaultFilters,
            // add your filters here
            ...filters,
        });

        useEffect(() => {
            dispatch(probabilityDensityFunctionActions.getAllProbabilityDensityFunctions(widgetFilters));
        }, [dispatch, widgetFilters]);

        // const dataAfterLocalFilter = filterByLocalFilters(probabilityDensityFunctions, localFilters);

        const options = {
            chart: {
                type: 'column',
            },
            title: {
                text: 'Probability Density Function',
            },
            accessibility: {
                announceNewData: {
                    enabled: true,
                },
            },
            xAxis: {
                type: 'category',
            },
            yAxis: {
                title: {
                    text: 'Total percent market share',
                },
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%',
                    },
                },
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.y}</span><br>',
            },

            series: [
                {
                    name: 'Browsers',
                    color: '#2196F3',
                    data: [
                        {
                            y: 0.0007,
                            drilldown: 'Chrome',
                        },
                        {
                            y: 0.0001,
                            drilldown: 'Firefox',
                        },
                        {
                            y: 0.00005,
                            drilldown: 'Internet Explorer',
                        },
                        {
                            y: 0.00001,
                            drilldown: 'Safari',
                        },
                        {
                            y: 0.00002,
                            drilldown: 'Edge',
                        },
                        {
                            y: 0,
                            drilldown: 'Opera',
                        },
                        {
                            y: 0,
                            drilldown: null,
                        },
                    ],
                },
            ],
        };

        return (
            <Chart
                chartType={'column'}
                // chartTitle={'Probability Density'}
                // xChartTitle={'Probability Density'}
                // tooltipFormat={`<b>{point.y} ${t(messages.fault)}</b>`}
                className={` ${className} x-cls-probability-density-function-widget`}
                options={options}
                // isLoading={isLoading}
            />
        );

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
            <Div className={`${className} x-cls-probability-density-function-widget`}>
                <SizeMe>
                    {({ size }) => {
                        const { height = 0 } = size as any;
                        const tableBodyHeight = height - 220;

                        return (
                            <Table
                                className={`x-cls-probability-density-function-widget-table`}
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
    },
);

// extra widget properties
const defaultFilters = [
    /*
    { name: 'deviceName', type: FilterType.Select, label: 'Device' },
    { name: 'deviceType', type: FilterType.Select, label: 'Type' },
*/
];
export const ProbabilityDensityFunctionProperty = Object.assign(
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

export default ProbabilityDensityFunctionWidget;

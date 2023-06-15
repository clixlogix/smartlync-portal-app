/**
 *
 * VarianceAnalysis
 *
 */
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { varianceAnalysisReducer, varianceAnalysisKey } from 'services/variance-analysis/variance-analysis-reducer';
import { selectVarianceAnalysisIsLoading } from 'services/variance-analysis/variance-analysis-selectors';

import { getAllVarianceAnalysissSaga } from 'services/variance-analysis/sagas/variance-analysis-saga-get-all';

import { GraphicDatas } from 'models';
import { WidgetProps, Widget } from 'widgets';
import 'scss/main.scss';
import './VarianceAnalysis.scss';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

interface VarianceAnalysisProps extends WidgetProps {
    graphicDatas?: GraphicDatas | any[];
    variances?: VarianceSeries[];
}

export interface VarianceSeries {
    type?: string;
    name?: string | number;
    studId?: string;
    data: { x: number; y: number }[];
}

export const VarianceAnalysisWidget: Widget<VarianceAnalysisProps> = memo((props: VarianceAnalysisProps) => {
    const { className = '', /*filters = {},*/ variances = [] } = props;
    useInjectReducer({ key: varianceAnalysisKey, reducer: varianceAnalysisReducer });

    useInjectSaga({ key: varianceAnalysisKey, saga: getAllVarianceAnalysissSaga });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t } = useTranslation();

    // const varianceAnalysiss: VarianceAnalysiss = useSelector(selectVarianceAnalysiss);
    const varianceAnalysisIsLoading: boolean = useSelector(selectVarianceAnalysisIsLoading);
    // const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(varianceAnalysisIsLoading);
    }

    // const [widgetFilters] = useState<Filters>({
    //     ...defaultFilters,
    //     // add your filters here
    //     ...filters,
    // });

    // useEffect(() => {
    //     dispatch(varianceAnalysisActions.getAllVarianceAnalysiss(widgetFilters));
    // }, [dispatch, widgetFilters]);

    const options = {
        chart: {
            renderTo: 'container',
            type: 'scatter',
            marginLeft: 90,
            marginRight: 50,
            backgroundColor: '#243240',
            plotBackgroundColor: '#243240',
        },
        credits: { enabled: false },
        title: {
            text: 'Variance analysis',
            style: {
                color: '#FFFFFF',
                fontsize: '14px',
                fontWeight: 'bold',
                fontFamily: 'Roboto',
            },
        },
        tooltip: {
            pointFormat: '<b> {name} </b> <br/> {point.x} : {point.y}',
        },
        legend: {
            maxHeight: 55,
        },
        xAxis: {
            title: {
                text: 'Component',
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: 'Roboto',
                    color: '#ffffff',
                },
            },
            min: -10,
            max: 10,
            tickInterval: 10,
            // tickLength: 0,
            // minorTickLength: 0,
            gridLineWidth: 1,
            // showLastLabel: true,
            // showFirstLabel: false,
            lineColor: 'transparent',
            lineWidth: 1,
        },
        yAxis: {
            title: {
                text: 'Component',
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: 'Roboto',
                    color: '#ffffff',
                },
            },
            min: -10,
            max: 10,
            tickInterval: 10,
            // tickLength: 3,
            // minorTickLength: 0,
            lineColor: 'transparent',
            lineWidth: 1,
        },
        series: variances,
    };

    return (
        <Div id="container" className={` ${className} x-cls-variance-analysis-widget`}>
            <HighchartsReact highcharts={Highcharts} options={options} immutable={true} />
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
export const VarianceAnalysisProperty = Object.assign(
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

export default VarianceAnalysisWidget;

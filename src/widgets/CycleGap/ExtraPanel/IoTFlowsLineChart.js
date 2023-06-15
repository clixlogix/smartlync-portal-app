import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { withSize } from 'react-sizeme';
import set from 'lodash/set';

class IoTFlowsLineChart extends React.Component {
    constructor(props) {
        super(props);
        this.chartComponent = React.createRef();
        this.chartAwaitingTimer = null;
        this.chartAwaitingCounter = 0;
        this.childKey = 0;

        this.state = {
            options: {
                chart: {
                    height: 150,
                },
                legend: {
                    enabled: true,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'top',
                },
                xAxis: {
                    ordinal: false,
                },
                yAxis: [
                    {
                        // title: { text: 'Current', style: { color: 'green' } },
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        opposite: false,
                        labels: {
                            format: '{value}A',
                            style: {
                                color: 'green',
                            },
                        },
                    },
                    {
                        // title: { text: 'Voltage', style: { color: '#3399ff' } },
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        opposite: true,
                        labels: {
                            format: '{value}V',
                            style: {
                                color: '#3399ff',
                            },
                        },
                    },
                    {
                        // title: { text: 'Lift Position', style: { color: 'red' } },
                        gridLineWidth: 1,
                        opposite: true,
                        gridLineDashStyle: 'ShortDash',
                        labels: {
                            format: '{value}mm',
                            style: {
                                color: 'red',
                            },
                        },
                    },
                ],
                rangeSelector: {
                    enabled: false,
                },
                credits: {
                    enabled: false,
                    // text: 'iotflows.com',
                    // href: 'http://www.iotflows.com',
                },
                exporting: {
                    buttons: undefined,
                },
                navigator: {
                    enabled: false,
                },
                scrollbar: {
                    enabled: false,
                },
                series: [
                    {
                        name: 'CURRENT',
                        color: 'green',
                        data: [],
                        tooltip: {
                            valueDecimals: 2,
                            valueSuffix: 'A',
                        },
                        animation: {
                            duration: 2000,
                        },
                    },
                    {
                        name: 'VOLTAGE',
                        color: '#3399ff',
                        data: [],
                        yAxis: 1,
                        tooltip: {
                            valueDecimals: 2,
                            valueSuffix: 'V',
                        },
                        animation: {
                            duration: 2000,
                        },
                    },
                    {
                        name: 'LIFT',
                        color: 'red',
                        data: [],
                        yAxis: 2,
                        tooltip: {
                            valueDecimals: 2,
                            valueSuffix: 'mm',
                        },
                        animation: {
                            duration: 2000,
                        },
                    },
                ],
            },
        };
    }

    componentDidMount() {
        this.updateData(this.props.data);
        // this.chartAwaitingData(true);
        const { chartTextColor, chartBgColor } = this.props;
        this.updateChartTheme(chartTextColor, chartBgColor);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.updateData(nextProps.data);
        }
        if (nextProps.themeMode !== this.props.themeMode) {
            this.updateChartTheme(nextProps.chartTextColor, nextProps.chartBgColor);
        }
    }

    updateChartTheme(chartTextColor, chartBgColor) {
        const { options } = this.state;
        const newOptions = { ...options };
        set(newOptions, 'chart.backgroundColor', chartBgColor);
        set(newOptions, 'legend.itemStyle.color', chartTextColor);
        set(newOptions, 'legend.itemHoverStyle.color', chartTextColor);
        set(newOptions, 'title.style.color', chartTextColor);
        set(newOptions, 'noData.style.color', chartTextColor);
        set(newOptions, 'plotOptions.series.dataLabels.style.color', chartTextColor);
        set(newOptions, 'xAxis.title.style.color', chartTextColor);
        set(newOptions, 'xAxis.labels.style.color', chartTextColor);
        this.setState({
            ...newOptions,
        });
    }

    updateData(newData) {
        this.setState({
            options: {
                ...this.state.options,
                series: [
                    { ...this.state.options.series[0], data: newData.currentData },
                    { ...this.state.options.series[1], data: newData.voltageData },
                    { ...this.state.options.series[2], data: newData.liftPositionData },
                ],
            },
        });
        this.chartAwaitingData(false);
    }

    componentWillUnmount() {
        clearInterval(this.chartAwaitingTimer);
    }
    chartAwaitingData(state) {
        var self = this;
        if (state) {
            self.chartAwaitingTimer = setInterval(function () {
                self.chartAwaitingCounter > 3 ? (self.chartAwaitingCounter = 0) : (self.chartAwaitingCounter += 1);
                let message = '.'.repeat(self.chartAwaitingCounter);
                self.chartComponent.current?.chart.showLoading(message);
            }, 500);
        } else {
            clearInterval(self.chartAwaitingTimer);
            self.chartComponent.current?.chart.hideLoading();
        }
    }

    render() {
        ++this.childKey;
        const { options } = this.state;
        options.chart.height = this.props.height || this.props.size?.height || '30%';
        return (
            <div style={{ height: '350px' }}>
                <HighchartsReact
                    constructorType={'stockChart'}
                    ref={this.chartComponent}
                    highcharts={Highcharts}
                    options={options}
                    key={this.childKey}
                />
            </div>
        );
    }
}

export default withSize({ monitorHeight: true })(IoTFlowsLineChart);

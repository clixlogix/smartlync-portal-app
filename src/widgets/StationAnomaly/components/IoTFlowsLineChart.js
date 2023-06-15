import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { withSize } from 'react-sizeme';
import { width } from '@mui/system';

// darkUnica(Highcharts);

class IoTFlowsLineChart extends React.Component {
    constructor(props) {
        super(props);
        this.chartComponent = React.createRef();
        this.chartAwaitingTimer = null;
        this.chartAwaitingCounter = 0;
        this.childKey = 0;
        this.fetched = false;

        this.state = {
            options: {
                chart: {
                    height: props.height || this.size?.height || '30%',
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
    shouldComponentUpdate(nextProps) {
        if (nextProps.data !== this.props.data || nextProps.width !== this.props.width) {
            return true;
        } else {
            return false;
        }
    }
    componentDidMount() {
        this.chartAwaitingData(true);
        this.updateData(this.props.data);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.updateData(nextProps.data);
        }
    }

    updateData(newData) {
        if (!newData) return;
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
            <HighchartsReact
                constructorType={'stockChart'}
                ref={this.chartComponent}
                highcharts={Highcharts}
                options={options}
                key={this.childKey}
            />
        );
    }
}

export default withSize({ monitorHeight: true })(IoTFlowsLineChart);

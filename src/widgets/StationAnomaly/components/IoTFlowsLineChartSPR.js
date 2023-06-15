import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { withSize } from 'react-sizeme';

// darkUnica(Highcharts);

class IoTFlowsLineChartSPR extends React.Component {
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
                // title: {
                //     text: props.name,
                //     align: 'Left',
                //     style: {
                //         // fontSize: '.75em',
                //         margin: '1.67em 0',
                //         fontFamily: 'Roboto',
                //         fontStyle: 'normal',
                //         fontWeight: 500,
                //         fontSize: '14px',
                //         lineHeight: '100%',
                //         color: '#FFFFFF',
                //     },
                // },
                legend: {
                    enabled: true,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'top',
                },
                xAxis: {
                    ordinal: true,
                    min: 0,
                    max: 300,
                },
                yAxis: [
                    {
                        // title: { text: 'Current', style: { color: 'green' } },
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        opposite: false,
                        labels: {
                            format: '{value}',
                            // style: {
                            //     color: 'green',
                            // },
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
                        name: 'Actual Curve',
                        color: 'green',
                        data: [],
                        tooltip: {
                            valueDecimals: 2,
                            valueSuffix: '',
                        },
                        animation: {
                            duration: 2000,
                        },
                    },
                    {
                        name: 'Reference Curve',
                        color: '#3399ff',
                        data: [],
                        tooltip: {
                            valueDecimals: 2,
                            valueSuffix: '',
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
        if (nextProps.data !== this.props.data) {
            return true;
        } else {
            return false;
        }
    }
    componentDidMount() {
        this.updateData(this.props.data);
        this.chartAwaitingData(true);
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
                    { ...this.state.options.series[0], data: newData.rivetData },
                    { ...this.state.options.series[1], data: newData.referenceData },
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

export default withSize({ monitorHeight: true })(IoTFlowsLineChartSPR);

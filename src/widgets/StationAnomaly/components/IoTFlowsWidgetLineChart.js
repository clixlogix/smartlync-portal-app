import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { loadIoTFlows } from '@iotflows/iotflows-js';
import moment from 'moment';

export class IoTFlowsWidgetLineChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                title: {
                    text: props.name,
                },
                xAxis: {
                    ordinal: false,
                },
                series: [
                    {
                        data: [],
                    },
                ],
            },
        };
    }

    componentDidMount() {
        // Read Historical Data
        this.readHistorical();
    }

    async readHistorical() {
        var self = this;
        await fetch(
            `https://api.iotflows.com/v1/data_streams/${this.props.data_stream_uuid}/historical_data/key_access`,
            {
                headers: {
                    Authorization:
                        'Basic ' + Buffer.from(this.props.username + ':' + this.props.password).toString('base64'),
                },
            },
        )
            .then((res) => res.json())
            .then((json) => {
                let this_data = [];
                json.data.map((dataPoint) => {
                    this_data.push([moment(dataPoint.received_at).unix() * 1000, parseFloat(dataPoint.data)]);
                });
                self.setState({ options: { ...this.state.options, series: [{ data: this_data.reverse() }] } });
            });

        // Read RealTime Data
        this.readRealTime();
    }

    async readRealTime() {
        const iotflows = await loadIoTFlows(this.props.username, this.props.password);
        var self = this;
        await iotflows.subscribe({
            data_stream_uuid: this.props.data_stream_uuid,
            callback: function handler(topic, payload) {
                let currentData = self.state.options.series[0].data;

                let time = moment().valueOf();
                currentData.push([time, parseFloat(payload)]);
                self.setState({ options: { ...self.state.options, series: [{ data: currentData }] } });
            },
        });
    }

    render() {
        return (
            <HighchartsReact
                constructorType={'stockChart'}
                ref={this.chartComponent}
                highcharts={Highcharts}
                options={this.state.options}
            />
        );
    }
}

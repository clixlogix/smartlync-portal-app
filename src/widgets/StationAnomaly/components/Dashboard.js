import React from 'react';
import { withSize } from 'react-sizeme';
import { IoTFlowsLineChart } from './IoTFlowsLineChart';
import { loadIoTFlows } from '@iotflows/iotflows-js';
import moment from 'moment';

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            voltageData: [],
            currentData: [],
            leftPositionData: [],
            flag: false,
        };
    }

    componentDidMount() {
        this.readRealTime();
    }

    async readRealTime() {
        const iotflows = await loadIoTFlows(this.props.username, this.props.password);
        var self = this;
        await iotflows.subscribe({
            data_stream_uuid: this.props.data_stream_uuid,
            callback: function handler(topic, payload) {
                const jsonData = JSON.parse(payload);
                // sanity check
                if (
                    jsonData !== undefined &&
                    jsonData.MeasurementData !== undefined &&
                    jsonData.MeasurementData.GraphicalData !== undefined
                ) {
                    // dictionary of MeasurementParameter key values
                    let dicMeasurementParameter = Object.assign(
                        {},
                        ...jsonData.MeasurementData.MeasurementParameter.map((x) => ({ [x.key]: x.value })),
                    );

                    // get date time
                    let dateTimeMillis = moment(dicMeasurementParameter.DateTime).unix() * 1000;

                    // helper function to parse Graphical Data
                    function convertGraphicalDataToTimerSeries(parameter) {
                        let timeseriesData = [];
                        jsonData.MeasurementData.GraphicalData.forEach((item) => {
                            if (item.key === parameter) {
                                let i = 0;
                                item.data.forEach((datapoint) => {
                                    timeseriesData.push([
                                        dateTimeMillis + i * parseInt(item.sampletime),
                                        parseFloat(datapoint),
                                    ]);
                                    i += 1;
                                });
                            }
                        });
                        return timeseriesData;
                    }

                    // Set states for chart update
                    self.setState({ voltageData: convertGraphicalDataToTimerSeries('VOLTAGE') });
                    self.setState({ leftPositionData: convertGraphicalDataToTimerSeries('LIFT_POSITION') });
                    self.setState({ currentData: convertGraphicalDataToTimerSeries('CURRENT') });
                }
            },
        });
    }

    render() {
        const { height = 800 } = this.props?.size;

        return (
            <>
                <IoTFlowsLineChart height={height / 3} name="Current" color="green" data={this.state.currentData} />
                <IoTFlowsLineChart height={height / 3} name="Voltage" color="#3399ff" data={this.state.voltageData} />
                <IoTFlowsLineChart
                    height={height / 3}
                    name="Lift Position"
                    color="red"
                    data={this.state.leftPositionData}
                />
            </>
        );
    }
}

export default withSize({ monitorHeight: true })(Dashboard);

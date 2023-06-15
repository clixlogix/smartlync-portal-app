import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import styled from 'styled-components/macro';
import CheckIcon from '@mui/icons-material/Check';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import highChartTheme from 'highcharts/themes/high-contrast-dark';
import { withSize } from 'react-sizeme';
import { WeldSignalGraphType } from 'models';
import { Images } from 'constants/index';

import './WeldSignalChart.scss';

highChartTheme(Highcharts);

class WeldSignalChart extends React.Component {
    constructor(props) {
        super(props);
        this.chartComponent = React.createRef();
        this.chartAwaitingTimer = null;
        this.chartAwaitingCounter = 0;
        this.childKey = 0;
        this.colors = {
            [WeldSignalGraphType.VOLTAGE]: '#2196f3',
            [WeldSignalGraphType.CURRENT]: '#f48fb1',
            [WeldSignalGraphType.LIFT_POSITION]: '#66bb6a',
            [WeldSignalGraphType.OTHER]: 'silver',
        };
        this.unit = {
            [WeldSignalGraphType.VOLTAGE]: ' V',
            [WeldSignalGraphType.CURRENT]: ' A',
            [WeldSignalGraphType.LIFT_POSITION]: ' mm',
            [WeldSignalGraphType.OTHER]: '',
        };

        this.yAxis = {
            [WeldSignalGraphType.VOLTAGE]: {
                title: { text: 'Voltage', style: { color: this.colors[WeldSignalGraphType.VOLTAGE] } },
                gridLineWidth: 1,
                gridLineDashStyle: 'ShortDash',
                opposite: true,
                labels: {
                    format: '{value}V',
                    style: {
                        color: Highcharts.getOptions().colors[1],
                    },
                    reserveSpace: true,
                },
            },
            [WeldSignalGraphType.CURRENT]: {
                title: { text: 'Current', style: { color: this.colors[WeldSignalGraphType.CURRENT] } },
                gridLineWidth: 1,
                gridLineDashStyle: 'ShortDash',
                labels: {
                    format: '{value}A',
                    style: {
                        color: Highcharts.getOptions().colors[2],
                    },
                    reserveSpace: true,
                },
            },
            [WeldSignalGraphType.LIFT_POSITION]: {
                title: { text: 'Lift Position', style: { color: this.colors[WeldSignalGraphType.LIFT_POSITION] } },
                gridLineWidth: 1,
                opposite: true,
                gridLineDashStyle: 'ShortDash',
                min: -45,
                max: 45,
                labels: {
                    format: '{value}mm',
                    style: {
                        color: Highcharts.getOptions().colors[3],
                    },
                    reserveSpace: true,
                },
            },
            [WeldSignalGraphType.OTHER]: {
                title: { text: 'Other', style: { color: this.colors[WeldSignalGraphType.OTHER] } },
                gridLineWidth: 1,
                opposite: true,
                gridLineDashStyle: 'ShortDash',
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[4],
                    },
                    reserveSpace: true,
                },
            },
        };

        this.state = {
            showSignal: [WeldSignalGraphType.VOLTAGE, WeldSignalGraphType.CURRENT, WeldSignalGraphType.LIFT_POSITION],
            wipOrWop: ['ALL'],
            options: {
                chart: {
                    height: props.height || this.size?.height || '30%',
                    zoomType: 'xy',
                },
                credits: {
                    enabled: false,
                },
                xAxis: {
                    ordinal: true,
                    minorTickLength: 1,
                    labels: {
                        format: '{value}ms',
                    },
                },
                // yAxis: this.yAxis,
                rangeSelector: {
                    enabled: false,
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG'],
                        },
                    },
                },
                navigator: {
                    enabled: false,
                },
                scrollbar: {
                    enabled: false,
                },
                series: {
                    [WeldSignalGraphType.VOLTAGE]: {
                        name: [WeldSignalGraphType.VOLTAGE],
                        color: props.color,
                        data: [],
                        animation: {
                            duration: 2000,
                        },
                    },
                    [WeldSignalGraphType.CURRENT]: {
                        name: [WeldSignalGraphType.CURRENT],
                        color: 'blue',
                        data: [],
                        animation: {
                            duration: 2000,
                        },
                    },
                    [WeldSignalGraphType.LIFT_POSITION]: {
                        name: [WeldSignalGraphType.LIFT_POSITION],
                        color: 'yellow',
                        data: [],
                        animation: {
                            duration: 2000,
                        },
                    },
                    [WeldSignalGraphType.UNKNOWN]: {
                        color: 'aqua',
                        data: [],
                        animation: {
                            duration: 2000,
                        },
                    },
                },
                legend: {
                    enabled: false,
                    title: { text: 'Date Time'.toUpperCase() },
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                },
            },
        };
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

    updateData(newData = []) {
        let series = [];
        let yAxis = [];
        let data;

        data = newData;

        if (Array.isArray(data) && !data.length) {
            return;
        }

        if (Array.isArray(data) && data[0] > 0) {
            // a single set of array values was provided
            data = { [WeldSignalGraphType.UNKNOWN]: data };
        }

        if (!!data[WeldSignalGraphType.VOLTAGE] || !!data[WeldSignalGraphType.UNKNOWN]) {
            data = [data];
        }

        if (!(!!data[0][WeldSignalGraphType.VOLTAGE] || !!data[0][WeldSignalGraphType.VOLTAGE])) {
            data = [];
        }

        series = data.reduce((sAcc, rec) => {
            const s = Object.keys(rec).reduce((acc = [], fKey, index) => {
                let key = fKey;

                if (!WeldSignalGraphType[fKey]) {
                    key = 'OTHER';
                }
                const { GraphicData, carbodyId = '' } = rec[fKey];

                const serie = {
                    ...this.state.options.series[fKey],
                    name: carbodyId, // fKey,
                    color: this.colors[fKey],
                    key,
                    data: GraphicData,
                    tooltip: {
                        headerFormat: null,
                        valueDecimals: 2,
                        valueSuffix: `${this.unit[fKey]} , CarBody ID: ${carbodyId}`,
                    },
                };

                if (yAxis.length) {
                    serie.yAxis = index;
                }

                acc.push(serie);
                const y = { ...this.yAxis[WeldSignalGraphType[fKey]] };
                y.labels.style.color = this.colors[fKey];

                yAxis.push({ ...this.yAxis[WeldSignalGraphType[fKey]] });
                return acc;
            }, []);
            sAcc = sAcc.concat(s);

            return sAcc;
        }, []);

        const options = { ...this.state.options, series };

        if (yAxis.length) {
            options.yAxis = yAxis.slice(0, 3);
        }

        this.setState({ options });
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

    handleFormat = (event, newFormats = [WeldSignalGraphType.VOLTAGE]) => {
        const { options = { series: [] } } = this.state;
        const { series = [] } = options;

        if (!newFormats.length) {
            newFormats.push(WeldSignalGraphType.VOLTAGE);
        }

        if (Array.isArray(series)) {
            series?.forEach(({ key }, index) => {
                options.yAxis[index].visible = newFormats.includes(key);
                options.series[index].visible = newFormats.includes(key);
            });
        }

        const state = { ...this.state, options, showSignal: newFormats };

        this.setState(state);
    };

    handleWipWop = (event, wipOrWop = ['ALL']) => {
        const state = { ...this.state, wipOrWop: [wipOrWop] };
        this.setState(state);
    };

    render() {
        ++this.childKey;

        const { options = { series: [], chart: {} } } = this.state;

        options.chart.height = '20%';

        const { title = '', className = '' } = this.props;
        const { showSignal, wipOrWop = ['ALL'] } = this.state;
        const disabled = !Array.isArray(options.series) || options.series.length === 0;

        return (
            <Div className={`${className} x-cls-signal-chart`}>
                <Div className={'x-title-bar'}>
                    {title && <Div className={'x-title-label'}>{title}</Div>}
                    <Div className={'x-show-btn-grp'}>
                        <span className={'x-label'}>Signal type: </span>
                        <ToggleButtonGroup
                            className={'x-show-signal-type'}
                            value={disabled ? [] : showSignal}
                            onChange={this.handleFormat}
                            aria-label={'show signal'}
                            disabled={disabled}
                        >
                            <ToggleButton
                                className={disabled ? 'disabledSignal' : `${WeldSignalGraphType.VOLTAGE}`}
                                // className={`${WeldSignalGraphType.VOLTAGE}`}
                                value={WeldSignalGraphType.VOLTAGE}
                                aria-label={WeldSignalGraphType.VOLTAGE}
                                disabled={disabled}
                            >
                                {!disabled && showSignal.includes(WeldSignalGraphType.VOLTAGE) && <CheckIcon />} Voltage
                            </ToggleButton>
                            <ToggleButton
                                className={disabled ? 'disabledSignal' : `${WeldSignalGraphType.CURRENT}`}
                                value={WeldSignalGraphType.CURRENT}
                                aria-label={WeldSignalGraphType.CURRENT}
                                disabled={disabled}
                            >
                                {!disabled && showSignal.includes(WeldSignalGraphType.CURRENT) && <CheckIcon />} Current
                            </ToggleButton>
                            <ToggleButton
                                className={disabled ? 'disabledSignal' : `${WeldSignalGraphType.LIFT_POSITION}`}
                                value={WeldSignalGraphType.LIFT_POSITION}
                                aria-label={WeldSignalGraphType.LIFT_POSITION}
                                disabled={disabled}
                            >
                                {!disabled && showSignal.includes(WeldSignalGraphType.LIFT_POSITION) && <CheckIcon />}{' '}
                                Lift Position
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <ToggleButtonGroup
                            className={disabled ? 'disabled' : 'x-show-wip-wop-btn-grp'}
                            value={wipOrWop}
                            exclusive
                            onChange={this.handleWipWop}
                            aria-label={'Show Wip/Wop'}
                        >
                            <ToggleButton
                                className={disabled ? 'disabled' : `x-wip-wop-all`}
                                value={'ALL'}
                                aria-label={'All'}
                                disabled={disabled}
                            >
                                ALL
                            </ToggleButton>
                            <ToggleButton
                                className={disabled ? 'disabled' : `x-wip`}
                                value={'WIP'}
                                aria-label={'WOP'}
                                disabled={disabled}
                            >
                                WIP
                            </ToggleButton>
                            <ToggleButton
                                className={disabled ? 'disabled' : `x-wop`}
                                value={'WOP'}
                                aria-label={'WOP'}
                                disabled={disabled}
                            >
                                WOP
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Div>
                </Div>

                {!this.props.data.length ? (
                    <Div className={'no-data-message'}>
                        <img src={Images.NoData} className="no-data-img" alt="NO Data" />
                        <span className={'no-data-message-text'}>{this.props.nodatamessage}</span>
                        <span className={'no-data-message-sub'}>{this.props.nodatamessageSub}</span>
                    </Div>
                ) : (
                    <HighchartsReact
                        constructorType={'stockChart'}
                        ref={this.chartComponent}
                        highcharts={Highcharts}
                        options={options}
                        key={this.childKey}
                    />
                )}
            </Div>
        );
    }
}

const Div = styled.div``;

export default withSize({ monitorHeight: true })(WeldSignalChart);

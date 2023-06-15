/**
 *
 * OverviewCard
 *
 */
import React, { memo, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import moment from 'moment';
import { messages } from './messages';
import maintenanceDataMap from 'services/system-overview/data';

import './OverviewCard.scss';

interface OverviewCardProps {
    data: any;
    className: any;
    expanded?: boolean;

    onClick?(card);
    onExpand?();
}

function CircularProgressWithLabel(props) {
    const { value = 0 } = props;

    const v = +value.toFixed(1);
    const color = v > 99.8 ? 0 : v > 99.4 ? 1 : 2;
    const colors = ['#149B74', '#FF9D00', '#e42d37'];

    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress
                variant="determinate"
                {...props}
                style={{
                    color: colors[color],
                    border: '1px ridge #3F5208',
                    borderRadius: '50%',
                }}
            />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography
                    variant="caption"
                    component="div"
                    style={{ color: 'white', fontSize: 13 }}
                >{`${value.toFixed(1)}%`}</Typography>
            </Box>
        </Box>
    );
}

const ComponentChange = (props) => {
    const { components = [] } = props;

    return (
        <CardContent className={'x-health-change-card'}>
            <Span className={'x-title'}>Components</Span>
            <Div className="x-health">
                {components.map(({ componentName = '', componentHealth = {} as HealthValue, lastChange }) => (
                    <Div className={'x-component'}>
                        <Span className="x-name">{componentName}</Span>
                        <Span className="x-health">
                            health: &nbsp; <span className={'x-value'}>{componentHealth}</span>
                            {lastChange && (
                                <>
                                    , &nbsp; last change:
                                    <span className={'x-value'}> &nbsp; {moment(lastChange?.time).fromNow()}</span>
                                </>
                            )}
                        </Span>
                    </Div>
                ))}
            </Div>
        </CardContent>
    );
};

const ComponentHistory = (props) => {
    const { history = [] } = props;

    return (
        <CardContent className={'x-health-history-card'}>
            <Span className={'x-title'}>History</Span>
            <Div className={'x-history'}>
                {history.map(({ name = '', currentCycles = 0, events = [] }) => (
                    <Div className={'x-history-item'}>
                        <Div className="x-cmp-summaries">
                            {events.map(({ summary, type }) => {
                                const lines = summary.split(' - ');

                                return (
                                    <Span className={`x-summary ${type} text-ellipsis`}>
                                        <Span>{lines[1]}</Span>
                                    </Span>
                                );
                            })}
                        </Div>
                    </Div>
                ))}
            </Div>
        </CardContent>
    );
};

const ComponentForecast = (props) => {
    const { formatNumber, forecasts = {} as any, threshold = 909990 } = props;

    return (
        <CardContent className={'x-health-forecast-card'}>
            <Span className={'x-title'}>Predictive Maintenance</Span>
            <Div className={'x-forcasts'}>
                {forecasts.map(({ cmp = '', cycles = 0, hours = 0 }) => {
                    let stripe = 'green';
                    if (hours < 20000) {
                        stripe = 'orange';
                    }
                    if (hours < 11000) {
                        stripe = 'red pulse';
                    }

                    return (
                        <Div className={'x-main-values'}>
                            <Div className="x-name">
                                <Span>{cmp}</Span>
                                {hours < threshold && <Span className={`x-stripe ${stripe}`}> &nbsp;</Span>}
                            </Div>

                            <Div className={'x-forecast-panel'}>
                                <Div className="x-forecast-datum">
                                    <Span className={'x-label'}>Cycles</Span>
                                    <Span className={'x-value'}>{formatNumber(cycles)}</Span>
                                </Div>

                                <Div className="x-forecast-datum">
                                    <Span className={'x-label'}>Hours to Callibration</Span>
                                    <Span className={'x-value'}>{formatNumber(hours)}</Span>
                                </Div>
                            </Div>
                        </Div>
                    );
                })}
            </Div>
        </CardContent>
    );
};

export const OverviewCard = memo((props: OverviewCardProps) => {
    const { t, i18n } = useTranslation();
    const { data = {} as any, className, expanded = false, onClick, onExpand } = props;
    const formatNumber = new Intl.NumberFormat(i18n.language, {
        // maximumSignificantDigits: 2,
        maximumFractionDigits: 2,
    }).format;
    const [expand, setExpand] = useState<boolean>(expanded);

    let maintenanceData: any = {};

    if (maintenanceDataMap.has(data.deviceName)) {
        maintenanceData = maintenanceDataMap.get(data.deviceName);
    }

    const { ta = 0.0, deviceName = '', faults = 0, cycles = 0, mttr = 0.0, mtbf = 0.0 } = data;

    const { components = [], deviceHealth = 100 } = maintenanceData;

    const history = components.reduce((acc, cmp) => [...acc, { name: cmp.componentName, ...cmp.history }], []);
    const forecasts = components.map((cmp) => ({ cmp: cmp.componentName, ...cmp.forecast }));

    const onHandleClick = () => {
        if (onClick) {
            onClick(data);
        }
    };

    const onHandleExpandChange = () => {
        const xpnd = !expand;

        setExpand(xpnd);
        if (onExpand) {
            onExpand(xpnd);
        }
    };

    let healthColor: string = 'red';
    if (deviceHealth > 90) {
        healthColor = 'red';
    }

    if (deviceHealth > 91) {
        healthColor = 'orange';
    }

    if (deviceHealth > 94) {
        healthColor = 'green';
    }

    return (
        <Div className={`${className} x-cls-overview-card-component`} style={{ height: expand ? 560 : 175 }}>
            <Switch
                className={'x-cls-expand-switch'}
                checked={expand}
                onChange={() => onHandleExpandChange()}
                color="primary"
                size="small"
                name="checkedB"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <H1 className={`x-health-value ${healthColor}`}>Health: {deviceHealth}%</H1>
            <Card className="card-property" onClick={onHandleClick}>
                <CardContent className="card-content-property ">
                    <div className="flex-row-property header">
                        <div className="align-property left-side"></div>
                        <div className="align-property right-side">{deviceName}</div>
                    </div>
                    <div className="circular-progress-title ">{t(messages.averageTAText)}</div>
                    <div className="flexOne">
                        <div className="flex-row-property ">
                            <div className="flex-col-property">
                                <div className="centered-justification marginEight">
                                    <CircularProgressWithLabel value={+ta} size={'4rem'} />
                                </div>
                            </div>
                            <div className="flexOneBox">
                                <div className="greyTitle">{t(messages.faultsText)}</div>
                                <div className="valueLabels">{formatNumber(faults)}</div>
                            </div>
                            <div className="flexOneBox">
                                <div className="greyTitle">{t(messages.cyclesText)}</div>
                                <div className="valueLabels">{formatNumber(cycles)}</div>
                            </div>
                            <div className="flexOneBox">
                                <div className="greyTitle">{t(messages.MTTRText)}</div>
                                <div className="valueLabels">
                                    {formatNumber(mttr)} <span>{t(messages.MTTRUnitsText)}</span>
                                </div>
                            </div>
                            <div className="flexOneBox">
                                <div className="greyTitle">{t(messages.MTBFText)}</div>
                                <div className="valueLabels">
                                    {formatNumber(mtbf)} <span>{t(messages.MTBFUnitsText)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                {expand && (
                    <Div className={'x-health-panel'}>
                        <ComponentChange components={components} formatNumber={formatNumber} />
                        <ComponentHistory history={history} formatNumber={formatNumber} />
                        <ComponentForecast forecasts={forecasts} formatNumber={formatNumber} />
                    </Div>
                )}
            </Card>
        </Div>
    );
});

const Div = styled.div``;
const Span = styled.span``;
const H1 = styled.h1``;

export default OverviewCard;

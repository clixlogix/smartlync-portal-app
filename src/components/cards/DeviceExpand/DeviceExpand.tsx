/**
 *
 * DeviceExpand
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import CircularBarWithLabel from 'components/cards/CircularBarWithLabel';
import CollapsibleTable from './CollapsibleTable';
import { messages } from './messages';
import maintenanceDataMap from 'services/system-overview/data';
import FleetExpandDeviceTable from 'widgets/FleetExpandDeviceTable/Loadable';
import './DeviceExpand.scss';
import DeviceAreaGraph from 'widgets/deviceAreaGraph/Loadable';
import { ProbabilityDensityFunctionWidget } from 'widgets/ProbabilityDensityFunction/ProbabilityDensityFunction';
import { Moment } from 'moment';

interface Props {
    className?: string;
    cardInfo?: any;
    filters: any;
    children?: React.ReactNode | React.ReactNode[];
}

export interface HealthValue {
    value: number;
    lastChange: Moment;
}

export const DeviceExpand = memo((props: Props) => {
    const { t } = useTranslation();
    const { className = '', cardInfo } = props;
    const { cycles, faults, mtbf, mttr, ta, deviceName } = cardInfo;

    let maintenanceData: any = {};

    if (maintenanceDataMap.has(deviceName)) {
        maintenanceData = maintenanceDataMap.get(deviceName);
    }

    const { components = [] } = maintenanceData;

    const OnDeviceItemClicked = () => {
        return (
            <div className={'x-device-zoom-card'}>
                <div className="graphic-data">
                    <CircularBarWithLabel label={t(messages.health)} value={cycles} unit={'%'} />
                    <CircularBarWithLabel label={t(messages.cycles)} value={cycles} unit={''} />
                    <CircularBarWithLabel label={t(messages.faults)} value={faults} unit={''} />
                    <CircularBarWithLabel label={t(messages.mtbf)} value={mtbf} unit={'MIN'} />
                    <CircularBarWithLabel label={t(messages.mttr)} value={mttr} unit={'HR'} />
                    <CircularBarWithLabel label={t(messages.ta)} value={ta} unit={'%'} />
                </div>
                <div className="x-cls-graph-area stanleyRow">
                    <DeviceAreaGraph />
                    <ProbabilityDensityFunctionWidget />
                </div>
                <div className="component-table">
                    <CollapsibleTable components={components} />
                </div>

                <FleetExpandDeviceTable />
            </div>
        );
    };

    return <Div className={`${className} x-cls-device-expand`}>{OnDeviceItemClicked()}</Div>;
});

const Div = styled.div``;

export default DeviceExpand;

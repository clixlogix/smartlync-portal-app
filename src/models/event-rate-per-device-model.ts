/**
 *
 *
 * @export
 * @class EventRatePerDevice
 */
export interface EventRatePerDevice {
    deviceName?: string;
    date?: string;
    week?: string;
    eventCount?: string;
    weldCount?: string;
    studType?: string;
    eventType?: string;
    faultCode?: string | null;
    subLine?: string;
    bodyshop: number;
}

export type EventRatePerDevices = EventRatePerDevice[];

export type LineValue = [string, number];
export interface ChartData {
    data: LineValue[] | [any];
    name: string;
    type?: string;
    yAxis?: number;
    marker?: object;
    keys?: string[];
    dataSorting?: object;
}

export default EventRatePerDevice;

/**
 *
 *
 * @export
 * @class EventRatePerDeviceSpr
 */
export interface EventRatePerDeviceSpr {
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

export type EventRatePerDeviceSprs = EventRatePerDeviceSpr[];
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
export default EventRatePerDeviceSpr;

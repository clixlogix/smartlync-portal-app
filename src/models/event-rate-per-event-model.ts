/**
 *
 *
 * @export
 * @class EventRatePerEvent
 */
import { ChartData } from 'models';
export interface EventRatePerEvent {
    date?: string;
    week?: string;
    eventCount?: string;
    weldCount?: string;
    faultCode?: number | null;
    studType?: string;
    deviceName?: string;
    eventType?: string;
    line?: string;
}

export type EventRatePerEvents = ChartData[];

export default EventRatePerEvent;

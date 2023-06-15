/**
 *
 *
 * @export
 * @class EventRateCycleCount
 */

export interface EventRateCycleCount {
    date?: string;
    occurredOn?: string;
    week?: string;
    cycleCount?: number;
    studType?: string;
    deviceName?: string;
    eventType?: string;
    line?: string;
    faultCode?: number | null;
    eventCount?: number;
}

export type EventRateCycleCounts = EventRateCycleCount[];

export default EventRateCycleCount;

/**
 *
 *
 * @export
 * @class EventRateCycleCountSpr
 */
export interface EventRateCycleCountSpr {
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

export type EventRateCycleCountSprs = EventRateCycleCountSpr[];

export default EventRateCycleCountSpr;

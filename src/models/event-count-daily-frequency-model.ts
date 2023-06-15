/**
 *
 *
 * @export
 * @class EventCountDailyFrequency
 */
export interface EventCountDailyFrequency {
    deviceName: string;
    eventCode: string;
    occurrences: number;
    week: string;
    eventType: string;
    line: string;
    studId: number;
    studType: string;
}

export type EventCountDailyFrequencys = EventCountDailyFrequency[];

export default EventCountDailyFrequency;

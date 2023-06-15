/**
 *
 *
 * @export
 * @class EventCountDailyFrequencySpr
 */
export interface EventCountDailyFrequencySpr {
    deviceName: string;
    eventCode: string;
    occurrences: number;
    week: string;
    eventType: string;
    line: string;
    studId: number;
    studType: string;
}

export type EventCountDailyFrequencySprs = EventCountDailyFrequencySpr[];

export default EventCountDailyFrequencySpr;

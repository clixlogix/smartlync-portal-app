/**
 *
 *
 * @export
 * @class EventCountFrequencyWidget
 */

export interface EventCountFrequencySpr {
    deviceName: string;
    eventCode: string;
    occurrences: number;
    week: string;
    eventType: string;
    line: string;
    studId: number;
    studType: string;
}

export type EventCountFrequencySprs = EventCountFrequencySpr[];

export default EventCountFrequencySpr;

/**
 *
 *
 * @export
 * @class EventCountFrequencyWidget
 */

export interface EventCountFrequency {
    deviceName: string;
    eventCode: string;
    occurrences: number;
    week: string;
    eventType: string;
    line: string;
    studId: number;
    studType: string;
}

export type EventCountFrequencies = EventCountFrequency[];

export default EventCountFrequency;

/**
 *
 *
 * @export
 * @class EventDescFrequency
 */
export interface EventDescFrequency {
    description: string;
    extendedDescription: string;
    fc: number;
    faultCode: string;
    occurrences: number;
    Line: string;
    StudType: string;
    Week: string;
    deviceName: string;
    eventType: string;
    percentageFaultCount: string;
    studId: null;
}

export type EventDescFrequencys = EventDescFrequency[];

export default EventDescFrequency;

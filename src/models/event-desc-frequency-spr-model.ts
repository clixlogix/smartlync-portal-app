/**
 *
 *
 * @export
 * @class EventDescFrequencySpr
 */
export interface EventDescFrequencySpr {
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

export type EventDescFrequencySprs = EventDescFrequencySpr[];

export default EventDescFrequencySpr;

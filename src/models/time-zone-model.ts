/**
 *
 *
 * @export
 * @class TimeZone
 */
export interface TimeZone {
    abbr: string;
    isdst: boolean;
    offset: number;
    text: string;
    utc: string[];
    value: string;
}

// export type TimeZones = TimeZone[];

export default TimeZone;

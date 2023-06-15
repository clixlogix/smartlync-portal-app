/**
 *
 *
 * @export
 * @class TimeZoneSpr
 */
export interface TimeZoneSpr {
    abbr: string;
    isdst: boolean;
    offset: number;
    text: string;
    utc: string[];
    value: string;
}

// export type TimeZoneSprs = TimeZoneSpr[];

export default TimeZoneSpr;

import { Moment } from 'moment';
/**
 *
 *
 * @export
 * @class WeldTime
 */
export interface WeldTimes {
    minimum?: number[];
    maximum?: number[];
    actual?: number[];
    occurredOn?: Moment[] | string[];
    deviceNames?: string[];
    studIds?: string;
    studTypes?: string;
    week?: string;
    lines?: string;
}

// export type WeldTimes = WeldTime[];

export default WeldTimes;

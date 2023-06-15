import { Moment } from 'moment';
/**
 *
 *
 * @export
 * @class WeldTimeSpr
 */
export class WeldTimeSprs {
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

// export type WeldTimeSprs = WeldTimeSpr[];

export default WeldTimeSprs;

import { Moment } from 'moment';
/**
 *
 *
 * @export
 * @class ReportThreshold
 */
export interface ReportThreshold {
    time: Moment | string;
    value: number;
}

export type ReportThresholds = ReportThreshold[];

export default ReportThreshold;

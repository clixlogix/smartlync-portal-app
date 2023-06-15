import { Moment } from 'moment';
/**
 *
 *
 * @export
 * @interface ProcessLog
 */
export interface ProcessLog {
    id: string;

    systemType: string;
    deviceName: string;
    stationName: string;
    anomaly: string;
    confidence: number;
    time: Moment | string;
    feedback: string;
}

export type ProcessLogs = ProcessLog[];

export default ProcessLog;

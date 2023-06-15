import { AnomalyFeedback, Device } from 'models';
import moment, { Moment } from 'moment';

/**
 *
 *
 * @export
 * @class OperationItem
 */
export class HistoricalDiagnostic {
    public id: string;
    deviceName: string;
    stationName: string;
    systemType: string;
    studId?: string;
    device: Device;
    attachments: string[];
    anomaly?: string;
    confidence?: number;
    feedback?: AnomalyFeedback;
    data?: { [key: string]: any[] }; // { current: []; voltage: []; lift: []; }
    time: Moment | string;
    otherData?: any;

    // view property
    hidden?: boolean;

    constructor(o: any = {}) {
        const {
            id,
            studId,
            deviceName,
            stationName,
            systemType,
            device,
            attachments = [],
            anomaly,
            confidence = 75,
            feedback,
            data = {},
            time = moment(),
        } = o;

        this.id = id;
        this.deviceName = deviceName;
        this.stationName = stationName;
        this.systemType = systemType;
        this.studId = studId;
        this.device = device;
        this.attachments = attachments;
        this.anomaly = anomaly;
        this.confidence = confidence;
        this.feedback = feedback;
        this.data = data;
        this.time = time;
    }
}

export type HistoricalDiagnostics = HistoricalDiagnostic[];

export default HistoricalDiagnostic;

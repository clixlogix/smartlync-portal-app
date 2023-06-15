/**
 *
 *
 * @export
 * @class StationAnomaly
 */
export class StationAnomaly {
    protected id: string;
    deviceName: string;
    stationName: string;
    device: Device;
    attachments: string[];
    anomaly?: string;
    confidence?: number;
    feedback?: AnomalyFeedback;
    data?: { [key: string]: any[] }; // { current: []; voltage: []; lift: []; }

    constructor(o: any = {}) {
        const {
            id,
            deviceName,
            stationName,
            device,
            attachments = [],
            anomaly,
            confidence = 75,
            feedback,
            data = {},
        } = o;

        this.id = id;
        this.deviceName = deviceName;
        this.stationName = stationName;
        this.device = device;
        this.attachments = attachments;
        this.anomaly = anomaly;
        this.confidence = confidence;
        this.feedback = feedback;
        this.data = data;
    }
}

export type StationAnomalies = StationAnomaly[];

export interface Device {
    name: string;
    station: string;
    type: string;
    studId: string;
    studType: string;
}

export interface AnomalyFeedback {
    user: string;
    role: string | string[];
    message: string;
}

export default StationAnomaly;

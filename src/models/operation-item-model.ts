import { AnomalyFeedback, Device } from 'models';
import moment from 'moment';

/**
 *
 *
 * @export
 * @class OperationItem
 */
export class OperationItem {
    public id: string;
    deviceName: string;
    stationName: string;
    systemType: string;
    device: Device;
    attachments: string[];
    anomaly?: string;
    confidence?: number;
    feedback?: AnomalyFeedback;
    data?: { [key: string]: any[] }; // { current: []; voltage: []; lift: []; }
    time?: string;
    otherData?: any;

    // view property
    hidden?: boolean;

    constructor(o: any = {}) {
        const {
            id,
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
        this.device = device;
        this.attachments = attachments;
        this.anomaly = anomaly;
        this.confidence = confidence;
        this.feedback = feedback;
        this.data = data;
        this.time = time;
    }
}

export type OperationItems = OperationItem[];

export default OperationItem;

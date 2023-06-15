/**
 *
 *
 * @export
 * @class PlantDeviceByDuration
 */
export class PlantDeviceByDuration {
    deviceName?: string;
    duration?: string;
    index?: number;
    position?: string;

    constructor(o?: any) {
        this.deviceName = o.deviceName;
        this.duration = o.duration;
        this.index = o.index;
        this.position = o.position;
    }
}

export type PlantDeviceByDurations = PlantDeviceByDuration[];

export default PlantDeviceByDuration;

/**
 *
 *
 * @export
 * @class PlantDeviceByDurationSpr
 */
export class PlantDeviceByDurationSpr {
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

export type PlantDeviceByDurationSprs = PlantDeviceByDurationSpr[];

export default PlantDeviceByDurationSpr;

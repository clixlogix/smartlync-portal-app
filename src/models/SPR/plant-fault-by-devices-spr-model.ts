/**
 *
 *
 * @export
 * @interface PlantFaultByDevicesSpr
 */
export interface PlantFaultByDevicesSpr {
    description: string;
    deviceName: string;
    extendedDescription: string;
    index?: number;
    occurrences: string;
    position: string;
}

export type PlantFaultByDevicesSprs = PlantFaultByDevicesSpr[];

export default PlantFaultByDevicesSpr;

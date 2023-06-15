import { CustomError } from 'utils/error';
import { Filters, PlantFaultByDevicesSpr, PlantFaultByDevicesSprs } from 'models';

/* --- STATE --- */
export interface PlantFaultByDevicesSprsState {
    plantFaultByDevicesSprs?: PlantFaultByDevicesSprs;
    plantFaultByDevicesSpr?: PlantFaultByDevicesSpr | undefined;
    plantFaultByDevicesSprsFilteredByRules: PlantFaultByDevicesSprs;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default PlantFaultByDevicesSprsState;

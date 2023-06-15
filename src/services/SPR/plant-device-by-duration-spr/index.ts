import { CustomError } from 'utils/error';
import { Filters, PlantDeviceByDurationSpr, PlantDeviceByDurationSprs } from 'models';

/* --- STATE --- */
export interface PlantDeviceByDurationSprsState {
    plantDeviceByDurationSprs?: PlantDeviceByDurationSprs;
    plantDeviceByDurationSpr?: PlantDeviceByDurationSpr | undefined;
    plantDeviceByDurationSprsFilteredByRules: PlantDeviceByDurationSprs;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default PlantDeviceByDurationSprsState;

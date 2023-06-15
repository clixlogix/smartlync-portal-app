import { CustomError } from 'utils/error';
import { Filters, PlantDeviceByDuration, PlantDeviceByDurations } from 'models';

/* --- STATE --- */
export interface PlantDeviceByDurationsState {
    plantDeviceByDurations?: PlantDeviceByDurations;
    plantDeviceByDuration?: PlantDeviceByDuration | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default PlantDeviceByDurationsState;

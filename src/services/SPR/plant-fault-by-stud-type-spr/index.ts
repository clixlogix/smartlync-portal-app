import { CustomError } from 'utils/error';
import { Filters, PlantFaultByStudTypeSpr, PlantFaultByStudTypeSprs } from 'models';

/* --- STATE --- */
export interface PlantFaultByStudTypeSprsState {
    plantFaultByStudTypeSprs?: PlantFaultByStudTypeSprs;
    plantFaultByStudTypeSpr?: PlantFaultByStudTypeSpr | undefined;
    filters: Filters;
    error: CustomError | undefined;
    isLoading: boolean;
}

export default PlantFaultByStudTypeSprsState;

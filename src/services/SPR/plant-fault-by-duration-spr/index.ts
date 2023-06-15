import { CustomError } from 'utils/error';
import { Filters, PlantFaultByDurationSpr, PlantFaultByDurationSprs } from 'models';

/* --- STATE --- */
export interface PlantFaultByDurationSprsState {
    plantFaultByDurationSprs?: PlantFaultByDurationSprs;
    plantFaultByDurationSpr?: PlantFaultByDurationSpr | undefined;
    plantFaultByDurationSprsFilteredByRules: PlantFaultByDurationSprs;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default PlantFaultByDurationSprsState;

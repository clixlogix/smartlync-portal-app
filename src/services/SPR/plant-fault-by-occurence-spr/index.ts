import { CustomError } from 'utils/error';
import { Filters, PlantFaultByOccurenceSpr, PlantFaultByOccurenceSprs } from 'models';

/* --- STATE --- */
export interface PlantFaultByOccurenceSprsState {
    plantFaultByOccurenceSprs?: PlantFaultByOccurenceSprs;
    plantFaultByOccurenceSpr?: PlantFaultByOccurenceSpr | undefined;
    plantFaultByOccurenceSprsFilteredByRules: PlantFaultByOccurenceSprs;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default PlantFaultByOccurenceSprsState;

import { CustomError } from 'utils/error';
import { Filters, PlantCycleCountSpr, PlantCycleCountSprs } from 'models';

/* --- STATE --- */
export interface PlantCycleCountSprsState {
    plantCycleCountSprs?: any;
    plantCycleCountSpr?: PlantCycleCountSpr | undefined;
    plantCycleCountSprsFilteredByRules: PlantCycleCountSprs;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default PlantCycleCountSprsState;

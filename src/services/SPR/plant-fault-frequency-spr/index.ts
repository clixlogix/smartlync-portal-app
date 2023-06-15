import { CustomError } from 'utils/error';
import { Filters, PlantFaultFrequencySpr, PlantFaultFrequencySprs } from 'models';

/* --- STATE --- */
export interface PlantFaultFrequencySprsState {
    plantFaultFrequencySprs?: PlantFaultFrequencySprs;
    plantFaultFrequencySpr?: PlantFaultFrequencySpr | undefined;
    plantFaultFrequencySprsFilteredByRules: PlantFaultFrequencySprs;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default PlantFaultFrequencySprsState;

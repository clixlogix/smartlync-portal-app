import { CustomError } from 'utils/error';
import { Filters, PlantCycleAveragesWidgetSpr, PlantCycleAveragesWidgetSprs } from 'models';

/* --- STATE --- */
export interface PlantCycleAveragesWidgetSprsState {
    plantCycleAveragesWidgetSprs?: PlantCycleAveragesWidgetSprs;
    plantCycleAveragesWidgetSpr?: PlantCycleAveragesWidgetSpr | undefined;
    plantCycleAveragesWidgetSprsFilteredByRules: PlantCycleAveragesWidgetSprs;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default PlantCycleAveragesWidgetSprsState;

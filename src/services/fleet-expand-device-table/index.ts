import { CustomError } from 'utils/error';
import { Filters, FleetExpandDeviceTable, FleetExpandDeviceTables } from 'models';

/* --- STATE --- */
export interface FleetExpandDeviceTablesState {
    fleetExpandDeviceTables?: FleetExpandDeviceTables;
    fleetExpandDeviceTable?: FleetExpandDeviceTable | undefined;
    fleetExpandDeviceTablesFilteredByRules: FleetExpandDeviceTables;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default FleetExpandDeviceTablesState;

/**
 *
 * Asynchronously loads the component for FleetExpandDeviceTable
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FleetExpandDeviceTable = lazyLoad(
    () => import('./FleetExpandDeviceTable'),
    (module) => module.FleetExpandDeviceTableWidget,
);

export default FleetExpandDeviceTable;

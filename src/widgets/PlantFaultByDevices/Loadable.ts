/**
 *
 * Asynchronously loads the component for PlantFaultByDevices
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantFaultByDevices = lazyLoad(
    () => import('./PlantFaultByDevices'),
    (module) => module.PlantFaultByDevicesWidget,
);

export default PlantFaultByDevices;

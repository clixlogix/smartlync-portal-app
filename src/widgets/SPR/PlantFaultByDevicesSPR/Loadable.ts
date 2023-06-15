/**
 *
 * Asynchronously loads the component for PlantFaultByDevicesSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantFaultByDevicesSpr = lazyLoad(
    () => import('./PlantFaultByDevicesSpr'),
    (module) => module.PlantFaultByDevicesSprWidget,
);

export default PlantFaultByDevicesSpr;

/**
 *
 * Asynchronously loads the component for PlantDeviceByDuration
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantDeviceByDuration = lazyLoad(
    () => import('./PlantDeviceByDuration'),
    (module) => module.PlantDeviceByDurationWidget,
);

export default PlantDeviceByDuration;

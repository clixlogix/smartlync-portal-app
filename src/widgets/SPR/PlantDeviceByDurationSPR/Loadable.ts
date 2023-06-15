/**
 *
 * Asynchronously loads the component for PlantDeviceByDurationSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantDeviceByDurationSpr = lazyLoad(
    () => import('./PlantDeviceByDurationSpr'),
    (module) => module.PlantDeviceByDurationSprWidget,
);

export default PlantDeviceByDurationSpr;

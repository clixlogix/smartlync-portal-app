/**
 *
 * Asynchronously loads the component for PlantFaultByDurationSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantFaultByDurationSpr = lazyLoad(
    () => import('./PlantFaultByDurationSpr'),
    (module) => module.PlantFaultByDurationSprWidget,
);

export default PlantFaultByDurationSpr;

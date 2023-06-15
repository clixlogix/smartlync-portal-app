/**
 *
 * Asynchronously loads the component for PlantFaultByStudTypeSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantFaultByStudTypeSpr = lazyLoad(
    () => import('./PlantFaultByStudTypeSpr'),
    (module) => module.PlantFaultByStudTypeSprWidget,
);

export default PlantFaultByStudTypeSpr;

/**
 *
 * Asynchronously loads the component for PlantFaultByOccurenceSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantFaultByOccurenceSpr = lazyLoad(
    () => import('./PlantFaultByOccurenceSpr'),
    (module) => module.PlantFaultByOccurenceSprWidget,
);

export default PlantFaultByOccurenceSpr;

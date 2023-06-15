/**
 *
 * Asynchronously loads the component for PlantCycleCountSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantCycleCountSpr = lazyLoad(
    () => import('./PlantCycleCountSpr'),
    (module) => module.PlantCycleCountSprWidget,
);

export default PlantCycleCountSpr;

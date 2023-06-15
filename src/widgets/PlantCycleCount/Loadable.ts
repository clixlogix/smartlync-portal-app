/**
 *
 * Asynchronously loads the component for PlantCycleCount
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantCycleCount = lazyLoad(
    () => import('./PlantCycleCount'),
    (module) => module.PlantCycleCountWidget,
);

export default PlantCycleCount;

/**
 *
 * Asynchronously loads the component for PlantCycleAverages
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantCycleAverages = lazyLoad(
    () => import('./PlantCycleAverages'),
    (module) => module.PlantCycleAveragesWidget,
);

export default PlantCycleAverages;

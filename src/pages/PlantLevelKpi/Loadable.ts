/**
 *
 * Asynchronously loads the component for PlantLevelKpi
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantLevelKpi = lazyLoad(
    () => import('./PlantLevelKpi'),
    (module) => module.PlantLevelKpi,
);

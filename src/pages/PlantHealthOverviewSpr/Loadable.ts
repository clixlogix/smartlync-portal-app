/**
 *
 * Asynchronously loads the component for PlantHealthOverviewSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantHealthOverviewSpr = lazyLoad(
    () => import('./PlantHealthOverviewSpr'),
    (module) => module.PlantHealthOverviewSpr,
);

export default PlantHealthOverviewSpr;

/**
 *
 * Asynchronously loads the component for PlantHealthOverview
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantHealthOverview = lazyLoad(
    () => import('./PlantHealthOverview'),
    (module) => module.PlantHealthOverview,
);

export default PlantHealthOverview;

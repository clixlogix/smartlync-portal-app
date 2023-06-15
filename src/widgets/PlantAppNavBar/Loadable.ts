/**
 *
 * Asynchronously loads the component for PlantAppNavBar
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantAppNavBar = lazyLoad(
    () => import('./PlantAppNavBar'),
    (module) => module.PlantAppNavBarWidget,
);

export default PlantAppNavBar;

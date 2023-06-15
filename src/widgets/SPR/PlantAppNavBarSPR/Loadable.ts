/**
 *
 * Asynchronously loads the component for PlantAppNavBarSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantAppNavBarSpr = lazyLoad(
    () => import('./PlantAppNavBarSpr'),
    (module) => module.PlantAppNavBarSprWidget,
);

export default PlantAppNavBarSpr;

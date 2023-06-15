/**
 *
 * Asynchronously loads the component for PlantCycleAveragesWidgetSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantCycleAveragesWidgetSpr = lazyLoad(
    () => import('./PlantCycleAveragesWidgetSpr'),
    (module) => module.PlantCycleAveragesWidgetSpr,
);

export default PlantCycleAveragesWidgetSpr;

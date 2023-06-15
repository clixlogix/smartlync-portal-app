/**
 *
 * Asynchronously loads the component for PlantFaultByOccurence
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantFaultByOccurence = lazyLoad(
    () => import('./PlantFaultByOccurence'),
    (module) => module.PlantFaultByOccurenceWidget,
);

export default PlantFaultByOccurence;

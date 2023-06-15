/**
 *
 * Asynchronously loads the component for PlantFaultByDuration
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantFaultByDuration = lazyLoad(
    () => import('./PlantFaultByDuration'),
    (module) => module.PlantFaultByDurationWidget,
);

export default PlantFaultByDuration;

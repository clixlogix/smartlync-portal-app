/**
 *
 * Asynchronously loads the component for PlantFaultByStudType
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantFaultByStudType = lazyLoad(
    () => import('./PlantFaultByStudType'),
    (module) => module.PlantFaultByStudTypeWidget,
);

export default PlantFaultByStudType;

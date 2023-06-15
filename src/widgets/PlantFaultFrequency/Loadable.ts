/**
 *
 * Asynchronously loads the component for PlantFaultFrequency
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantFaultFrequency = lazyLoad(
    () => import('./PlantFaultFrequency'),
    (module) => module.PlantFaultFrequencyWidget,
);

export default PlantFaultFrequency;

/**
 *
 * Asynchronously loads the component for PlantFaultFrequencySpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PlantFaultFrequencySpr = lazyLoad(
    () => import('./PlantFaultFrequencySpr'),
    (module) => module.PlantFaultFrequencyWidget,
);

export default PlantFaultFrequencySpr;

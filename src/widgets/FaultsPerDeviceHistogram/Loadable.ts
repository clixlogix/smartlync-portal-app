/**
 *
 * Asynchronously loads the component for FaultsPerDeviceHistogram
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FaultsPerDeviceHistogram = lazyLoad(
    () => import('./FaultsPerDeviceHistogram'),
    (module) => module.FaultsPerDeviceHistogramWidget,
);

export default FaultsPerDeviceHistogram;

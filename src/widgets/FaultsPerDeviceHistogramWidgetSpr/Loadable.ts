/**
 *
 * Asynchronously loads the component for FaultsPerDeviceHistogramWidgetSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FaultsPerDeviceHistogramWidgetSpr = lazyLoad(
    () => import('./FaultsPerDeviceHistogramWidgetSpr'),
    (module) => module.FaultsPerDeviceHistogramSprWidget,
);

export default FaultsPerDeviceHistogramWidgetSpr;

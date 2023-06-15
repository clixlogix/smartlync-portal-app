/**
 *
 * Asynchronously loads the component for WopRateMeasurementTrend
 *
 */

import { lazyLoad } from 'utils/loadable';

export const WopRateMeasurementTrend = lazyLoad(
    () => import('./WopRateMeasurementTrend'),
    (module) => module.WopRateMeasurementTrendWidget,
);

export default WopRateMeasurementTrend;

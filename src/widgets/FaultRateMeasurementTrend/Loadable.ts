/**
 *
 * Asynchronously loads the component for FaultRateMeasurementTrend
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FaultRateMeasurementTrend = lazyLoad(
    () => import('./FaultRateMeasurementTrend'),
    (module) => module.FaultRateMeasurementTrendWidget,
);

export default FaultRateMeasurementTrend;

/**
 *
 * Asynchronously loads the component for MeasurementTrend
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MeasurementTrend = lazyLoad(
    () => import('./MeasurementTrend'),
    (module) => module.MeasurementTrend,
);

export default MeasurementTrend;

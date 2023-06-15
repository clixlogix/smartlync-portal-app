/**
 *
 * Asynchronously loads the component for PenetrationMeasurementTrend
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PenetrationMeasurementTrend = lazyLoad(
    () => import('./PenetrationMeasurementTrend'),
    (module) => module.PenetrationMeasurementTrendWidget,
);

export default PenetrationMeasurementTrend;

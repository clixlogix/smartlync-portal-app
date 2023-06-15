/**
 *
 * Asynchronously loads the component for StudProjectionMeasurementTrend
 *
 */

import { lazyLoad } from 'utils/loadable';

export const StudProjectionMeasurementTrend = lazyLoad(
    () => import('./StudProjectionMeasurementTrend'),
    (module) => module.StudProjectionMeasurementTrendWidget,
);

export default StudProjectionMeasurementTrend;

/**
 *
 * Asynchronously loads the component for DropTimeMeasurementTrend
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DropTimeMeasurementTrend = lazyLoad(
    () => import('./DropTimeMeasurementTrend'),
    (module) => module.DropTimeMeasurementTrendWidget,
);

export default DropTimeMeasurementTrend;

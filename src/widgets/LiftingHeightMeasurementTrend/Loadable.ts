/**
 *
 * Asynchronously loads the component for LiftingHeightMeasurementTrend
 *
 */

import { lazyLoad } from 'utils/loadable';

export const LiftingHeightMeasurementTrend = lazyLoad(
    () => import('./LiftingHeightMeasurementTrend'),
    (module) => module.LiftingHeightMeasurementTrendWidget,
);

export default LiftingHeightMeasurementTrend;

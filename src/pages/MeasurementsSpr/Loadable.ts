/**
 *
 * Asynchronously loads the component for MeasurementsSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MeasurementsSpr = lazyLoad(
    () => import('./MeasurementsSpr'),
    (module) => module.MeasurementsSpr,
);

export default MeasurementsSpr;

/**
 *
 * Asynchronously loads the component for MeasurementsSprWidget
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MeasurementsSprWidget = lazyLoad(
    () => import('./MeasurementsSprWidget'),
    (module) => module.MeasurementsSprWidget,
);

export default MeasurementsSprWidget;

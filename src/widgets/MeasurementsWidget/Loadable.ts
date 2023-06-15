/**
 *
 * Asynchronously loads the component for MeasurementsWidget
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MeasurementsWidget = lazyLoad(
    () => import('./MeasurementsWidget'),
    (module) => module.MeasurementsWidget,
);

export default MeasurementsWidget;
